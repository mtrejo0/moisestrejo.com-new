"use client";

import { useState, useEffect, useRef } from "react";

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const audioContextRef = useRef(null);

  const colors = ["red", "green", "blue", "yellow"];

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
    };

    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const playTone = (frequency) => {
    if (!audioContextRef.current) return;

    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.5;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, 200);
    } catch (err) {
      console.error("Error playing tone:", err);
    }
  };

  const colorToFrequency = {
    red: 329.63, // E4
    green: 392.0, // G4
    blue: 440.0, // A4
    yellow: 493.88, // B4
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    addToSequence();
  };

  const addToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, newColor]);
  };

  const playSequence = async () => {
    setIsPlaying(true);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      playTone(colorToFrequency[sequence[i]]);
      document.getElementById(sequence[i]).classList.add("active");
      await new Promise((resolve) => setTimeout(resolve, 300));
      document.getElementById(sequence[i]).classList.remove("active");
    }
    setIsPlaying(false);
  };

  const handleColorClick = (color) => {
    if (isPlaying || gameOver) return;

    playTone(colorToFrequency[color]);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    if (color !== sequence[currentIndex]) {
      setGameOver(true);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      playSequence();
    }
  }, [sequence]);

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-8">Simon Says</h2>

      {gameOver ? (
        <div className="text-center mb-8">
          <h3 className="text-2xl text-red-600 mb-4">Game Over!</h3>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={startGame}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="text-center mb-8">
          <p className="text-xl mb-4">Score: {score}</p>
          {!isPlaying && sequence.length === 0 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={startGame}
            >
              Start Game
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <div
            key={color}
            id={color}
            className={`w-32 h-32 rounded-lg cursor-pointer transition-opacity
              ${color === "red" ? "bg-red-500" : ""}
              ${color === "green" ? "bg-green-500" : ""}
              ${color === "blue" ? "bg-blue-500" : ""}
              ${color === "yellow" ? "bg-yellow-500" : ""}
              hover:opacity-80`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      <style jsx>{`
        .active {
          filter: brightness(1.5);
        }
      `}</style>
    </div>
  );
};

export default SimonSays;
