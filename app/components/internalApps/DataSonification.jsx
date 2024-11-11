"use client";

import { useState, useEffect, useRef } from "react";

const DataSonification = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Default data for testing
  const [noteDelay, setNoteDelay] = useState(200); // Default 200ms delay
  const [attack, setAttack] = useState(0.25);
  const [decay, setDecay] = useState(0.25);
  const [sustain, setSustain] = useState(0.25);
  const [release, setRelease] = useState(0.25);
  const [sustainLevel, setSustainLevel] = useState(0.7); // Sustain amplitude level
  const [timeBetweenNotes, setTimeBetweenNotes] = useState(500); // 500ms between notes
  const [currentIndex, setCurrentIndex] = useState(0); // Add this new state
  const [currentFrequency, setCurrentFrequency] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [nearestNote, setNearestNote] = useState(null);
  const [dataInput, setDataInput] = useState("[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]");
  const [baseFreq, setBaseFreq] = useState(440); // A4 as base frequency
  const [multiplier, setMultiplier] = useState(10);

  // Add these new state variables for input values
  const [noteDelayInput, setNoteDelayInput] = useState("200");
  const [timeBetweenNotesInput, setTimeBetweenNotesInput] = useState("500");
  const [baseFreqInput, setBaseFreqInput] = useState("440");
  const [multiplierInput, setMultiplierInput] = useState("10");

  // Add these preset data arrays
  const presetData = {
    carbonEmissions: {
      name: "US Carbon Emissions by Decade",
      data: [
        358.5, 511.7, 666.2, 827.3, 930.2, 1371.5, 1856.8, 2551.6, 2743.4,
        2897.3, 3060.2, 2990.7,
      ],
      multiplier: 1,
      baseFreq: 0,
    },
    pi: {
      name: "Digits of Pi",
      data: [3, 1, 4, 1, 5, 2, 9],
      multiplier: 10,
      baseFreq: 440,
    },
    powersOfTwo: {
      name: "Powers of 2",
      data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
      multiplier: 1,
      baseFreq: 440,
    },
  };

  const loadPresetData = (preset) => {
    const newData = presetData[preset].data;
    const newMultiplier = presetData[preset].multiplier;
    const newBaseFreq = presetData[preset].baseFreq;
    setData(newData);
    setDataInput(JSON.stringify(newData));
    setMultiplier(newMultiplier);
    setMultiplierInput(String(newMultiplier));
    setBaseFreq(newBaseFreq);
    setBaseFreqInput(String(newBaseFreq));
  };

  const audioContextRef = useRef(null);
  const requestRef = useRef();

  // Standard note frequencies (A4 = 440Hz as reference)
  const standardNotes = {
    C: 261.63,
    "C#": 277.18,
    D: 293.66,
    "D#": 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392.0,
    "G#": 415.3,
    A: 440.0,
    "A#": 466.16,
    B: 493.88,
  };

  const findNearestNote = (freq) => {
    let minDiff = Infinity;
    let nearestNote = "";
    let octave = 4; // Default octave for A440

    for (const [note, baseFreq] of Object.entries(standardNotes)) {
      // Check multiple octaves
      for (let oct = 0; oct < 8; oct++) {
        const noteFreq = baseFreq * Math.pow(2, oct - 4); // Adjust for octave
        const diff = Math.abs(freq - noteFreq);
        if (diff < minDiff) {
          minDiff = diff;
          nearestNote = note;
          octave = oct;
        }
      }
    }

    const cents =
      1200 *
      Math.log2(freq / (standardNotes[nearestNote] * Math.pow(2, octave - 4)));
    return `${nearestNote}${octave} (${cents.toFixed(0)} cents ${cents >= 0 ? "sharp" : "flat"})`;
  };

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
    };

    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const calculateFrequency = (value) => {
    return baseFreq + value * multiplier;
  };

  const playNote = (value) => {
    if (!audioContextRef.current) return;

    try {
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const currentTime = audioContextRef.current.currentTime;
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      const frequency = calculateFrequency(value);
      oscillator.frequency.value = frequency;

      // Update current frequency and value display
      setCurrentFrequency(frequency);
      setCurrentValue(value);
      setNearestNote(findNearestNote(frequency));

      // Calculate ADSR timings based on noteDelay
      const noteDuration = noteDelay / 1000; // Convert to seconds
      const attackTime = noteDuration * attack;
      const decayTime = noteDuration * decay;
      const sustainTime = noteDuration * sustain;
      const releaseTime = noteDuration * release;

      // Apply ADSR envelope
      gainNode.gain.setValueAtTime(0, currentTime);
      // Attack
      gainNode.gain.linearRampToValueAtTime(1, currentTime + attackTime);
      // Decay
      gainNode.gain.linearRampToValueAtTime(
        sustainLevel,
        currentTime + attackTime + decayTime,
      );
      // Sustain (maintain sustainLevel)
      gainNode.gain.setValueAtTime(
        sustainLevel,
        currentTime + attackTime + decayTime + sustainTime,
      );
      // Release
      gainNode.gain.linearRampToValueAtTime(0, currentTime + noteDuration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + noteDuration);
    } catch (err) {
      console.error("Error playing note:", err);
    }
  };

  const animate = () => {
    if (data.length === 0) return;

    playNote(data[currentIndex]);

    // Schedule the next note and index update
    const timeoutId = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, timeBetweenNotes);

    requestRef.current = timeoutId;
  };

  const toggleAnimation = () => {
    if (!isPlaying) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      clearTimeout(requestRef.current);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animate();
    }
  }, [currentIndex, isPlaying]);

  const handleDataChange = (e) => {
    setDataInput(e.target.value);
  };

  const handleSaveData = () => {
    try {
      // First try parsing as JSON
      const newData = JSON.parse(dataInput);
      if (
        Array.isArray(newData) &&
        newData.every((num) => typeof num === "number")
      ) {
        setData(newData);
        return;
      }
    } catch (err) {
      // If JSON parsing fails, try to extract numbers from the input
      const numbers = dataInput
        .replace(/[\[\]\s]/g, "") // Remove brackets and whitespace
        .split(",") // Split by commas
        .filter((str) => str.length > 0) // Remove empty strings
        .map((str) => Number(str)) // Convert to numbers
        .filter((num) => !isNaN(num)); // Filter out invalid numbers

      if (numbers.length > 0) {
        setData(numbers);
      }
    }
  };

  // Function to adjust ADSR values while maintaining sum of 1
  const adjustADSR = (newValue, parameter) => {
    const remaining = 1 - newValue;
    const others = ["attack", "decay", "sustain", "release"].filter(
      (p) => p !== parameter,
    );
    const currentSum = others.reduce((sum, p) => {
      return (
        sum +
        (p === "attack"
          ? attack
          : p === "decay"
            ? decay
            : p === "sustain"
              ? sustain
              : release)
      );
    }, 0);

    const ratio = currentSum > 0 ? remaining / currentSum : 1 / 3;

    switch (parameter) {
      case "attack":
        setAttack(newValue);
        setDecay(decay * ratio);
        setSustain(sustain * ratio);
        setRelease(release * ratio);
        break;
      case "decay":
        setDecay(newValue);
        setAttack(attack * ratio);
        setSustain(sustain * ratio);
        setRelease(release * ratio);
        break;
      case "sustain":
        setSustain(newValue);
        setAttack(attack * ratio);
        setDecay(decay * ratio);
        setRelease(release * ratio);
        break;
      case "release":
        setRelease(newValue);
        setAttack(attack * ratio);
        setDecay(decay * ratio);
        setSustain(sustain * ratio);
        break;
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-8">Data Sonification</h2>

      <div className="w-full max-w-md space-y-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <label className="w-full block text-sm font-medium mb-1">
            Preset Data
          </label>
          {Object.entries(presetData).map(([key, value]) => (
            <button
              key={key}
              onClick={() => loadPresetData(key)}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
            >
              {value.name}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Data Array (JSON format)
          </label>
          <textarea
            value={dataInput}
            onChange={handleDataChange}
            className="w-full p-2 border rounded"
            placeholder="Enter array of numbers, e.g. [1,2,3,4,5]"
            rows={3}
          />
          <button
            onClick={handleSaveData}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Save Data
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Note Duration (ms)
          </label>
          <input
            type="number"
            value={noteDelayInput}
            onChange={(e) => {
              setNoteDelayInput(e.target.value);
              if (e.target.value !== "") {
                setNoteDelay(Number(e.target.value));
              }
            }}
            className="w-full p-2 border rounded"
            min="50"
            max="1000"
            step="50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">ADSR Envelope</label>

          <div className="space-y-4">
            <div>
              <label className="block text-xs">
                Attack ({(attack * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={attack}
                onChange={(e) =>
                  adjustADSR(parseFloat(e.target.value), "attack")
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs">
                Decay ({(decay * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={decay}
                onChange={(e) =>
                  adjustADSR(parseFloat(e.target.value), "decay")
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs">
                Sustain ({(sustain * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sustain}
                onChange={(e) =>
                  adjustADSR(parseFloat(e.target.value), "sustain")
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs">
                Release ({(release * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={release}
                onChange={(e) =>
                  adjustADSR(parseFloat(e.target.value), "release")
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs">
                Sustain Level ({(sustainLevel * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sustainLevel}
                onChange={(e) => setSustainLevel(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Time Between Notes (ms)
          </label>
          <input
            type="number"
            value={timeBetweenNotesInput}
            onChange={(e) => {
              setTimeBetweenNotesInput(e.target.value);
              if (e.target.value !== "") {
                setTimeBetweenNotes(Number(e.target.value));
              }
            }}
            className="w-full p-2 border rounded"
            min="50"
            max="2000"
            step="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Base Frequency (Hz)
          </label>
          <input
            type="number"
            value={baseFreqInput}
            onChange={(e) => {
              setBaseFreqInput(e.target.value);
              if (e.target.value !== "") {
                setBaseFreq(Number(e.target.value));
              }
            }}
            className="w-full p-2 border rounded"
            min="20"
            max="20000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Multiplier</label>
          <input
            type="number"
            value={multiplierInput}
            onChange={(e) => {
              setMultiplierInput(e.target.value);
              if (e.target.value !== "") {
                setMultiplier(Number(e.target.value));
              }
            }}
            className="w-full p-2 border rounded"
            step="0.1"
          />
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={toggleAnimation}
          disabled={data.length === 0}
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>

      {(currentFrequency || currentValue || nearestNote) && (
        <div className="bg-blue-100 p-4 rounded mt-8 text-center w-full max-w-md">
          <p>Current Value: {currentValue}</p>
          <p>Output Frequency: {currentFrequency?.toFixed(2)} Hz</p>
          <p>Nearest Note: {nearestNote}</p>
        </div>
      )}
    </div>
  );
};

export default DataSonification;
