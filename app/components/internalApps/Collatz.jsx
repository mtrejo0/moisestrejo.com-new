"use client"

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const Collatz = () => {
  const [number, setNumber] = useState("");
  const [sequence, setSequence] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const svgRef = useRef();

  const calculateCollatz = (n) => {
    const seq = [n];
    let current = n;
    
    while (current !== 1) {
      if (current % 2 === 0) {
        current = current / 2;
      } else {
        current = current * 3 + 1;
      }
      seq.push(current);
    }
    
    return seq;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(number);
    if (num > 0) {
      const seq = calculateCollatz(num);
      setSequence(seq);
      setMaxValue(Math.max(...seq));
    }
  };

  useEffect(() => {
    if (sequence.length > 0) {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();

      // Set up dimensions
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Set up scales
      const xScale = d3.scaleLinear()
        .domain([0, sequence.length - 1])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0]);

      // Create line generator
      const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

      // Add axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g")
        .call(d3.axisLeft(yScale));

      // Add line path
      svg.append("path")
        .datum(sequence)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add points
      svg.selectAll("circle")
        .data(sequence)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 4)
        .attr("fill", "#3b82f6")
        .append("title")
        .text(d => d);
    }
  }, [sequence, maxValue]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Collatz Conjecture Visualizer</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a positive number"
            className="flex-1 p-2 border rounded"
            min="1"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
        </div>
      </form>

      {sequence.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <svg ref={svgRef} className="w-full"></svg>

          <div>
            <p>Steps to reach 1: {sequence.length - 1}</p>
            <p>Maximum value: {maxValue}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Sequence:</h2>
            <p className="text-gray-600">{sequence.join(" → ")}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">About the Collatz Conjecture</h2>
        <p>
          The Collatz conjecture states that for any positive integer n, the sequence will always reach 1 
          by following these rules:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>If n is even, divide by 2</li>
          <li>If n is odd, multiply by 3 and add 1</li>
        </ul>
      </div>
    </div>
  );
};

export default Collatz;
