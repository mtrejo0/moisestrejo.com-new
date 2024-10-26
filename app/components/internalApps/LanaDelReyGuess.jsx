'use client'

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import lanaSongs from "./lana_songs.json";

const LanaDelReyGuess = () => {
  const [input, setInput] = useState("");
  const [enteredSongs, setEnteredSongs] = useState([]);
  const [remainingSongs, setRemainingSongs] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [albums, setAlbums] = useState({});

  useEffect(() => {
    const processSongs = () => {
      const songList = lanaSongs.map(song => ({
        title: song.song_title?.trim(),
        album: song.album_title?.trim(),
        year: new Date(song.song_release_date).getFullYear().toString()
      })).filter(song => song.title && song.album);

      console.log(songList)

      setRemainingSongs(songList);
      
      // Group songs by album
      const albumGroups = {};
      songList.forEach(song => {
        if (!albumGroups[song.album]) {
          albumGroups[song.album] = { songs: [], year: song.year };
        }
        albumGroups[song.album].songs.push(song.title);
      });

      // Move singles to a "Singles" album
      const singles = {};
      Object.entries(albumGroups).forEach(([album, data]) => {
        if (data.songs.length === 1) {
          if (!singles["Singles"]) {
            singles["Singles"] = { songs: [], year: "Many" };
          }
          singles["Singles"].songs.push(...data.songs);
          delete albumGroups[album];
        }
      });

      setAlbums({ ...albumGroups, ...singles });
    };

    processSongs();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const songTitle = input?.trim()?.toLowerCase();
    const foundSong = remainingSongs.find(song => song.title?.toLowerCase() === songTitle);
    if (foundSong) {
      setEnteredSongs([...enteredSongs, foundSong]);
      setRemainingSongs(remainingSongs.filter(song => song.title?.toLowerCase() !== songTitle));
      setInput("");

      if (remainingSongs.length === 1) {
        setGameWon(true);
        setIsRunning(false);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const getHint = () => {
    if (window.confirm("Are you sure you want a hint?")) {
      const randomSong = remainingSongs[Math.floor(Math.random() * remainingSongs.length)];
      const blurredHint = randomSong.title.split('').map((char, index) => index % 2 === 0 ? char : '*').join('');
      alert(`Hint: ${blurredHint} (Album: ${randomSong.album}, Year: ${randomSong.year})`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Name Lana Del Rey&apos;s Songs</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a song title"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={getHint}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Hint
        </button>
      </form>
      <div className="mb-4 flex items-center">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2 flex items-center"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <span className="text-xl font-bold">{timer} s</span>
      </div>
      <div className="mb-4">
        <p>Songs found: {enteredSongs.length}</p>
        <p>Songs remaining: {remainingSongs.length}</p>
      </div>
      {gameWon && (
        <div className="text-green-500 font-bold mb-4">
          Congratulations! You&apos;ve named all the songs!
        </div>
      )}
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(albums)
            .sort(([, a], [, b]) => -a.year.localeCompare(b.year))
            .map(([album, { songs, year }]) => (
            <div key={album} className="mb-4">
              <h3 className="text-xl font-bold">{album} ({year})</h3>
              <ul>
                {songs.map(song => (
                  <li key={song} className={enteredSongs.some(s => s.title === song) ? "text-green-500" : "text-gray-500"}>
                    {enteredSongs.some(s => s.title === song) ? song : '• • •'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanaDelReyGuess;
