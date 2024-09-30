import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const WordFinderGenerator = () => {
  const [words, setWords] = useState("");
  const [puzzle, setPuzzle] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const wordsParam = searchParams.get("words");
    if (wordsParam) {
      setWords(wordsParam);
      generatePuzzle(wordsParam);
    }
  }, []);

  const generatePuzzle = (inputWords = words) => {
    const wordList = inputWords.split(",").map(word => word.trim().toUpperCase());
    const size = 15; // Puzzle size (15x15 grid)
    const grid = Array(size).fill().map(() => Array(size).fill(''));

    // Place words in the grid
    wordList.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if (canPlaceWord(grid, word, row, col, direction)) {
          placeWord(grid, word, row, col, direction);
          placed = true;
        }
      }
    });

    // Fill empty spaces with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    // Convert grid to string
    const puzzleString = grid.map(row => row.join(' ')).join('\n');
    setPuzzle(puzzleString);
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    if (direction === 'horizontal' && col + word.length > grid.length) return false;
    if (direction === 'vertical' && row + word.length > grid.length) return false;

    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'horizontal' ? row : row + i;
      const currentCol = direction === 'horizontal' ? col + i : col;
      if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'horizontal' ? row : row + i;
      const currentCol = direction === 'horizontal' ? col + i : col;
      grid[currentRow][currentCol] = word[i];
    }
  };

  const downloadPuzzleAsPDF = () => {
    const doc = new jsPDF();
    const lines = puzzle.split('\n');
    const fontSize = 18;
    const lineHeight = fontSize * 0.5;
    const margin = 20;
    let y = margin;

    doc.setFontSize(16);
    const title = "Vocabulary Puzzle!";
    const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, y);
    y += lineHeight * 2;

    // Add words to find at the top
    doc.setFontSize(fontSize);
    doc.setFont("courier", "bold");
    const wordsArray = words.split(",").map(word => word.trim());
    const wordsToFind = wordsArray.join(" ");
    const textWidth = doc.getStringUnitWidth(wordsToFind) * fontSize / doc.internal.scaleFactor;
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;
    
    if (textWidth > doc.internal.pageSize.width - 40) {
      // If text is too wide, wrap it
      const maxWidth = doc.internal.pageSize.width - 40;
      const lines = doc.splitTextToSize(wordsToFind, maxWidth);
      doc.text(lines, 20, y);
      y += lineHeight * (lines.length + 1);
    } else {
      // If text fits, center it
      doc.text(wordsToFind, centerX, y);
      y += lineHeight * 2;
    }

    doc.setFont("courier", "normal");
    lines.forEach(line => {
      const lineWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
      const lineX = (doc.internal.pageSize.width - lineWidth) / 2;
      doc.text(line, lineX, y);
      y += lineHeight;
    });

    doc.save("word_finder_puzzle.pdf");
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Word Finder Puzzle Generator</h2>
      <p className="mb-2">Enter a list of words separated by commas:</p>
      <textarea
        className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={words}
        onChange={(e) => setWords(e.target.value)}
        placeholder="Enter words..."
      />
      <button
        onClick={() => generatePuzzle()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Generate Puzzle
      </button>
      {puzzle && (
        <div className="mt-8 w-full md:w-2/3 flex flex-col items-center">
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Vocabulary Puzzle!</h3>
              <p className="text-sm md:text-base break-words mb-4">{words}</p>
              <pre className="inline-block text-left text-xs md:text-sm font-mono tracking-wider leading-relaxed whitespace-pre-wrap">
                {puzzle}
              </pre>
            </div>
          </div>
          <button
            onClick={downloadPuzzleAsPDF}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Download as PDF
          </button>
        </div>
      )}
      <p className="mt-6 text-sm italic text-gray-600">
        Inspired by my role model George Apostol
      </p>
    </div>
  );
};

export default WordFinderGenerator;
