"use client";

import { useState } from "react";

const JSONBeautify = () => {
  const [inputJSON, setInputJSON] = useState("");
  const [outputJSON, setOutputJSON] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const normalizedInput = e.target.value
      .replace(/[\u201C\u201D]/g, '"') // Replace curly quotes with straight quotes
      .replace(/[\u2018\u2019]/, "'") // Replace curly single quotes with straight single quotes
      .trim(); // Remove leading/trailing whitespace
    setInputJSON(e.target.value);
    try {
      const parsed = JSON.parse(normalizedInput);
      setOutputJSON(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON");
      setOutputJSON("");
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-8">JSON Beautifier</h2>

      <div className="w-full flex gap-4">
        {/* Input Section */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Input JSON
          </label>
          <textarea
            value={inputJSON}
            onChange={handleInputChange}
            className="w-full h-[500px] p-4 font-mono text-sm border rounded bg-white"
            placeholder="Paste your JSON here..."
          />
        </div>

        {/* Output Section */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Beautified JSON
            {error && <span className="text-red-500 ml-2">{error}</span>}
          </label>
          <pre className="w-full h-[500px] p-4 font-mono text-sm border rounded bg-gray-50 overflow-auto">
            {outputJSON}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JSONBeautify;
