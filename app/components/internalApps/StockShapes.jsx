"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const WhatIfIInvested = () => {
  const [date, setDate] = useState(new Date(Date.now() - 86400000).toISOString().split('T')[0]); // Changed to 30 days
  const [ticker, setTicker] = useState("NVDA");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/ticker?symbol=${ticker}&interval=1h`,
      );
      const historicalData = response.data;

      if (historicalData.length === 0) {
        setError("No data available for the selected date and ticker.");
        return;
      }

      const chartData = {
        labels: historicalData.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          }),
        ),
        datasets: [
          {
            label: "Stock Price ($)",
            data: historicalData.map((item) => item.close.toFixed(2)),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };

      setData(chartData);
      setError("");
    } catch (err) {
      setError("Error fetching data. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Historical Stock Performance</h2>
      <div className="w-full max-w-md">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            // Ensure date is not more than 30 days ago
            const selectedDate = new Date(e.target.value);
            const oneMonthAgo = new Date(Date.now() - 86400000*30);
            if (selectedDate < oneMonthAgo) {
              setDate(oneMonthAgo.toISOString().split('T')[0]);
            } else {
              setDate(e.target.value);
            }
          }}
          min={new Date(Date.now() - 86400000*30).toISOString().split('T')[0]}
          max={new Date().toISOString().split('T')[0]}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter date"
        />
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select a ticker symbol</option>
          {[
            { value: "BTC-USD", name: "BTC-USD - Bitcoin USD" },
            { value: "ETH-USD", name: "ETH-USD - Ethereum USD" },
            { value: "AAPL", name: "AAPL - Apple Inc." },
            { value: "GOOGL", name: "GOOGL - Alphabet Inc." },
            { value: "MSFT", name: "MSFT - Microsoft Corporation" },
            { value: "AMZN", name: "AMZN - Amazon.com, Inc." },
            { value: "FB", name: "FB - Meta Platforms, Inc." },
            { value: "TSLA", name: "TSLA - Tesla, Inc." },
            { value: "NVDA", name: "NVDA - NVIDIA Corporation" },
            { value: "JPM", name: "JPM - JPMorgan Chase & Co." },
            { value: "V", name: "V - Visa Inc." },
            { value: "JNJ", name: "JNJ - Johnson & Johnson" },
            { value: "BRK-A", name: "BRK-A - Berkshire Hathaway Inc." },
            { value: "XOM", name: "XOM - Exxon Mobil Corporation" },
            { value: "JNJ", name: "JNJ - Johnson & Johnson" },
            { value: "PG", name: "PG - Procter & Gamble Company" },
            { value: "CSCO", name: "CSCO - Cisco Systems, Inc." },
            { value: "VZ", name: "VZ - Verizon Communications Inc." },
            { value: "UNH", name: "UNH - UnitedHealth Group Incorporated" },
            { value: "HD", name: "HD - The Home Depot, Inc." },
            { value: "INTC", name: "INTC - Intel Corporation" },
            { value: "T", name: "T - AT&T Inc." },
            { value: "CVX", name: "CVX - Chevron Corporation" },
            { value: "MRK", name: "MRK - Merck & Co., Inc." },
            { value: "PFE", name: "PFE - Pfizer Inc." },
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <button
          onClick={fetchData}
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Show Performance
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && (
        <div className="w-full mt-8" style={{ height: "600px" }}>
          <Line
            data={data}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      )}
    </div>
  );
};

export default WhatIfIInvested;
