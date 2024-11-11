import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { mean, dot, multiply, inv, sqrt, transpose } from "mathjs";

// Helper functions

// Fetch historical price data for the tickers
async function getData(tickers, lookbackDays = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - lookbackDays);

  // Fetch historical data for each ticker
  const data = await Promise.all(
    tickers.map((ticker) =>
      yahooFinance.historical(ticker, {
        period1: startDate.toISOString().split("T")[0],
        period2: endDate.toISOString().split("T")[0],
      }),
    ),
  );

  // Extract adjusted close prices
  return data.map(
    (tickerData) => tickerData.map((day) => day.adjClose).reverse(), // Reverse to maintain chronological order
  );
}

// Calculate daily returns
function calculateReturns(prices) {
  return prices.map((ticker) =>
    ticker.slice(1).map((price, i) => (price - ticker[i]) / ticker[i]),
  );
}

// Calculate the covariance matrix of returns
function calculateCovMatrix(returns) {
  const numAssets = returns.length;
  const meanReturns = returns.map((ticker) => mean(ticker));

  const covMatrix = Array(numAssets)
    .fill()
    .map(() => Array(numAssets).fill(0));

  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      const covariance = mean(
        returns[i].map(
          (ri, t) => (ri - meanReturns[i]) * (returns[j][t] - meanReturns[j]),
        ),
      );
      covMatrix[i][j] = covariance;
    }
  }

  return covMatrix;
}

function portfolioStats(weights, meanReturns, covMatrix, riskFreeRate = 0.01) {
  // Ensure weights are a column vector
  const weightsColumn = transpose([weights]); // Convert row vector to column vector

  // Calculate portfolio return (annualized)
  const portfolioReturn = dot(meanReturns, weights) * 252;

  // Calculate portfolio variance and standard deviation (volatility)
  const covWeighted = multiply(covMatrix, weightsColumn); // CovMatrix * weightsColumn
  const portfolioVariance = dot(weights, covWeighted.flat()); // Dot product with flattened result
  const portfolioStdDev = sqrt(portfolioVariance) * sqrt(252); // Annualized risk (volatility)

  // Calculate Sharpe ratio
  const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioStdDev;

  return { portfolioReturn, portfolioStdDev, sharpeRatio };
}

// Optimize portfolio weights for maximum Sharpe ratio
function optimizePortfolio(meanReturns, covMatrix) {
  const numAssets = meanReturns.length;
  const ones = Array(numAssets).fill(1);

  // Inverse covariance matrix
  const invCovMatrix = inv(covMatrix);

  // Calculate optimal weights: W = (inv(Cov) * 1) / (1' * inv(Cov) * 1)
  const weights = multiply(invCovMatrix, ones);
  const normFactor = dot(ones, weights); // Normalize weights so they sum to 1

  return weights.map((w) => w / normFactor); // Return normalized weights
}

// POST endpoint for portfolio optimization
export async function POST(request) {
  const { tickers, lookbackDays, riskLevel } = await request.json();

  try {
    const prices = await getData(tickers, lookbackDays);
    const returns = calculateReturns(prices);

    const meanReturns = returns.map((ticker) => mean(ticker));
    const covMatrix = calculateCovMatrix(returns);

    const optimizedWeights = optimizePortfolio(meanReturns, covMatrix);

    const { portfolioReturn, portfolioStdDev, sharpeRatio } = portfolioStats(
      optimizedWeights,
      meanReturns,
      covMatrix,
    );

    return NextResponse.json({
      weights: optimizedWeights,
      expectedReturn: portfolioReturn,
      volatility: portfolioStdDev,
      sharpeRatio,
    });
  } catch (error) {
    console.error("Error in portfolio optimization:", error);
    return NextResponse.json(
      { error: "Failed to optimize portfolio", details: error.message },
      { status: 500 },
    );
  }
}
