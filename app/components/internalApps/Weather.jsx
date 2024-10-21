import { useState } from "react";

const example = `Lover's Complaint by William Shakespeare
FROM off a hill whose concave womb reworded
A plaintful story from a sistering vale,
My spirits to attend this double voice accorded,
And down I laid to list the sad-tuned tale;
Ere long espied a fickle maid full pale,
Tearing of papers, breaking rings a-twain,
Storming her world with sorrow's wind and rain.

Upon her head a platted hive of straw,
Which fortified her visage from the sun,
Whereon the thought might think sometime it saw
The carcass of beauty spent and done:
Time had not scythed all that youth begun,
Nor youth all quit; but, spite of heaven's fell rage,
Some beauty peep'd through lattice of sear'd age.`;

const WordFrequency = () => {
  const [text, setText] = useState(example);
  const [data, setData] = useState(null);

  const generate = () => {
    var words = text.replace(/[.,///"?!()]/g, "").split(/\s/);
    var freqMap = {};
    words.forEach(function (w) {
      w = w.toLowerCase();
      if (!freqMap[w]) {
        freqMap[w] = 0;
      }
      freqMap[w] += 1;
    });

    let freqList = [];

    for (var key in freqMap) freqList.push([key, freqMap[key]]);

    freqList.sort((a, b) => (a[1] < b[1] ? 1 : -1));

    setData({
      word_count: words.length,
      frequencies: freqList,
    });
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
      <p className="mb-4 text-center">
        Add text and press submit to get a word count and frequency dictionary!
      </p>

      <textarea
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add text"
      />

      <button
        onClick={() => generate()}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>

      {data && (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-semibold mb-2">Results:</h3>
          <p className="mb-2">Total word count: {data.word_count}</p>
          <h4 className="text-md font-semibold mb-2">Word Frequencies:</h4>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">Word</th>
                  <th className="text-right px-2 py-1">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {data.frequencies.map(([word, frequency], index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="text-left px-2 py-1">{word}</td>
                    <td className="text-right px-2 py-1">{frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordFrequency;
