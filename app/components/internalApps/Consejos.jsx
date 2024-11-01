"use client"

import React, { useState, useEffect } from 'react';
import consejos from './data/consejos.json';
import { Shuffle } from 'lucide-react';

const Consejos = () => {
  const [currentConsejo, setCurrentConsejo] = useState('');

  useEffect(() => {
    setCurrentConsejo(consejos[Math.floor(Math.random() * consejos.length)]);
  }, []);

  const getRandomConsejo = () => {
    const randomIndex = Math.floor(Math.random() * consejos.length);
    setCurrentConsejo(consejos[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-50 to-white">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 mx-auto mt-16">
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={getRandomConsejo}
            className="w-16 h-16 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
                     transform hover:scale-105 transition-all duration-200 
                     focus:outline-none focus:ring-4 focus:ring-indigo-300
                     shadow-lg hover:shadow-xl flex items-center justify-center"
            aria-label="Get new advice"
          >
            <Shuffle size={28} />
          </button>

          <div className="w-full">
            <p className="text-2xl md:text-3xl font-medium text-gray-800 text-center leading-relaxed">
              {currentConsejo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consejos;
