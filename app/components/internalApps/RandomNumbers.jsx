import { useState } from "react";

const RandomNumbers = () => {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(10);
  const [arraySize, setArraySize] = useState(10);
  const [values, setValues] = useState([]);

  const generate = () => {
    let newValues = [];

    for (let i = 0; i < arraySize; i++) {
      const v = Math.floor(Math.random() * (high - low)) + low;
      newValues.push(v);
    }

    setValues(newValues);
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
      <div className="space-y-4 w-full max-w-sm">
        <div>
          <label htmlFor="min" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum value (inclusive):
          </label>
          <input
            id="min"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Enter minimum value"
            value={low}
            onChange={(e) => setLow(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="max" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum value (inclusive):
          </label>
          <input
            id="max"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Enter maximum value"
            value={high}
            onChange={(e) => setHigh(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="arraySize" className="block text-sm font-medium text-gray-700 mb-1">
            Number of random numbers to generate:
          </label>
          <input
            id="arraySize"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Enter array size"
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
          />
        </div>

        <button
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={generate}
        >
          Generate
        </button>

        {values.length > 0 && (
          <div className="p-3 border border-gray-300 rounded-md">
            [{values.join(", ")}]
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomNumbers;
