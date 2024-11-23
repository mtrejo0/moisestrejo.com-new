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
  const [history, setHistory] = useState([]);
  const [inputCount, setInputCount] = useState("");

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedHistory = localStorage.getItem("pushupHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      
      // Check if there's an entry for today
      const today = new Date().toLocaleDateString();
      const todayEntry = parsedHistory.find(entry => entry.date === today);
      if (todayEntry) {
        setTodayCount(todayEntry.count);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputCount) return;

    const today = new Date().toLocaleDateString();
    const newCount = parseInt(inputCount);
    
    let newHistory = [...history];
    const todayIndex = history.findIndex(entry => entry.date === today);

    if (todayIndex >= 0) {
      // Update today's count
      newHistory[todayIndex] = { date: today, count: newCount };
    } else {
      // Add new entry for today
      newHistory.push({ date: today, count: newCount });
    }

    // Sort history by date (most recent first)
    newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistory(newHistory);
    setTodayCount(newCount);
    setInputCount("");
    
    // Save to localStorage
    localStorage.setItem("pushupHistory", JSON.stringify(newHistory));
  };

  const chartData = {
    labels: [...history].reverse().map(entry => entry.date),
    datasets: [
      {
        label: 'Pushups',
        data: [...history].reverse().map(entry => entry.count),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pushup Progress Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Pushups'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Daily Pushup Counter</h1>
      

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="number"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            placeholder="Enter pushup count"
            className="flex-1 p-2 border rounded"
            min="0"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Today's Count</h2>
          <p className="text-2xl">{todayCount} pushups</p>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold mb-4">Progress Chart</h2>
          <div className="p-4 bg-white rounded-lg shadow">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">History</h2>
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{entry.date}</span>
                <span>{entry.count} pushups</span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default PushupCount;
