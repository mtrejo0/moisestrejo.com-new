import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { mean, sum, sqrt, dot, multiply, transpose, inv } from 'mathjs';

// Helper functions
async function getData(tickers) {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 1);

  const data = await Promise.all(tickers.map(ticker => 
    yahooFinance.historical(ticker, { period1: startDate, period2: endDate })
  ));

  return data.map(tickerData => 
    tickerData.map(day => day.adjClose)
  );
}

function calculateReturns(data) {
  return data.map(ticker => 
    ticker.slice(1).map((price, i) => (price - ticker[i]) / ticker[i])
  );
}

function calculateCovMatrix(returns) {
  const numAssets = returns.length;
  const meanReturns = returns.map(ticker => mean(ticker));
  
  const covMatrix = Array(numAssets).fill().map(() => Array(numAssets).fill(0));
  
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      const covariance = mean(returns[i].map((ri, t) => 
        (ri - meanReturns[i]) * (returns[j][t] - meanReturns[j])
      ));
      covMatrix[i][j] = covariance;
    }
  }
  
  return covMatrix;
}

function portfolioStats(weights, meanReturns, covMatrix, riskFreeRate = 0.01) {
  const portfolioReturn = dot(meanReturns, weights) * 252;
  const portfolioStdDev = sqrt(dot(dot(weights, covMatrix), weights)) * sqrt(252);
  const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioStdDev;
  return [portfolioReturn, portfolioStdDev, sharpeRatio];
}

function optimizePortfolio(meanReturns, covMatrix) {
  const numAssets = meanReturns.length;
  const ones = Array(numAssets).fill(1);

  // Calculate optimal weights using the analytical solution
  const invCov = inv(covMatrix);
  const B = dot(transpose([ones]), dot(invCov, ones));

  // Ensure meanReturns is a column vector
  const meanReturnsColumn = meanReturns.map(r => [r]);
  
  // Calculate weights
  const weights = multiply(1/B, dot(invCov, ones));
  
  return weights;
}

export async function POST(request) {
  const { tickers } = await request.json();

  try {
    const data = await getData(tickers);
    const returns = calculateReturns(data);

    const meanReturns = returns.map(ticker => mean(ticker));
    const covMatrix = calculateCovMatrix(returns);

    console.log(covMatrix)

    const optimizedWeights = optimizePortfolio(meanReturns, covMatrix);

    const [expectedReturn, volatility, sharpeRatio] = portfolioStats(
      optimizedWeights,
      meanReturns,
      covMatrix
    );

    return NextResponse.json({
      weights: optimizedWeights,
      expectedReturn,
      volatility,
      sharpeRatio
    });
  } catch (error) {
    console.error('Error in portfolio optimization:', error);
    return NextResponse.json({ error: 'Failed to optimize portfolio', details: error.message }, { status: 500 });
  }
}
