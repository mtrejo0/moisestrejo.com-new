"use client";

import { useState, useEffect } from "react";

const Modle = () => {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [validWords, setValidWords] = useState(new Set());

  useEffect(() => {
    // Fetch words from GitHub
    fetch("https://raw.githubusercontent.com/tabatkins/wordle-list/main/words")
      .then((response) => response.text())
      .then((text) => {
        const words = text
          .split("\n")
          .map((word) => word.toUpperCase())
          .filter((word) => word.length === 5);
        setValidWords(new Set(words));
        setWord(words[Math.floor(Math.random() * words.length)]);
      });
  }, []);

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      setMessage("Guess must be 5 letters!");
      return;
    }

    const formattedGuess = currentGuess.toUpperCase();

    // Add validation for real words
    if (!validWords.has(formattedGuess)) {
      setMessage("Not a valid word!");
      return;
    }

    const newGuesses = [...guesses, formattedGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");
    setMessage(""); // Clear any error messages

    if (formattedGuess === word) {
      setMessage("You won!");
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setMessage(`Game Over! The word was ${word}`);
      setGameOver(true);
    }
  };

  const getLetterColor = (letter, index) => {
    if (letter === word[index]) {
      return "bg-green-600"; // Correct position
    } else if (word.includes(letter)) {
      return "bg-yellow-600"; // Wrong position
    }
    return "bg-gray-700"; // Not in word
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Modle</h1>

      <div className="space-y-2 mb-8">
        {guesses.map((guess, i) => (
          <div key={i} className="flex justify-center gap-1">
            {guess.split("").map((letter, j) => (
              <div
                key={j}
                className={`w-14 h-14 flex items-center justify-center text-white text-2xl font-bold ${getLetterColor(letter, j)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {[...Array(6 - guesses.length)].map((_, i) => (
          <div key={`empty-${i}`} className="flex justify-center gap-1">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="w-14 h-14 flex items-center justify-center text-white text-2xl font-bold bg-gray-700 border border-gray-600"
              />
            ))}
          </div>
        ))}
      </div>

      {!gameOver && (
        <div className="flex gap-4 justify-center">
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.slice(0, 5))}
            placeholder="Enter guess"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            maxLength={5}
          />
          <button
            onClick={handleGuess}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Guess
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}

      {gameOver && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mx-auto block"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default Modle;
