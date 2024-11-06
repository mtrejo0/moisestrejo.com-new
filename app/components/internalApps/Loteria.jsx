"use client"

import React, { useState, useEffect } from 'react';

const loteriaCards = [
  { text: 'El Gallo', emoji: '🐓' }, { text: 'El Diablito', emoji: '😈' }, { text: 'La Dama', emoji: '👒' },
  { text: 'El Catrín', emoji: '🎩' }, { text: 'El Paraguas', emoji: '☂️' }, { text: 'La Sirena', emoji: '🧜‍♀️' },
  { text: 'La Escalera', emoji: '🪜' }, { text: 'La Botella', emoji: '🍾' }, { text: 'El Barril', emoji: '🛢️' },
  { text: 'El Árbol', emoji: '🌳' }, { text: 'El Melón', emoji: '🍈' }, { text: 'El Valiente', emoji: '⚔️' },
  { text: 'El Gorrito', emoji: '🎩' }, { text: 'La Muerte', emoji: '💀' }, { text: 'La Pera', emoji: '🍐' },
  { text: 'La Bandera', emoji: '🏳️' }, { text: 'El Bandolón', emoji: '🪕' }, { text: 'El Violoncello', emoji: '🎻' },
  { text: 'La Garza', emoji: '🦢' }, { text: 'El Pájaro', emoji: '🦜' }, { text: 'La Mano', emoji: '✋' },
  { text: 'La Bota', emoji: '👢' }, { text: 'La Luna', emoji: '🌙' }, { text: 'El Cotorro', emoji: '🦜' },
  { text: 'El Borracho', emoji: '🍺' }, { text: 'El Negrito', emoji: '👤' }, { text: 'El Corazón', emoji: '❤️' },
  { text: 'La Sandía', emoji: '🍉' }, { text: 'El Tambor', emoji: '🥁' }, { text: 'El Camarón', emoji: '🦐' },
  { text: 'Las Jaras', emoji: '🎯' }, { text: 'El Músico', emoji: '🎵' }, { text: 'La Araña', emoji: '🕷️' },
  { text: 'El Soldado', emoji: '💂' }, { text: 'La Estrella', emoji: '⭐' }, { text: 'El Cazo', emoji: '🍲' }
];

const Loteria = () => {
  const [board, setBoard] = useState(null);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [currentCard, setCurrentCard] = useState(null);
  const [calledCards, setCalledCards] = useState([]);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  function generateBoard() {
    const shuffled = [...loteriaCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 16);
  }

  function handleCardClick(index) {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  function handleNewBoard() {
    setBoard(generateBoard());
    setSelectedCards(new Set());
    setCalledCards([]);
    setCurrentCard(null);
  }

  function callRandomCard() {
    const remainingCards = loteriaCards.filter(card => !calledCards.includes(card));
    if (remainingCards.length > 0) {
      const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
      setCurrentCard(randomCard);
      setCalledCards(prev => [...prev, randomCard]);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      {board ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Lotería</h1>
            <button 
              onClick={handleNewBoard}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              New Board
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {board.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`relative aspect-square border-2 ${
                  selectedCards.has(index) ? 'border-indigo-600' : 'border-gray-300'
                } rounded-lg p-4 cursor-pointer hover:border-indigo-400 transition-colors flex flex-col items-center justify-center`}
              >
                {selectedCards.has(index) && (
                  <div className="absolute top-1 right-1 text-4xl">🫘</div>
                )}
                <span className={`text-3xl mb-2 ${selectedCards.has(index) ? 'text-gray-400' : ''}`}>
                  {card.emoji}
                </span>
                <span className={`text-center text-sm font-medium ${selectedCards.has(index) ? 'text-gray-400' : ''}`}>
                  {card.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={callRandomCard}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 mb-4"
            >
              Call Next Card
            </button>
            {currentCard && (
              <div className="text-center">
                <div className="text-6xl mb-2">{currentCard.emoji}</div>
                <div className="text-xl font-bold">{currentCard.text}</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </div>
  );
};

export default Loteria;
