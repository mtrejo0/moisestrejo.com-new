"use client";

import React, { useState } from "react";
import axios from 'axios';

const ChessHelp = () => {
  const [imageFile, setImageFile] = useState(null);
  const [boardConfig, setBoardConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post('/api/analyze-chess-board', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBoardConfig(data);
    } catch (error) {
      console.error('Error analyzing chess board:', error);
      setError('Failed to analyze chess board. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chess Board Analyzer</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Chess Board Screenshot
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
        />
      </div>

      {imageFile && (
        <div className="mb-4">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Uploaded chess board"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <p>Analyzing chess board...</p>
        </div>
      )}
      {error && <p className="mt-2 text-red-600">{error}</p>}

      {boardConfig && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Board Configuration</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(boardConfig, null, 2)}
          </pre>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            {boardConfig.debugImages && Object.entries(boardConfig.debugImages).map(([key, url]) => (
              <div key={key}>
                <h3 className="text-lg font-medium mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <img src={url} alt={key} className="rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessHelp;
