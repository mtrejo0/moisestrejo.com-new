"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

const Sundoku = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [grid, setGrid] = useState(null);

  // Helper to check if number can be placed in cell
  const isValid = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  };

  // Generate solved Sudoku grid
  const generateSolvedGrid = () => {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    
    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve();
    return board;
  };

  // Generate puzzle by removing numbers from solved grid
  const generatePuzzle = (difficulty) => {
    const solvedGrid = generateSolvedGrid();
    const puzzle = solvedGrid.map(row => [...row]);
    
    let cellsToRemove;
    switch(difficulty) {
      case "easy":
        cellsToRemove = 35; // Leaves ~46 numbers
        break;
      case "medium": 
        cellsToRemove = 45; // Leaves ~36 numbers
        break;
      case "hard":
        cellsToRemove = 55; // Leaves ~26 numbers
        break;
      default:
        cellsToRemove = 35;
    }
    // Create array of all cell positions
    const positions = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }

    // Shuffle positions array
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Remove cells in random order
    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
      }
    }

    setGrid(puzzle);
  };

  const downloadPuzzleAsPDF = () => {
    if (!grid) return;

    const doc = new jsPDF();
    const cellSize = 20;
    const margin = 20;
    
    // Draw title
    doc.setFontSize(16);
    doc.text("Sudoku Puzzle", 105, 10, { align: "center" });
    
    // Draw grid
    doc.setLineWidth(0.5);
    for (let i = 0; i <= 9; i++) {
      // Thicker lines for 3x3 boxes
      doc.setLineWidth(i % 3 === 0 ? 1.5 : 0.5);
      
      // Horizontal lines
      doc.line(margin, margin + i * cellSize, margin + 9 * cellSize, margin + i * cellSize);
      // Vertical lines
      doc.line(margin + i * cellSize, margin, margin + i * cellSize, margin + 9 * cellSize);
    }

    // Add numbers
    doc.setFontSize(12);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          doc.text(
            grid[row][col].toString(),
            margin + col * cellSize + cellSize/2,
            margin + row * cellSize + cellSize/2 + 4,
            { align: "center" }
          );
        }
      }
    }

    doc.save("sudoku_puzzle.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        Sudoku Generator
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={() => generatePuzzle(difficulty)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Puzzle
        </button>
      </div>

      {grid && (
        <>
          <div className="grid grid-cols-9 gap-0 mb-8 max-w-md mx-auto">
            {grid.flat().map((cell, idx) => (
              <div 
                key={idx}
                className={`
                  w-10 h-10 border flex items-center justify-center font-bold
                  ${idx % 9 === 2 || idx % 9 === 5 ? 'border-r-2' : ''}
                  ${Math.floor(idx / 9) === 2 || Math.floor(idx / 9) === 5 ? 'border-b-2' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={downloadPuzzleAsPDF}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sundoku;
