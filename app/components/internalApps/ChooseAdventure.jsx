"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import adventureData from './data/choose_adventure.json';

const ChooseAdventure = () => {
  const [currentScene, setCurrentScene] = useState(adventureData.start);

  const handleChoice = (nextSceneId) => {
    setCurrentScene(adventureData[nextSceneId]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-8">
        {currentScene && (
          <>
            <p className="text-lg mb-6">{currentScene.text}</p>

            <div className="space-y-3 mb-6">
              {currentScene?.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice?.next)}
                  className="w-full p-3 text-left rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {choice?.text}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Image
                src={`/scripts/images/${currentScene.id}.png`}
                alt={currentScene.text}
                width={512}
                height={512}
                className="w-1/2 rounded-lg"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChooseAdventure;
