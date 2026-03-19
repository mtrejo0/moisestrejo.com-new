"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

/** Raw TSV titles sometimes include wrapping straight/curly quotes — users should not have to type those. */
function cleanSongTitle(raw) {
  if (raw == null || raw === "") return "";
  let t = String(raw).trim();
  let prev;
  do {
    prev = t;
    t = t
      .replace(
        /^["'\u201C\u201D\u2018\u2019\s]+|["'\u201C\u201D\u2018\u2019\s]+$/g,
        "",
      )
      .trim();
  } while (t !== prev);
  return t;
}

const TaylorSwiftGuess = () => {
  const [input, setInput] = useState("");
  const [enteredSongs, setEnteredSongs] = useState([]);
  const [remainingSongs, setRemainingSongs] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [albums, setAlbums] = useState({});
  const [songsReady, setSongsReady] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songResponse = await fetch(
          "https://raw.githubusercontent.com/sagesolar/Corpus-of-Taylor-Swift/refs/heads/main/tsv/cots-song-details.tsv",
        );
        const songData = await songResponse.text();
        const albumResponse = await fetch(
          "https://raw.githubusercontent.com/sagesolar/Corpus-of-Taylor-Swift/refs/heads/main/tsv/cots-album-details.tsv",
        );
        const albumData = await albumResponse.text();

        const albumLines = albumData.split("\n").slice(1); // Skip header
        const albumMap = {};
        albumLines.forEach((line) => {
          const [code, title, subtitle, year] = line.split("\t");
          if (code && title) {
            albumMap[code.trim()] = { title: title.trim(), year: year.trim() };
          }
        });

        const songLines = songData.split("\n").slice(1); // Skip header
        const songList = songLines
          .map((line) => {
            const values = line.split("\t");
            const albumCode = values[0]?.trim();
            const albumInfo = albumMap[albumCode] || {
              title: albumCode,
              year: "Unknown",
            };
            return {
              title: cleanSongTitle(values[2]),
              album: albumInfo.title,
              year: albumInfo.year,
            };
          })
          .filter((song) => song.title && song.album);

        setRemainingSongs(songList);

        // Group songs by album
        const albumGroups = {};
        songList.forEach((song) => {
          if (!albumGroups[song.album]) {
            albumGroups[song.album] = { songs: [], year: song.year };
          }
          albumGroups[song.album].songs.push(song.title);
        });
        setAlbums(albumGroups);
        setSongsReady(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSongsReady(false);
      }
    };

    fetchSongs();
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
    if (!songsReady || remainingSongs.length === 0) return;

    const normalizeStrong = (value) =>
      cleanSongTitle(value)
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ");

    // Less strict: remove punctuation so curly quotes/commas/feat markers
    // don't prevent a "correct" answer from matching.
    const normalizeLoose = (value) =>
      normalizeStrong(value).replace(/[^a-z0-9 ]/g, "");

    const inputStrong = normalizeStrong(input);
    const inputLoose = normalizeLoose(input);

    // Prefer exact (normalized) match first.
    let foundSong = remainingSongs.find(
      (song) => normalizeStrong(song.title) === inputStrong,
    );

    // Fall back to looser punctuation-insensitive match.
    let usedLooseMatch = false;
    if (!foundSong) {
      foundSong = remainingSongs.find(
        (song) => normalizeLoose(song.title) === inputLoose,
      );
      usedLooseMatch = true;
    }

    if (foundSong) {
      const nextRemainingSongs = remainingSongs.filter((song) => {
        const songKey = usedLooseMatch
          ? normalizeLoose(song.title)
          : normalizeStrong(song.title);
        const inputKey = usedLooseMatch ? inputLoose : inputStrong;
        return songKey !== inputKey;
      });

      setEnteredSongs((prev) => [...prev, foundSong]);
      setRemainingSongs(nextRemainingSongs);
      setInput("");

      if (nextRemainingSongs.length === 0) {
        setGameWon(true);
        setIsRunning(false);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const getHint = () => {
    if (remainingSongs.length === 0) return;
    if (window.confirm("Are you sure you want a hint?")) {
      const randomSong =
        remainingSongs[Math.floor(Math.random() * remainingSongs.length)];
      const blurredHint = randomSong.title
        .split("")
        .map((char, index) => (index % 2 === 0 ? char : "*"))
        .join("");
      alert(
        `Hint: ${blurredHint} (Album: ${randomSong.album}, Year: ${randomSong.year})`,
      );
    }
  };

  const revealSongAnswer = (songTitle) => {
    if (!songTitle) return;
    const songToReveal = remainingSongs.find((s) => s.title === songTitle);
    if (!songToReveal) return;
    if (window.confirm("Are you sure you want to answer?")) {
      // Mark it as found and show the actual answer.
      setEnteredSongs((prev) => [...prev, songToReveal]);
      setRemainingSongs((prev) => {
        const next = prev.filter((s) => s.title !== songTitle);
        if (next.length === 0) {
          setGameWon(true);
          setIsRunning(false);
        }
        return next;
      });

      alert(
        `Answer: ${songToReveal.title} (Album: ${songToReveal.album}, Year: ${songToReveal.year})`,
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Name Taylor Swift&apos;s Songs
      </h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Song title (no quotes needed)"
          disabled={!songsReady}
          className="p-2 border border-gray-300 rounded mr-2 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!songsReady}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 disabled:opacity-50 disabled:pointer-events-none"
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
      {!songsReady && (
        <p className="text-sm text-gray-600 mb-4">Loading song list…</p>
      )}
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
                <h3 className="text-xl font-bold">
                  {album} ({year})
                </h3>
                <ul>
                  {songs.map((song) => (
                    <li
                      key={song}
                      className={
                        enteredSongs.some((s) => s.title === song)
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    >
                      {enteredSongs.some((s) => s.title === song) ? (
                        song
                      ) : (
                        <button
                          type="button"
                          onClick={() => revealSongAnswer(song)}
                          className="text-gray-500 hover:underline bg-transparent"
                        >
                          ...
                        </button>
                      )}
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

export default TaylorSwiftGuess;
