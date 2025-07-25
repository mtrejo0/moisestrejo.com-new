"use client";

import { useState, useEffect } from "react";
import poetry from "../../public/information/poetry.json";

const PoetryItem = ({ poem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {poem.title}
          </h2>
          <span className="text-sm text-gray-500">
            {new Date(poem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="text-gray-600 whitespace-pre-line">
          {poem.text}
        </div>
      </div>
    </div>
  );
};

const Poetry = () => {
  const sortedPoems = [...poetry].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Poetry</h1>
      <div className="grid gap-6">
        {sortedPoems.map((poem, index) => (
          <PoetryItem key={index} poem={poem} />
        ))}
      </div>
    </div>
  );
};

export default Poetry;
