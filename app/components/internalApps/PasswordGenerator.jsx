"use client";

import { useState } from "react";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSpecial) chars += special;

    if (chars === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white">
      <h2 className="text-3xl font-bold mb-8">Password Generator</h2>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Password Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="mr-2"
            />
            <label>Include Uppercase Letters</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="mr-2"
            />
            <label>Include Lowercase Letters</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="mr-2"
            />
            <label>Include Numbers</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeSpecial}
              onChange={(e) => setIncludeSpecial(e.target.checked)}
              className="mr-2"
            />
            <label>Include Special Characters (!@#$%^&*)</label>
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Generate Password
        </button>

        {password && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-mono break-all">{password}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
