"use client";

import React, { useState, useEffect } from "react";
import consejos from "./data/consejos.json";
import { Shuffle } from "lucide-react";

const quoteLinks = {
  "Échale ganas":
    "https://www.etsy.com/listing/1820240099/echale-ganas-unisex-t-shirt",
  "Ponte trucha":
    "https://www.etsy.com/listing/1806040142/ponte-trucha-unisex-t-shirt",
  "Ahorita estamos, al rato, quién sabe":
    "https://www.etsy.com/listing/1806600744/ahorita-estamos-unisex-t-shirt",
};

const Consejos = () => {
  const [currentConsejo, setCurrentConsejo] = useState("");

  useEffect(() => {
    const randomConsejo = consejos[Math.floor(Math.random() * consejos.length)];
    setCurrentConsejo(randomConsejo);
  }, []);

  const getRandomConsejo = () => {
    const randomIndex = Math.floor(Math.random() * consejos.length);
    const randomConsejo = consejos[randomIndex];
    setCurrentConsejo(randomConsejo);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-50 to-white ">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 mx-auto mt-16 min-h-[250px]">
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

      <div className="w-full max-w-md flex flex-col gap-4 mt-32">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          T-shirts for sale 👕
        </h2>
        {Object.entries(quoteLinks).map(([quote, link]) => (
          <a
            key={quote}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-center flex items-center justify-center gap-2"
          >
            {quote}{" "}
            {quote === "Échale ganas"
              ? "💪"
              : quote === "Ponte trucha"
                ? "🐟"
                : "⏳"}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Consejos;
