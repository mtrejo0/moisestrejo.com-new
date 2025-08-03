"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';

const ScreenTooHigh = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [posture, setPosture] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [postureScore, setPostureScore] = useState(0);
  const [targetCurvature, setTargetCurvature] = useState(70);
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to load then start analysis automatically
        videoRef.current.onloadedmetadata = () => {
          analyzePosture();
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const calculateFacePlaneAngle = (landmarks) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const noseTip = landmarks.getNose()[3]; // nose tip
    const jawline = landmarks.getJawOutline();

    // Calculate eye centers
    const leftEyeCenter = {
      x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
      y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
    };
    const rightEyeCenter = {
      x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
      y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
    };

    // Calculate head tilt (roll) - should be 0° for proper posture
    const eyeVector = {
      x: rightEyeCenter.x - leftEyeCenter.x,
      y: rightEyeCenter.y - leftEyeCenter.y
    };
    const rollAngle = Math.atan2(eyeVector.y, eyeVector.x) * (180 / Math.PI);

    // Calculate left/right turn (yaw) - nose should be centered between eyes
    const faceCenter = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const noseOffset = noseTip.x - faceCenter;
    const faceWidth = Math.abs(jawline[0].x - jawline[16].x);
    const yawAngle = (noseOffset / faceWidth) * 60; // scaled for sensitivity

    // Calculate vertical eye position relative to optimal level (1/3 from top)
    const videoHeight = videoRef.current?.videoHeight || 480;
    const eyeLevel = (leftEyeCenter.y + rightEyeCenter.y) / 2;
    const optimalEyeLevel = videoHeight / 3; // 1/3 from top of screen
    const verticalOffset = (eyeLevel - optimalEyeLevel) / (videoHeight / 3); // -1 to 1

    // Calculate pitch using jawline curvature (face plane angle)
    // Measure how much the jawline deviates from a straight line between points 4 and 12
    const leftJaw = jawline[4]; // left side of jaw
    const rightJaw = jawline[12]; // right side of jaw
    
    // Calculate deviations of intermediate jawline points from straight line
    let totalDeviation = 0;
    const numPoints = rightJaw - leftJaw - 1; // points between 4 and 12
    
    for (let i = 5; i < 12; i++) {
      const point = jawline[i];
      
      // Calculate where this point should be on the straight line
      const progress = (i - 4) / (12 - 4); // 0 to 1
      const expectedX = leftJaw.x + progress * (rightJaw.x - leftJaw.x);
      const expectedY = leftJaw.y + progress * (rightJaw.y - leftJaw.y);
      
      // Calculate distance from expected straight line position
      const deviation = Math.sqrt(
        Math.pow(point.x - expectedX, 2) + 
        Math.pow(point.y - expectedY, 2)
      );
      
      totalDeviation += deviation;
    }
    
    // Average deviation - higher = more curved (good), lower = straighter (bad)
    const curvatureScore = totalDeviation / (12 - 4 - 1);
    
    // Convert to angle-like measurement for display
    const pitchAngle = curvatureScore * 2; // Scale for better display

    return {
      roll: rollAngle,
      pitch: pitchAngle,
      yaw: yawAngle,
      verticalOffset: verticalOffset,
      eyeLevel: eyeLevel,
      optimalEyeLevel: optimalEyeLevel
    };
  };

  const analyzePosture = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    setAnalyzing(true);

    const analyzeOnce = async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections) {
        const landmarks = detections.landmarks;
        const angles = calculateFacePlaneAngle(landmarks);

        // Draw visual feedback on canvas
        const canvas = canvasRef.current;
        const displaySize = { 
          width: videoRef.current.videoWidth, 
          height: videoRef.current.videoHeight 
        };
        faceapi.matchDimensions(canvas, displaySize);
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw face outline
        const jawline = landmarks.getJawOutline();
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(jawline[0].x, jawline[0].y);
        jawline.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();

        // Draw eye line
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const leftEyeCenter = {
          x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
          y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
        };
        const rightEyeCenter = {
          x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
          y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
        };

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftEyeCenter.x, leftEyeCenter.y);
        ctx.lineTo(rightEyeCenter.x, rightEyeCenter.y);
        ctx.stroke();

        // Draw ideal eye level line
        ctx.strokeStyle = '#0080FF';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, angles.optimalEyeLevel);
        ctx.lineTo(canvas.width, angles.optimalEyeLevel);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw straight line between jaw points 4 and 12
        const leftJaw = jawline[4];
        const rightJaw = jawline[12];
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(leftJaw.x, leftJaw.y);
        ctx.lineTo(rightJaw.x, rightJaw.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw actual jawline curve for comparison
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(jawline[4].x, jawline[4].y);
        for (let i = 5; i <= 12; i++) {
          ctx.lineTo(jawline[i].x, jawline[i].y);
        }
        ctx.stroke();
        
        // Draw deviation points
        for (let i = 5; i < 12; i++) {
          const point = jawline[i];
          const progress = (i - 4) / (12 - 4);
          const expectedX = leftJaw.x + progress * (rightJaw.x - leftJaw.x);
          const expectedY = leftJaw.y + progress * (rightJaw.y - leftJaw.y);
          
          // Draw line showing deviation
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(expectedX, expectedY);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }

        // Calculate posture score based on key factors
        let score = 100;
        let feedbackMessages = [];

        // Check head tilt (roll) - should be level
        if (Math.abs(angles.roll) > 5) {
          const penalty = Math.abs(angles.roll) * 2;
          score -= penalty;
          feedbackMessages.push(`Head tilted ${angles.roll > 0 ? 'right' : 'left'} by ${Math.abs(angles.roll).toFixed(1)}°`);
        }

        // Check jawline curvature against personal target
        const curvatureDiff = Math.abs(angles.pitch - targetCurvature);
        const maxAcceptableDiff = 15; // Within 15 points of target is good
        
        if (curvatureDiff > maxAcceptableDiff) {
          const penalty = (curvatureDiff - maxAcceptableDiff) * 2;
          score -= penalty;
          
          if (angles.pitch < targetCurvature) {
            feedbackMessages.push(`Jawline too straight (${angles.pitch.toFixed(1)}) - target: ${targetCurvature}. Likely looking up too much.`);
          } else {
            feedbackMessages.push(`Jawline too curved (${angles.pitch.toFixed(1)}) - target: ${targetCurvature}. Likely looking down too much.`);
          }
        }

        // Check left/right turn (yaw) - should face camera directly
        if (Math.abs(angles.yaw) > 10) {
          const penalty = Math.abs(angles.yaw) * 2;
          score -= penalty;
          feedbackMessages.push(`Face turned ${angles.yaw > 0 ? 'right' : 'left'} - face the camera directly`);
        }

        // Check vertical eye positioning - eyes should be at camera level
        if (Math.abs(angles.verticalOffset) > 0.2) {
          const penalty = Math.abs(angles.verticalOffset) * 30;
          score -= penalty;
          if (angles.verticalOffset > 0.2) {
            feedbackMessages.push("Eyes too low - raise your camera or lower your seat");
          } else {
            feedbackMessages.push("Eyes too high - lower your camera or raise your seat");
          }
        }

        score = Math.max(0, Math.round(score));

        // Generate overall feedback with curvature info
        let overallFeedback = "";
        if (score >= 90) {
          overallFeedback = `Excellent posture! Curvature: ${angles.pitch.toFixed(1)}/${targetCurvature} 🎉`;
        } else if (score >= 75) {
          overallFeedback = `Good posture - Curvature: ${angles.pitch.toFixed(1)}/${targetCurvature}`;
        } else if (score >= 50) {
          overallFeedback = `Fair posture - Curvature: ${angles.pitch.toFixed(1)}/${targetCurvature}`;
        } else {
          overallFeedback = `Poor posture - Curvature: ${angles.pitch.toFixed(1)}/${targetCurvature}`;
        }

        setPosture(angles);
        setPostureScore(score);
        setFeedback(feedbackMessages.length > 0 ? feedbackMessages.join(". ") : overallFeedback);
      } else {
        setFeedback("No face detected - ensure you're visible in the camera");
        setPostureScore(0);
      }
    };

    if (isMobile) {
      await analyzeOnce();
      setAnalyzing(false);
    } else {
      intervalRef.current = setInterval(analyzeOnce, 100); // 10 FPS for real-time feedback
    }
  };

  const stopAnalysis = () => {
    setAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Face Plane Angle Detector</h1>
      <p className="text-gray-600 mb-6 text-center">
        Uses computer vision to check if your face plane is perpendicular to the ground and properly aligned with your camera/screen
      </p>

      {!isModelLoaded && (
        <div className="text-center text-blue-500 mb-4">
          Loading face detection models...
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-lg border-2 border-gray-300 rounded-lg"
            onLoadedMetadata={() => {
              if (canvasRef.current && videoRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={startVideo}
            disabled={!isModelLoaded || analyzing}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {analyzing ? 'Camera Active' : 'Start Camera & Analysis'}
          </button>
          <button
            onClick={stopAnalysis}
            disabled={!analyzing}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
          >
            Stop Analysis
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <div className="text-center">
            <label className="block text-lg font-semibold mb-3">
              Personal Target Jawline Curvature: {targetCurvature}
            </label>
            <div className="px-4">
              <input
                type="range"
                min="10"
                max="150"
                value={targetCurvature}
                onChange={(e) => setTargetCurvature(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                disabled={analyzing}
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #eab308 50%, #22c55e 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
              <span>10 (Very Straight)</span>
              <span>150 (Very Curved)</span>
            </div>
            <p className="text-sm text-gray-600 mt-3 px-2">
              <strong>Calibration:</strong> Position yourself in proper posture, start the camera, 
              then adjust this slider until the curvature matches your natural face structure. 
              Start with 70 and fine-tune as needed.
            </p>
          </div>
        </div>

        {postureScore > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Posture Analysis</h2>
            
            <div className="mb-4">
              <span className="text-lg font-semibold">Overall Score: </span>
              <span className={`text-2xl font-bold ${getScoreColor(postureScore)}`}>
                {postureScore}/100
              </span>
            </div>

            {feedback && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-blue-800">{feedback}</p>
              </div>
            )}

            {posture && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Head Tilt: </span>
                    <span className={Math.abs(posture.roll) > 5 ? 'text-red-500' : 'text-green-500'}>
                      {posture.roll.toFixed(1)}°
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Jawline Curvature: </span>
                    <span className={Math.abs(posture.pitch - targetCurvature) > 15 ? 'text-red-500' : 'text-green-500'}>
                      {posture.pitch.toFixed(1)} / {targetCurvature}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Left/Right Turn: </span>
                    <span className={Math.abs(posture.yaw) > 10 ? 'text-red-500' : 'text-green-500'}>
                      {posture.yaw.toFixed(1)}°
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Eye Level: </span>
                    <span className={Math.abs(posture.verticalOffset) > 0.2 ? 'text-red-500' : 'text-green-500'}>
                      {Math.abs(posture.verticalOffset) < 0.1 ? 'Perfect' : Math.abs(posture.verticalOffset) > 0.3 ? 'Poor' : 'Adjust'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <p><span className="text-red-500">●</span> Red solid line: Current eye level</p>
              <p><span className="text-blue-500">- - -</span> Blue dashed line: Optimal eye level (1/3 from top)</p>
              <p><span className="text-green-500">●</span> Green outline: Face detection</p>
              <p><span className="text-red-500">- - -</span> Red dashed line: Straight line between jaw points</p>
              <p><span className="text-purple-500">●</span> Purple solid line: Actual jawline curve</p>
              <p><span className="text-green-500">|</span> Green lines: Deviations from straight line</p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg max-w-lg w-full text-sm">
          <h3 className="font-bold mb-2">Face Plane Alignment Goals:</h3>
          <ul className="space-y-1 text-gray-700">
            <li>• <strong>Head Tilt:</strong> 0° (eyes level, no left/right tilt)</li>
            <li>• <strong>Jawline Curvature:</strong> {targetCurvature} ± 15 (your personal target)</li>
            <li>• <strong>Left/Right Turn:</strong> 0° (nose centered between eyes)</li>
            <li>• <strong>Eye Level:</strong> Camera at eye level (blue dashed line)</li>
            <li>• <strong>Screen Height:</strong> Top of screen at or below eye level</li>
          </ul>
          <p className="mt-2 text-xs text-gray-600 italic">
            Your jawline curvature is personal - adjust the slider above to match your natural face structure 
            when looking straight ahead. The app will then guide you to maintain that optimal position.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenTooHigh;
