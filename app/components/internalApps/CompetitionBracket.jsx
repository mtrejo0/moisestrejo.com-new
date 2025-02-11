"use client";

import { useState, Fragment} from "react";

const CompetitionBracket = () => {
  const [teams, setTeams] = useState([
    'Team 1', 'Team 2', 'Team 3', 'Team 4',
    'Team 5', 'Team 6', 'Team 7', 'Team 8'
  ]);
  const [newTeamName, setNewTeamName] = useState("");
  const [rounds, setRounds] = useState({});
  const [matchResults, setMatchResults] = useState({});

  const updateTeamName = (index, newName) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = newName;
    setTeams(updatedTeams);
  };

  const addTeam = () => {
    if (newTeamName.trim()) {
      setTeams([...teams, newTeamName.trim()]);
      setNewTeamName("");
    }
  };

  const handleTeamWin = (winningTeam, losingTeam, roundIndex, matchIndex) => {
    // Check if match has already been decided
    const matchKey = `${roundIndex}-${matchIndex}`;
    if (matchResults[matchKey]) return;

    // Update match results
    setMatchResults(prev => ({
      ...prev,
      [matchKey]: winningTeam
    }));

    // Update rounds
    setRounds(prev => {
      const nextRound = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      
      return {
        ...prev,
        [nextRound]: {
          ...prev[nextRound],
          [nextMatchIndex]: [
            ...(prev[nextRound]?.[nextMatchIndex] || []),
            winningTeam
          ]
        }
      };
    });
  };

  const renderMatch = (teams, roundIndex, matchIndex) => {
    if (!teams || teams.length === 0) return null;
    
    const matchKey = `${roundIndex}-${matchIndex}`;
    const isMatchDecided = matchResults[matchKey];
    const [team1, team2] = teams;

    if (team1 && !team2) {
      return (
        <div className="p-2 border border-gray-300 rounded">
          <button
            className={`px-4 py-2 text-left rounded ${
              isMatchDecided ? "bg-green-200" : "bg-gray-100 hover:bg-blue-100"
            }`}
            onClick={() => handleTeamWin(team1, null, roundIndex, matchIndex)}
            disabled={isMatchDecided}
          >
            {team1} (Bye)
          </button>
        </div>
      );
    }

    return (
      <div className="p-2 border border-gray-300 rounded">
        <div className="flex gap-4">
          {[team1, team2].map((team, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <span className="self-center">vs</span>}
              <button
                className={`px-4 py-2 text-left rounded ${
                  isMatchDecided
                    ? isMatchDecided === team
                      ? "bg-green-200"
                      : "bg-red-200"
                    : "bg-white hover:bg-blue-100"
                }`}
                onClick={() => handleTeamWin(team, idx === 0 ? team2 : team1, roundIndex, matchIndex)}
                disabled={isMatchDecided}
              >
                {team}
              </button>
            </Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderRound = (roundIndex) => {
    const totalTeams = teams.length;
    if (roundIndex === 0) {
      // Initial round - show all teams, even if odd number
      return Array.from({ length: Math.ceil(totalTeams / 2) }, (_, i) => (
        <div key={i} className="flex-shrink-0">
          {renderMatch([teams[i * 2], teams[i * 2 + 1] || null], roundIndex, i)}
        </div>
      ));
    }

    // Calculate remaining matches for subsequent rounds
    const matchCount = Math.pow(2, Math.max(0, Math.ceil(Math.log2(totalTeams)) - roundIndex - 1));
    const matches = rounds[roundIndex] || {};

    // Subsequent rounds
    return Array.from({ length: matchCount }, (_, i) => (
      <div key={i} className="flex-shrink-0">
        {renderMatch(matches[i], roundIndex, i)}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-white">
      <div className="mb-6">
        {/* Team Name Editor */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {teams.map((team, index) => (
            <input
              key={index}
              type="text"
              value={team}
              onChange={(e) => updateTeamName(index, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            />
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter team name"
          />
          <button
            onClick={addTeam}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Team
          </button>
        </div>
        
        <div className="flex flex-col gap-8">
          {Array.from(
            { length: Math.ceil(Math.log2(teams.length)) },
            (_, i) => (
              <div key={i}>
                <h2 className="font-bold mb-4 text-center">
                  {i === 0 ? "Initial Round" : `Round ${i + 1}`}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
                  {renderRound(i)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionBracket;