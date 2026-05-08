import { NextResponse } from "next/server";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const historicalCache = new Map();
const MAX_RETRIES = 3;

function toUnixTimestamp(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

async function fetchYahooChart(symbol, startDate, endDate, interval) {
  const url = new URL(`https://query2.finance.yahoo.com/v8/finance/chart/${symbol}`);
  url.searchParams.set("interval", interval);
  url.searchParams.set("period1", String(toUnixTimestamp(startDate)));
  url.searchParams.set("period2", String(toUnixTimestamp(endDate)));

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json,text/plain,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    if (response.ok) {
      return response.json();
    }

    const errorBody = await response.text();
    lastError = new Error(
      `Yahoo request failed (${response.status}): ${errorBody.slice(0, 120)}`,
    );

    // Backoff only for rate limiting / temporary errors.
    if (response.status === 429 || response.status >= 500) {
      const delay = 300 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw lastError;
  }

  throw lastError || new Error("Unknown Yahoo request failure");
}

function mapChartResponseToHistorical(chartJson) {
  const result = chartJson?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];

  return timestamps
    .map((ts, idx) => ({
      date: new Date(ts * 1000).toISOString(),
      close: closes[idx],
    }))
    .filter((row) => Number.isFinite(row.close));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const startDate = searchParams.get("startDate");
  const interval = searchParams.get("interval") || "1mo";

  if (!symbol || !startDate) {
    return NextResponse.json(
      { error: "Symbol and start date are required" },
      { status: 400 },
    );
  }

  try {
    const endDate = new Date().toISOString().split("T")[0];
    const cacheKey = `${symbol}:${startDate}:${endDate}:${interval}`;
    const cached = historicalCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const chartJson = await fetchYahooChart(symbol, startDate, endDate, interval);
    const historicalData = mapChartResponseToHistorical(chartJson);

    if (!historicalData.length) {
      return NextResponse.json(
        { error: "No market data available for this ticker/date combination." },
        { status: 404 },
      );
    }

    historicalCache.set(cacheKey, {
      timestamp: Date.now(),
      data: historicalData,
    });

    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);

    const message = String(error?.message || "");
    if (message.toLowerCase().includes("429")) {
      return NextResponse.json(
        {
          error:
            "Market data provider is rate-limiting requests. Please wait a minute and try again.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 },
    );
  }
}
