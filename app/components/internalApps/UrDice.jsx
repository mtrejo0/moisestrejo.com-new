"use client"

import { useState } from "react";

function UrDiceGame() {
  const [dice, setDice] = useState([0, 0, 0, 0]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);

    setTimeout(() => {
      setRolling(false);
      setDice(Array.from({ length: 4 }, () => (Math.random() < 0.25 ? 1 : 0)));
    }, 600);
  };

  const total = dice.reduce((sum, die) => sum + die, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Game of Ur - Dice Roll</h1>
      <a
        href="https://playur.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline text-lg mb-2"
      >
        Play Online
      </a>
      <a
        href="https://www.getty.edu/education/college/ancient_rome_at_home/pdf/ur_game.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline text-lg"
      >
        Print the Board
      </a>

      <div className="mt-8 flex gap-4">
        {dice.map((die, index) => (
          <div
            key={index}
            className="w-16 h-16 flex items-center justify-center border-2 border-white text-3xl font-bold rounded-lg bg-gray-800 shadow-lg"
          >
            {die === 1 ? "●" : "○"}
          </div>
        ))}
      </div>

      <h2 className="text-2xl mt-4">Total: {total}</h2>

      <button
        onClick={roll}
        disabled={rolling}
        className="mt-6 px-6 py-3 text-lg font-bold rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 transition-all"
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
}

export default UrDiceGame;