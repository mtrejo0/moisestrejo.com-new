'use client'

import { useState } from 'react';

const CatFacts = () => {
  const [fact, setFact] = useState('');
  const [emojis, setEmojis] = useState([]);
  
  const catEmojiList = ['😺', '😸', '😹', '😻', '😼', '😽', '🐱', '😾', '😿'];

  const fetchCatFact = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setFact(data.fact);
      
      // Generate 3 random positions for cat emojis, accounting for viewport size
      const newEmojis = Array(100).fill().map(() => ({
        emoji: catEmojiList[Math.floor(Math.random() * catEmojiList.length)],
        left: Math.random() * (window.innerWidth), // Subtract emoji width
        top: Math.random() * (window.innerHeight), // Subtract emoji height
      }));
      
      setEmojis(newEmojis);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4">
      <div className="flex flex-col items-center">
        <button
          onClick={fetchCatFact}
          className="w-full max-w-[200px] px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
        >
          Get Cat Fact
        </button>
        
        {fact && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-[90%] mx-auto text-center shadow-sm">
            {fact}
          </div>
        )}
      </div>

      {emojis.map((emojiData, index) => (
        <div
          key={index}
          className="absolute text-4xl"
          style={{
            left: emojiData.left + 'px',
            top: emojiData.top + 'px',
            zIndex: -1,
            transform: 'translate(-50%, -50%)', // Center the emoji
          }}
        >
          {emojiData.emoji}
        </div>
      ))}
    </div>
  );
};

export default CatFacts;
