'use client';

import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

export default function Background() {
  const [isMobile, setIsMobile] = useState(false);
  const numDots = isMobile ? 20 : 50;
  let dots = [];

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-.5, .5),
        vy: p5.random(-.5, .5)
      });
    }
  };

  const draw = (p5) => {
    p5.background(255); // White background
    p5.strokeWeight(2);

    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];
      
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
        if (d < 150) {
          let alpha = p5.map(d, 0, 100, 255, 0); // Map distance to alpha value
          p5.stroke(0, alpha); // Set stroke color with calculated alpha
          p5.line(dot.x, dot.y, other.x, other.y);
        }
      }
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}