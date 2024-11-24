"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';

const FaceScorer = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadModels();
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      ]);
      setIsModelLoaded(true);
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const analyzeFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    setAnalyzing(true);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // For mobile, run once. For desktop, set up interval
    const analyzeOnce = async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections) {
        const landmarks = detections.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const jawline = landmarks.getJawOutline();
        const nose = landmarks.getNose();
        const mouth = landmarks.getMouth();

        // Draw landmarks on canvas
        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw dots for each landmark
        const drawDot = (point, color = '#FF0000') => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI); // Increased dot size from 2 to 4
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#000000'; // Add black outline
          ctx.lineWidth = 1;
          ctx.stroke();
        };
        // Draw all landmarks
        landmarks.positions.forEach(point => drawDot(point, '#FF0000'));

        // Calculate measurements
        const headWidth = Math.abs(jawline[0].x - jawline[16].x);

        const leftEyeAvg = {
          x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
          y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
        };
        const rightEyeAvg = {
          x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
          y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
        };

        drawDot(leftEyeAvg, "blue")
        drawDot(rightEyeAvg, "blue")

        const eyeCenterDistance = Math.abs(leftEyeAvg.x - rightEyeAvg.x);
        const leftEyeWidth = Math.abs(leftEye[3].x - leftEye[0].x);
        const rightEyeWidth = Math.abs(rightEye[3].x - rightEye[0].x);
        const avgEyeWidth = (leftEyeWidth + rightEyeWidth) / 2;

        const eyeDistanceEdges = Math.abs(leftEye[3].x - rightEye[0].x);

        const eyeDistanceToWidthRatio = (eyeDistanceEdges / avgEyeWidth).toFixed(2);

        const topLipHeight = Math.abs(mouth[14].y - mouth[9].y); // Upper lip height (middle points)
        const bottomLipHeight = Math.abs(mouth[18].y - mouth[2].y); // Lower lip height (middle points)
        const lipRatio = (bottomLipHeight / topLipHeight).toFixed(2);

        // Calculate nose tip to lips to chin ratio
        const noseTop = nose[0]; // top of our nose
        drawDot(noseTop, "blue")
        const lipsCenter = {
          x: (mouth[14].x + mouth[18].x) / 2,
          y: (mouth[14].y + mouth[18].y) / 2
        };
        drawDot(lipsCenter, "blue")

        const chinBottom = jawline[8]; // bottom point of chin
        drawDot(chinBottom, "blue")

        const noseToLipsDistance = Math.abs(noseTop.y - lipsCenter.y);
        const lipsToChinDistance = Math.abs(lipsCenter.y - chinBottom.y);
        const noseToLipsToJawRatio = (noseToLipsDistance / lipsToChinDistance).toFixed(2);

        setMeasurements({
          headWidth: Math.round(headWidth),
          eyeWidth: Math.round(avgEyeWidth),
          eyeDistance: Math.round(eyeCenterDistance),
          eyeDistanceToWidthRatio,
          topLipHeight: Math.round(topLipHeight),
          bottomLipHeight: Math.round(bottomLipHeight),
          lipRatio,
          eyeDistanceEdges: Math.round(eyeDistanceEdges),
          noseToLipsToJawRatio,
          noseToLipsDistance: Math.round(noseToLipsDistance),
          lipsToChinDistance: Math.round(lipsToChinDistance),
        });
      }
    };

    if (isMobile) {
      await analyzeOnce();
      setAnalyzing(false);
    } else {
      // Create new interval for updating dots (desktop only)
      intervalRef.current = setInterval(analyzeOnce, 100);
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        Face Measurements
      </h1>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={isMobile ? undefined : analyzeFace}
          width={640}
          height={480}
          className="w-full rounded-lg shadow-lg"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {!isModelLoaded ? (
          <p className="text-lg">Loading face detection models...</p>
        ) : (
          <>
            <button
              onClick={startVideo}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Camera
            </button>

            <button
              onClick={analyzeFace}
              disabled={analyzing}
              className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Analyze Face"}
            </button>

            {measurements !== null && (
              <div className="mt-4 text-left w-full max-w-md">
                <h3 className="text-xl font-semibold mb-2">Measurements (pixels)</h3>
                <ul className="space-y-2">
                  <li>Head Width (Side-Side): {measurements.headWidth}</li>
                  <br/>

                  <li>Eye to Eye, edge to edge, distance: {measurements.eyeDistanceEdges}</li>
                  <li>Average Eye Width: {measurements.eyeWidth}</li>
                  <li>Eye Distance-to-Width Ratio: {measurements.eyeDistanceToWidthRatio}
                    <span className="text-gray-600 ml-2">
                      (Golden Ratio: 1.618)
                    </span>
                  </li>
                  <br/>

                  <li>Bottom Lip Height: {measurements.bottomLipHeight}</li>
                  <li>Top Lip Height: {measurements.topLipHeight}</li>
                  <li>Lip Height Ratio: {measurements.lipRatio}
                    <span className="text-gray-600 ml-2">
                      (Golden Ratio: 1.618)
                    </span>
                  </li>
                  <br/>
                  <li>Nose Top to Lips Center: {measurements.noseToLipsDistance}</li>
                  <li>Lips Center to Chin: {measurements.lipsToChinDistance}</li>
                  <li>Nose-to-Lips-to-Jaw Ratio: {measurements.noseToLipsToJawRatio}
                    <span className="text-gray-600 ml-2">
                      (Golden Ratio: 1.618)
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaceScorer;
