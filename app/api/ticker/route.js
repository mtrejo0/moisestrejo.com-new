import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const startDate = searchParams.get("startDate");

  if (!symbol || !startDate) {
    return NextResponse.json(
      { error: "Symbol and start date are required" },
      { status: 400 },
    );
  }

  try {
    const endDate = new Date().toISOString().split("T")[0]; // Today's date

    const historicalData = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: "1mo", // Fetch data for every month instead of every day
    });

    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 },
    );
  }
}
