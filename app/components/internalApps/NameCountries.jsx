import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Play, Pause } from "lucide-react";
import countries from './countries.json';

const NameCountries = () => {
  const [input, setInput] = useState("");
  const [enteredCountries, setEnteredCountries] = useState([]);
  const [remainingCountries, setRemainingCountries] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchCountries = () => {
      try {
        const countryNames = countries.objects.world.geometries.map(geo => geo.properties.name);
        setRemainingCountries(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
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
    const countryName = input.trim().toLowerCase();
    if (remainingCountries.some(country => country.toLowerCase() === countryName)) {
      setEnteredCountries([...enteredCountries, countryName]);
      setRemainingCountries(remainingCountries.filter(country => country.toLowerCase() !== countryName));
      setInput("");

      if (remainingCountries.length === 1) {
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
      const randomCountry = remainingCountries[Math.floor(Math.random() * remainingCountries.length)];
      const blurredHint = randomCountry.split('').map((char, index) => index % 2 === 0 ? char : '*').join('');
      alert(`Hint: ${blurredHint}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Name the Countries</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a country name"
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
        <p>Countries found: {enteredCountries.length}</p>
        <p>Countries remaining: {remainingCountries.length}</p>
      </div>
      {gameWon && (
        <div className="text-green-500 font-bold mb-4">
          Congratulations! You&apos;sve named all the countries!
        </div>
      )}
      <div className="w-full max-w-3xl">
        <ComposableMap>
          <Geographies geography={countries}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={enteredCountries.includes(geo.properties.name.toLowerCase()) ? "#34D399" : "#D1D5DB"}
                  stroke="#FFFFFF"
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default NameCountries;
