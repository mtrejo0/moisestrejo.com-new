"use client"

import { useState } from "react";

const Magic8Ball = () => {
  const [answer, setAnswer] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const answers = [
    "It is certain",
    "It is decidedly so", 
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now", 
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
  ];

  const shakeBall = () => {
    setIsShaking(true);
    setAnswer("");
    
    // Wait for shake animation
    setTimeout(() => {
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setAnswer(randomAnswer);
      setIsShaking(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-8">Magic 8 Ball</h2>
      
      <div 
        className={`w-80 h-80 rounded-full bg-black flex items-center justify-center cursor-pointer transition-transform ${
          isShaking ? 'animate-shake' : 'hover:scale-105'
        }`}
        onClick={shakeBall}
      >
        <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
          <p className="text-center font-bold text-xl p-4">
            {answer || "Ask a question..."}
          </p>
        </div>
      </div>

      <p className="mt-8 text-gray-600 text-lg">Click the ball to ask your question!</p>

      <style jsx>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        
        .animate-shake {
          animation: shake 0.5s;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

export default Magic8Ball;
