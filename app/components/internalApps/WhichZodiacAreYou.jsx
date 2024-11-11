"use client";

import React, { useState } from "react";

const questions = [
  {
    text: "How do you typically spend your free time?",
    options: [
      "Being active outdoors",
      "Reading or learning",
      "Socializing with friends",
      "Creative activities",
    ],
  },
  {
    text: "What's your preferred environment?",
    options: [
      "Beach/Water",
      "Mountains/Nature",
      "City/Urban",
      "Cozy indoor spaces",
    ],
  },
  {
    text: "How do you handle conflict?",
    options: [
      "Face it head-on",
      "Analyze and strategize",
      "Try to keep peace",
      "Avoid it",
    ],
  },
  {
    text: "What's your ideal date?",
    options: [
      "Adventure activity",
      "Deep conversation",
      "Social gathering",
      "Romantic dinner",
    ],
  },
  {
    text: "How do you make decisions?",
    options: [
      "Go with gut feeling",
      "Careful analysis",
      "Consider others' input",
      "Follow your heart",
    ],
  },
  {
    text: "What's your biggest strength?",
    options: ["Leadership", "Intelligence", "Empathy", "Creativity"],
  },
  {
    text: "What's your biggest weakness?",
    options: ["Impatience", "Overthinking", "Being too trusting", "Moodiness"],
  },
  {
    text: "What season do you prefer?",
    options: ["Summer", "Fall", "Spring", "Winter"],
  },
  {
    text: "How do you react to change?",
    options: ["Embrace it", "Plan for it", "Go with the flow", "Resist it"],
  },
  {
    text: "What motivates you most?",
    options: ["Success", "Knowledge", "Helping others", "Self-expression"],
  },
];

const zodiacSigns = {
  fire: ["Aries ♈", "Leo ♌", "Sagittarius ♐"],
  earth: ["Taurus ♉", "Virgo ♍", "Capricorn ♑"],
  air: ["Gemini ♊", "Libra ♎", "Aquarius ♒"],
  water: ["Cancer ♋", "Scorpio ♏", "Pisces ♓"],
};

const WhichZodiacAreYou = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const calculateZodiac = () => {
    // Simple algorithm - count tendencies and match to element
    const counts = {
      0: 0, // fire tendencies
      1: 0, // earth tendencies
      2: 0, // air tendencies
      3: 0, // water tendencies
    };

    answers.forEach((answer) => {
      counts[answer]++;
    });

    // Find dominant element
    let maxElement = 0;
    Object.keys(counts).forEach((key) => {
      if (counts[key] > counts[maxElement]) {
        maxElement = key;
      }
    });

    // Get random sign from that element
    const element = ["fire", "earth", "air", "water"][parseInt(maxElement)];
    const possibleSigns = zodiacSigns[element];
    return possibleSigns[Math.floor(Math.random() * possibleSigns.length)];
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (newAnswers.length === questions.length) {
      setResult(calculateZodiac());
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {!result ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Which Zodiac Sign Are You?
          </h1>
          <div className="mb-8">
            <h2 className="text-xl mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-lg mb-4">{questions[currentQuestion].text}</p>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-3 text-left rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your Zodiac Sign Is:</h2>
          <p className="text-5xl mb-8">{result}</p>
          <button
            onClick={resetQuiz}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WhichZodiacAreYou;
