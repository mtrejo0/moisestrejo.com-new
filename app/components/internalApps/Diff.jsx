"use client";

import { useState, useEffect } from "react";
import { diffWords } from 'diff';

const Diff = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState([]);

  const calculateDiff = () => {
    const diff = diffWords(text1, text2);
    setDiffResult(diff);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateDiff();
    }, 100);

    return () => clearTimeout(timer);
  }, [text1, text2]);

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-8">Text Diff</h2>

      <div className="w-full flex gap-4">
        {/* First Text Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Original Text
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="w-full h-[300px] p-4 font-mono text-sm border rounded bg-white"
            placeholder="Paste your first text here..."
          />
        </div>

        {/* Second Text Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Modified Text
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="w-full h-[300px] p-4 font-mono text-sm border rounded bg-white"
            placeholder="Paste your second text here..."
          />
        </div>
      </div>

      {/* Diff Output */}
      <div className="w-full mt-8">
        <label className="block text-sm font-medium mb-2">
          Differences
        </label>
        <div className="w-full p-4 font-mono text-sm border rounded bg-gray-50 min-h-[200px] whitespace-pre-wrap overflow-auto">
          {diffResult.map((part, index) => (
            <span
              key={index}
              className={`${
                part.added ? "bg-green-200" : 
                part.removed ? "bg-red-200" : ""
              } px-1 rounded`}
            >
              {part.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diff;
