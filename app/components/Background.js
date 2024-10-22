'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicSketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

export default function Background() {
  const [dots, setDots] = useState([]);
  const numDots = 50;

  useEffect(() => {
    const initializeDots = (width, height) => {
      const newDots = [];
      for (let i = 0; i < numDots; i++) {
        newDots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.random() * 0.5 - 0.25,
          vy: Math.random() * 0.5 - 0.25
        });
      }
      setDots(newDots);
    };

    if (typeof window !== 'undefined') {
      initializeDots(window.innerWidth, window.innerHeight);
    }
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(255); // White background
    p5.strokeWeight(2);

    dots.forEach((dot, i) => {
      // Move the dot
      dot.x += dot.vx;
      dot.y += dot.vy;
      
      // Bounce off edges
      if (dot.x < 0 || dot.x > p5.width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > p5.height) dot.vy *= -1;
      
      // Draw the dot as an ellipse
      p5.fill(0); // Black color
      p5.ellipse(dot.x, dot.y, 5, 5);
      
      // Connect nearby dots with fading lines
      for (let j = i + 1; j < dots.length; j++) {
        let other = dots[j];
        let d = p5.dist(dot.x, dot.y, other.x, other.y);
        const maxDistance = 100;
        if (d < maxDistance) {
          let alpha = p5.map(d, 0, maxDistance, 255, 0); // Map distance to alpha value
          p5.stroke(0, alpha); // Set stroke color with calculated alpha
          p5.line(dot.x, dot.y, other.x, other.y);
        }
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <DynamicSketch setup={setup} draw={draw} />
    </div>
  );
}