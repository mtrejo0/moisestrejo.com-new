"use client"

import { useState } from "react"

export default function ContributionGrid() {
  // Define months and days
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  const days = ["", "Mon", "", "Wed", "", "Fri", ""]

  // Create a 7x52 grid (7 days x 52 weeks)
  const initialGrid = Array(7)
    .fill(0)
    .map(() => Array(52).fill(0))
  const [grid, setGrid] = useState(initialGrid)
  const [contributions, setContributions] = useState(0)

  // Toggle cell color when clicked
  const toggleCell = (row, col) => {
    const newGrid = [...grid]
    // Increment value up to 4, then back to 0
    newGrid[row][col] = newGrid[row][col] === 4 ? 0 : newGrid[row][col] + 2
    setGrid(newGrid)

    // Count total contributions
    const total = newGrid.flat().filter((cell) => cell > 0).length
    setContributions(total)
  }

  // Get color based on cell value
  const getCellColor = (value) => {
    switch (value) {
      case 0:
        return "#ebedf0" // white/light gray
      case 1:
        return "#9be9a8" // lightest green
      case 2:
        return "#40c463" // light green
      case 3:
        return "#30a14e" // medium green
      case 4:
        return "#216e39" // dark green
      default:
        return "#ebedf0"
    }
  }

  // Get hover color based on cell value
  const getHoverColor = (value) => {
    return value === 0 ? "#d0d7de" : "#1e6231" // slightly darker on hover
  }

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#24292f",
        background: "white"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          {contributions} contributions in the last year
        </h1>
        <div
          style={{
            position: "relative",
          }}
        >
          <button
            style={{
              padding: "4px 12px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#24292f",
              backgroundColor: "#f6f8fa",
              border: "1px solid rgba(27, 31, 36, 0.15)",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Contribution settings ▼
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {/* Month labels */}
        <div
          style={{
            display: "flex",
            marginBottom: "8px",
            fontSize: "12px",
            color: "#57606a",
          }}
        >
          <div style={{ width: "28px" }}></div>
          {months.map((month, i) => (
            <div
              key={month + i}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Grid with day labels */}
        <div style={{ display: "flex" }}>
          {/* Day labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "4px",
              fontSize: "12px",
              color: "#57606a",
            }}
          >
            {days.map((day, i) => (
              <div
                key={i}
                style={{
                  height: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "28px",
                  margin: "2px 0",
                  paddingTop: "-8px"
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Contribution cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(52, 1fr)",
              gap: "2px",
              flex: 1,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: getCellColor(cell),
                    border: "none",
                    borderRadius: "2px",
                    padding: 0,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = getHoverColor(cell)
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = getCellColor(cell)
                  }}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                  aria-label={`Toggle cell at row ${rowIndex}, column ${colIndex}`}
                />
              )),
            )}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "16px",
            fontSize: "12px",
            color: "#57606a",
          }}
        >
          <span style={{ marginRight: "8px" }}>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: getCellColor(level),
                borderRadius: "2px",
                marginRight: "2px",
              }}
            ></div>
          ))}
          <span style={{ marginLeft: "8px" }}>More</span>
        </div>
      </div>
    </div>
  )
}
