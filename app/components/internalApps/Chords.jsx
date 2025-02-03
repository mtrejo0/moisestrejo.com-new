"use client";

import { useState } from "react";
import { saveAs } from 'file-saver';
import { Midi } from '@tonejs/midi';

const Chords = () => {
  const [progression, setProgression] = useState("");
  const [key, setKey] = useState("C");
  const [octave, setOctave] = useState(4);
  const [duration, setDuration] = useState(1); // Duration in seconds
  const [selectedProgression, setSelectedProgression] = useState("");
  const [useCustomProgression, setUseCustomProgression] = useState(false);

  const chordMap = {
    'I': [0, 4, 7],
    'II': [2, 6, 9],
    'III': [4, 8, 11],
    'IV': [5, 9, 12],
    'V': [7, 11, 14],
    'VI': [9, 13, 16],
    'VII': [11, 15, 18],
    // Add minor chords
    'i': [0, 3, 7],
    'ii': [2, 5, 9],
    'iii': [4, 7, 11],
    'iv': [5, 8, 12],
    'v': [7, 10, 14],
    'vi': [9, 12, 16],
    'vii': [11, 14, 18],
  };

  const keyOffsets = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };

  const classicProgressions = {
    "": "Choose a progression...",
    "I,IV,V,I": "I, IV, V, I (Classic)",
    "I,vi,IV,V": "I, vi, IV, V (50s Progression)",
    "i,iv,v,i": "i, iv, v, i (Minor Version)",
    "ii,V,I": "ii, V, I (Jazz Turnaround)",
    "I,V,vi,IV": "I, V, vi, IV (Pop Progression)",
    "vi,IV,I,V": "vi, IV, I, V (Andalusian Cadence)",
    "I,vi,ii,V": "I, vi, ii, V (Circle Progression)",
    "i,VI,III,VII": "i, VI, III, VII (Minor Pop)",
    "I,IV,vi,V": "I, IV, vi, V (Modern Pop)",
    "ii,V,I,vi": "ii, V, I, vi (Jazz Standard)"
  };

  const createMidi = () => {
    const midi = new Midi();
    const track = midi.addTrack();
    
    const chords = progression.split(',').map(c => c.trim().toUpperCase());
    let currentTime = 0;

    chords.forEach(chord => {
      if (chordMap[chord]) {
        const baseNote = keyOffsets[key] + (octave * 12);
        const notes = chordMap[chord].map(interval => baseNote + interval);
        
        notes.forEach(note => {
          track.addNote({
            midi: note,
            time: currentTime,
            duration: duration
          });
        });
        
        currentTime += duration;
      }
    });

    const midiData = midi.toArray();
    const blob = new Blob([midiData], { type: 'audio/midi' });
    saveAs(blob, 'chord-progression.midi');
  };

  return (
    <div className="flex flex-col items-center p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Chord Progression to MIDI</h2>
      
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="progressionType"
              checked={!useCustomProgression}
              onChange={() => setUseCustomProgression(false)}
              className="mr-2"
            />
            Use Preset Progressions
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="progressionType"
              checked={useCustomProgression}
              onChange={() => setUseCustomProgression(true)}
              className="mr-2"
            />
            Enter Custom Progression
          </label>
        </div>

        {useCustomProgression ? (
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Custom Progression (e.g. I,IV,V,I)
            </label>
            <input
              type="text"
              value={progression}
              onChange={(e) => setProgression(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter chords separated by commas..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">
              Choose Chord Progression
            </label>
            <select
              value={selectedProgression}
              onChange={(e) => {
                setSelectedProgression(e.target.value);
                setProgression(e.target.value);
              }}
              className="w-full p-2 border rounded"
            >
              {Object.entries(classicProgressions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Key</label>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Object.keys(keyOffsets).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Octave</label>
            <select
              value={octave}
              onChange={(e) => setOctave(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {[2, 3, 4, 5, 6].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (s)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="0.1"
              max="4"
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={createMidi}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Download MIDI
        </button>

        {(
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Common Progressions:</h3>
            <ul className="space-y-1 text-sm">
              {Object.entries(classicProgressions)
                .filter(([value]) => value !== "") // Skip the empty default option
                .map(([value, label]) => (
                  <li key={value}>• {label}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chords;
