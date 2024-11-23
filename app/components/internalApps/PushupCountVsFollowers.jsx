"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PushupCount = () => {
  const [todayCount, setTodayCount] = useState(0);
  const [todayFollowers, setTodayFollowers] = useState(0);
  const [history, setHistory] = useState([]);
  const [inputCount, setInputCount] = useState("");
  const [inputFollowers, setInputFollowers] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedHistory = localStorage.getItem("pushupFollowersHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      
      // Check if there's an entry for today
      const today = new Date().toLocaleDateString();
      const todayEntry = parsedHistory.find(entry => entry.date === today);
      if (todayEntry) {
        setTodayCount(todayEntry.pushups);
        setTodayFollowers(todayEntry.followers);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputCount || !inputFollowers) return;

    const today = new Date().toLocaleDateString();
    const newCount = parseInt(inputCount);
    const newFollowers = parseInt(inputFollowers);
    
    let newHistory = [...history];
    const todayIndex = history.findIndex(entry => entry.date === today);

    if (todayIndex >= 0) {
      // Update today's counts
      newHistory[todayIndex] = { date: today, pushups: newCount, followers: newFollowers };
    } else {
      // Add new entry for today
      newHistory.push({ date: today, pushups: newCount, followers: newFollowers });
    }

    // Sort history by date (most recent first)
    newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistory(newHistory);
    setTodayCount(newCount);
    setTodayFollowers(newFollowers);
    setInputCount("");
    setInputFollowers("");
    
    // Save to localStorage
    localStorage.setItem("pushupFollowersHistory", JSON.stringify(newHistory));
  };

  const handleJsonEdit = (e) => {
    e.preventDefault();
    try {
      const newHistory = JSON.parse(jsonInput);
      setHistory(newHistory);
      localStorage.setItem("pushupFollowersHistory", jsonInput);
      setIsEditing(false);

      // Update today's counts if present
      const today = new Date().toLocaleDateString();
      const todayEntry = newHistory.find(entry => entry.date === today);
      if (todayEntry) {
        setTodayCount(todayEntry.pushups);
        setTodayFollowers(todayEntry.followers);
      }
    } catch (error) {
      alert("Invalid JSON format");
    }
  };

  const chartData = {
    // Sort dates chronologically and store sorted history once
    labels: [...history].sort((a,b) => new Date(a.date) - new Date(b.date)).map(entry => entry.date),
    datasets: [
      {
        label: 'Pushups',
        data: [...history].sort((a,b) => new Date(a.date) - new Date(b.date)).map(entry => entry.pushups),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      },
      {
        label: 'Followers',
        data: [...history].sort((a,b) => new Date(a.date) - new Date(b.date)).map(entry => entry.followers),
        fill: false,
        borderColor: 'rgb(234, 88, 12)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Pushups vs Followers Over Time',
        font: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 12
          }
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12
          }
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Daily Pushup vs Followers Counter</h1>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            placeholder="Enter pushup count"
            className="w-full sm:w-1/3 p-2 border rounded text-sm"
            min="0"
          />
          <input
            type="number"
            value={inputFollowers}
            onChange={(e) => setInputFollowers(e.target.value)}
            placeholder="Enter followers count"
            className="w-full sm:w-1/3 p-2 border rounded text-sm"
            min="0"
          />
          <button 
            type="submit"
            className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Save
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="p-3 bg-gray-100 rounded">
          <h2 className="text-sm font-semibold">Today&apos;s Counts</h2>
          <p className="text-lg sm:text-xl">{todayCount} pushups</p>
          <p className="text-lg sm:text-xl">{todayFollowers} followers</p>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-2">Progress Chart</h2>
          <div className="p-2 bg-white rounded-lg shadow h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">History</h2>
          <div className="space-y-1">
            {history.map((entry, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">{entry.date}</span>
                <span className="text-gray-600">{entry.pushups} pushups | {entry.followers} followers</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setJsonInput(JSON.stringify(history, null, 2));
            }}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {isEditing ? "Cancel Edit" : "Edit History JSON"}
          </button>

          {isEditing && (
            <form onSubmit={handleJsonEdit} className="mt-2 space-y-2">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-48 p-2 border rounded text-sm font-mono"
                placeholder="Enter JSON history data"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Save JSON
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PushupCount;

