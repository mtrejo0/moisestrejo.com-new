"use client";

import React, { useState } from "react";

const popularTickers = [
  "AAPL",
  "MSFT",
  "AMZN",
  "GOOGL",
  "FB",
  "TSLA",
  "BRK.B",
  "JPM",
  "JNJ",
  "V",
  "PG",
  "UNH",
  "HD",
  "BAC",
  "DIS",
  "ADBE",
  "CMCSA",
  "XOM",
  "NFLX",
  "NVDA",
  "CRM",
  "VZ",
  "INTC",
  "PFE",
  "CSCO",
  "ABT",
  "KO",
  "PEP",
  "WMT",
  "MRK",
  "T",
  "CVX",
  "MA",
  "MCD",
  "NKE",
  "WFC",
  "PYPL",
  "TMO",
  "ABBV",
  "ACN",
  "COST",
  "MDT",
  "LLY",
  "NEE",
  "ORCL",
  "PM",
  "UNP",
  "BMY",
  "HON",
  "AMGN",
];

const PortfolioOptimizer = () => {
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lookbackDays, setLookbackDays] = useState(30);
  const [riskLevel, setRiskLevel] = useState(0.1);

  const handleTickerChange = (ticker) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker],
    );
    setMenuOpen(false);
  };

  const handleDeleteTicker = (tickerToDelete) => {
    setSelectedTickers((tickers) =>
      tickers.filter((ticker) => ticker !== tickerToDelete),
    );
  };

  const optimizePortfolio = async () => {
    if (selectedTickers.length < 2) {
      setError("Please select at least 2 tickers");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-tickers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tickers: selectedTickers,
          lookbackDays,
          riskLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticker data");
      }

      const data = await response.json();

      setOptimizedPortfolio({
        weights: data.weights,
        stats: [data.expectedReturn, data.volatility, data.sharpeRatio],
      });
    } catch (error) {
      console.error("Error optimizing portfolio:", error);
      setError("Failed to optimize portfolio. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portfolio Optimizer</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Tickers
        </label>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {selectedTickers.length > 0
              ? selectedTickers.join(", ")
              : "Select tickers"}
          </button>
          {menuOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {popularTickers.map((ticker) => (
                <div
                  key={ticker}
                  className={`${
                    selectedTickers.includes(ticker) ? "bg-indigo-100" : ""
                  } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50`}
                  onClick={() => handleTickerChange(ticker)}
                >
                  {ticker}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTickers.map((ticker) => (
          <span
            key={ticker}
            className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {ticker}
            <button
              onClick={() => handleDeleteTicker(ticker)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lookback Period (Days)
        </label>
        <input
          type="number"
          value={lookbackDays}
          onChange={(e) =>
            setLookbackDays(Math.max(1, parseInt(e.target.value)))
          }
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Risk Level: {riskLevel.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={riskLevel}
          onChange={(e) => setRiskLevel(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={optimizePortfolio}
        disabled={selectedTickers.length < 2 || isLoading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? "Optimizing..." : "Optimize Portfolio"}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {optimizedPortfolio && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Optimized Portfolio</h2>
          <p className="mb-1">
            <strong>Weights:</strong>{" "}
            {optimizedPortfolio.weights
              .map((w, i) => `${selectedTickers[i]}: ${(w * 100).toFixed(2)}%`)
              .join(", ")}
          </p>
          <p className="mb-1">
            <strong>Expected Annual Return:</strong>{" "}
            {(optimizedPortfolio.stats[0] * 100).toFixed(2)}%
          </p>
          <p className="mb-1">
            <strong>Annual Volatility:</strong>{" "}
            {(optimizedPortfolio.stats[1] * 100).toFixed(2)}%
          </p>
          <p className="mb-1">
            <strong>Sharpe Ratio:</strong>{" "}
            {optimizedPortfolio.stats[2].toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioOptimizer;
