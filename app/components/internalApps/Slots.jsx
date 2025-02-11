"use client";

import { useState, useEffect } from "react";
import ReactConfetti from 'react-confetti';

const EMOJIS = ["🍎", "🍋", "🍒", "💎", "7️⃣", "🍀"];
const SPIN_DURATION = 2000; // 2 seconds

const SlotMachine = () => {
  const [slots, setSlots] = useState(["🎰", "🎰", "🎰"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRandomEmoji = () => {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  };

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsWinner(false);
    
    // Animate the slots
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setSlots(prev => prev.map(() => getRandomEmoji()));
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        // Final result
        const finalSlots = [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()];
        setSlots(finalSlots);
        setIsSpinning(false);
        
        // Check if all emojis match
        if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
          setIsWinner(true);
        }
      }
    }, SPIN_DURATION / maxSpins);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-[500px] flex flex-col items-center justify-center">
      {isWinner && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <h1 className="text-3xl font-bold text-center mb-8">
        Slot Machine
      </h1>

      <div className="flex gap-4 mb-8">
        {slots.map((emoji, index) => (
          <div
            key={index}
            className={`w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl
              ${isSpinning ? 'animate-bounce' : ''}`}
          >
            {emoji}
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 
          disabled:cursor-not-allowed text-xl font-bold"
      >
        {isSpinning ? "Spinning..." : "SPIN! 🎰"}
      </button>

      {isWinner && (
        <div className="mt-8 text-2xl font-bold text-green-500 animate-bounce">
          🎉 JACKPOT! 🎉
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
