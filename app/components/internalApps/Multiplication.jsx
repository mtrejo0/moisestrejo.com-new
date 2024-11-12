"use client";

import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";

const Multiplication = () => {
  const [started, setStarted] = useState(false);
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const inputRefs = useRef({});

  const generateProblems = (count = 25) => {
    const newProblems = [];
    const usedCombos = new Set();

    while (newProblems.length < count) {
      const x = Math.floor(Math.random() * 12) + 1;
      const y = Math.floor(Math.random() * 12) + 1;
      
      // Create a unique key for this combination
      const comboKey = `${Math.min(x,y)},${Math.max(x,y)}`;
      
      if (!usedCombos.has(comboKey)) {
        usedCombos.add(comboKey);
        newProblems.push({ id: newProblems.length, x, y });
      }
    }
    return newProblems;
  };

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setScore({ correct: 0, wrong: 0 });
    setProblems(generateProblems());
    setAnswers({});
    setShowResults(false);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleStop = () => {
    setStarted(false);
    setEndTime(Date.now());
    setShowResults(true);
    
    // Calculate score
    let correct = 0;
    let wrong = 0;
    problems.forEach(problem => {
      const userAnswer = parseInt(answers[problem.id]) || 0;
      if (userAnswer === problem.x * problem.y) {
        correct++;
      } else {
        wrong++;
      }
    });
    setScore({ correct, wrong });
  };

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const downloadPuzzleAsPDF = () => {
    const doc = new jsPDF();
    const fontSize = 12;
    const lineHeight = fontSize * 1.5; // Increased line height for stacked layout
    const margin = 20;
    let y = margin;

    // Add title
    doc.setFontSize(16);
    const title = "Multiplication Practice";
    const titleWidth = (doc.getStringUnitWidth(title) * 16) / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, y);
    y += lineHeight * 1;

    // Add problems in a grid layout
    doc.setFontSize(fontSize);
    const problemsPerRow = 5; 
    const columnWidth = (doc.internal.pageSize.width - 2 * margin) / problemsPerRow;
    const rowSpacing = lineHeight * 3; 

    problems.forEach((problem, index) => {
      const row = Math.floor(index / problemsPerRow);
      const col = index % problemsPerRow;
      const x = margin + (col * columnWidth);
      const currentY = y + (row * rowSpacing);

      // Stacked multiplication problem
      const problemText = [
        `   ${problem.x}`,
        `× ${problem.y}`,
        `= ____`
      ];

      doc.text(problemText, x, currentY);
    });

    doc.save("multiplication_practice.pdf");
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Multiplication Practice
      </h1>

      {!started && !showResults && (
        <div>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
          >
            Start Practice
          </button>
        </div>
      )}

      {started && (
        <div className="space-y-8">
          <div className="grid grid-cols-5 gap-4">
            {problems.map((problem, index) => (
              <div key={problem.id} className="bg-white p-4 rounded-lg shadow">
                <div className="text-xl font-bold text-center mb-2">
                  {problem.x} × {problem.y} = ?
                </div>
                <input
                  ref={el => inputRefs.current[problem.id] = el}
                  type="number"
                  value={answers[problem.id] || ''}
                  onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                  className="w-full p-2 text-lg text-center border rounded"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleStop}
              className="px-8 py-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Submit Answers
            </button>
            <button
              onClick={downloadPuzzleAsPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {showResults && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Results</h2>
          <div className="text-lg">
            <p>Correct Answers: {score.correct}</p>
            <p>Wrong Answers: {score.wrong}</p>
            <p>
              Time Taken:{" "}
              {((endTime - startTime) / 1000).toFixed(1)} seconds
            </p>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Multiplication;
