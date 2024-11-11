"use client";

import { useState, useEffect } from "react";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white">
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-xl font-bold text-center">
          Speech to Text Converter
        </h2>

        {!recognition && (
          <div className="text-red-500 text-center">
            Speech recognition is not supported in this browser.
          </div>
        )}

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your speech will appear here..."
        />

        <button
          className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
          }`}
          onClick={toggleListening}
          disabled={!recognition}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>

        <button
          className="w-full px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={() => setTranscript("")}
        >
          Clear Text
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
