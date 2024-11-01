"use client"

import React, { useState } from 'react';
import { consejos } from './data/consejos';
import { Shuffle } from 'lucide-react';

const Consejos = () => {
  const [currentConsejo, setCurrentConsejo] = useState(consejos[Math.floor(Math.random() * consejos.length)]);

  const getRandomConsejo = () => {
    const randomIndex = Math.floor(Math.random() * consejos.length);
    setCurrentConsejo(consejos[randomIndex]);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-16">
      <button
        onClick={getRandomConsejo}
        className="w-full mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
      >
        <Shuffle size={20} />
      </button>

      <div className="flex justify-center">
        <p className="text-3xl text-gray-800 text-center">{currentConsejo}</p>
      </div>
    </div>
  );
};

export default Consejos;
