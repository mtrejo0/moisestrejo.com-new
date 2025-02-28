"use client";
"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { create, all } from 'mathjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const math = create(all);

const App = () => {
  const [coefficients, setCoefficients] = useState({ a1: 1, a2: -1, a3: 1 });
  const [data, setData] = useState(null);
  const [area, setArea] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoefficients((prev) => ({ ...prev, [name]: value })); // Allow empty input
  };

  const calculateGraph = () => {
    // Convert to numbers, default to 0 if empty
    const a1 = coefficients.a1 === "" ? 0 : parseFloat(coefficients.a1);
    const a2 = coefficients.a2 === "" ? 0 : parseFloat(coefficients.a2);
    const a3 = coefficients.a3 === "" ? 0 : parseFloat(coefficients.a3);

    // Define the cubic function
    const func = math.parse(`${a1} * x^3 + ${a2} * x^2 + ${a3} * x`);
    const compiledFunc = func.compile();

    // Generate data points only within [0, 1]
    const xValues = math.range(0, 1, 0.01).toArray();
    const yValues = xValues.map((x) => compiledFunc.evaluate({ x }));

    // Calculate the area under the curve using the trapezoidal rule
    let areaSum = 0;
    for (let i = 0; i < xValues.length - 1; i++) {
      const x1 = xValues[i];
      const x2 = xValues[i + 1];
      const y1 = Math.min(Math.max(0, yValues[i]), 1); // Ensure only positive contributions
      const y2 = Math.min(Math.max(0, yValues[i + 1]), 1);
      areaSum += 0.5 * (y1 + y2) * (x2 - x1);
    }

    setArea(areaSum);

    // Prepare data for the chart
    setData({
      labels: xValues,
      datasets: [
        {
          label: 'Curve',
          data: yValues,
          borderColor: 'blue',
          fill: 'start',
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
        },
      ],
    });
  };

  useEffect(() => {
    calculateGraph()
  }, [coefficients])


  return (
    <div className='px-16 bg-white'>
      <br/>
      <h2>Function: a1 * x^3 + a2 * x^2 + a3 * x</h2>
      <br/>
      <input name="a1" type="number" step="any" onChange={handleChange} placeholder="a1" value={coefficients.a1} className='border-2 border-solid'/>
      <br/>
      <input name="a2" type="number" step="any" onChange={handleChange} placeholder="a2" value={coefficients.a2} className='border-2 border-solid'/>
      <br/>
      <input name="a3" type="number" step="any" onChange={handleChange} placeholder="a3" value={coefficients.a3} className='border-2 border-solid'/>
      <br/>

      {data && (
        <div>
          <p>Volume: {(area*100).toFixed(0)}%</p>
          <p>Area under the curve</p>
          <br/>
          <Line
            data={data}
            options={{
              scales: {
                x: {
                  type: 'linear',
                  min: 0,
                  max: 1,
                  title: {
                    display: true,
                    text: 'x',
                  },
                },
                y: {
                  min: 0,
                  max: 1,
                  title: {
                    display: true,
                    text: 'y',
                  },
                },
              },
            }}
            style={{height: "300px"}}
          />
        </div>
      )}
    </div>
  );
};

export default App;
