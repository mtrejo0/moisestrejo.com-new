'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicSketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

export default function Background() {
  const [dots, setDots] = useState([]);
  const numDots = 50;

  useEffect(() => {
    // Initialize dots only once when the component mounts
    const initialDots = Array.from({ length: numDots }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25
    }));
    setDots(initialDots);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(255); // White background
    p5.strokeWeight(2);

    setDots(prevDots => prevDots.map(dot => {
      // Move the dot
      let newX = dot.x + dot.vx;
      let newY = dot.y + dot.vy;
      
      // Bounce off edges
      let newVx = (newX < 0 || newX > p5.width) ? -dot.vx : dot.vx;
      let newVy = (newY < 0 || newY > p5.height) ? -dot.vy : dot.vy;
      
      // Draw the dot as an ellipse
      p5.fill(0); // Black color
      p5.ellipse(newX, newY, 5, 5);
      
      return { x: newX, y: newY, vx: newVx, vy: newVy };
    }));

    // Connect nearby dots with fading lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        let d = p5.dist(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
        const maxDistance = 100;
        if (d < maxDistance) {
          let alpha = p5.map(d, 0, maxDistance, 255, 0); // Map distance to alpha value
          p5.stroke(0, alpha); // Set stroke color with calculated alpha
          p5.line(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
        }
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <DynamicSketch setup={setup} draw={draw} />
    </div>
  );
}