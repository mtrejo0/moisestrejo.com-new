"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const DynamicSketch = dynamic(
  () => import("react-p5").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export default function Background() {
  const roachesRef = useRef([]);

  class Cockroach {
    constructor(p5) {
      // Random starting position on edges
      const side = Math.floor(Math.random() * 4);
      const SPEED = 3;
      
      if (side === 0) { // Top
        this.x = Math.random() * p5.width;
        this.y = -20;
      } else if (side === 1) { // Right
        this.x = p5.width + 20;
        this.y = Math.random() * p5.height;
      } else if (side === 2) { // Bottom
        this.x = Math.random() * p5.width;
        this.y = p5.height + 20;
      } else { // Left
        this.x = -20;
        this.y = Math.random() * p5.height;
      }

      this.speed = SPEED;
      this.angle = Math.random() * Math.PI * 2;
      this.moveTimer = 0;
      this.isMoving = true;
      this.pauseDuration = Math.random() * 60 + 30; // 0.5-1.5 seconds at 60fps
    }

    update(p5) {
      if (this.isMoving) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.moveTimer++;

        if (this.moveTimer > 60) { // Move for 1 second
          this.isMoving = false;
          this.moveTimer = 0;
        }
      } else {
        this.moveTimer++;
        if (this.moveTimer > this.pauseDuration) {
          this.isMoving = true;
          this.moveTimer = 0;
          this.angle = Math.random() * Math.PI * 2;
        }
      }
      
      return (
        this.x < -50 ||
        this.x > p5.width + 50 ||
        this.y < -50 ||
        this.y > p5.height + 50
      );
    }

    draw(p5) {
      p5.push();
      p5.translate(this.x, this.y);
      p5.rotate(this.angle);
      
      // Body
      p5.fill(30);
      p5.noStroke();
      p5.ellipse(0, 0, 20, 12);
      
      // Head
      p5.fill(40);
      p5.ellipse(8, 0, 8, 6);
      
      // Antennae
      p5.stroke(30);
      p5.strokeWeight(1);
      p5.line(8, -2, 14, -6);
      p5.line(8, 2, 14, 6);
      
      // Legs
      for (let i = -1; i <= 1; i++) {
        p5.line(-4, 0, -8, i * 6);  // Left side
        p5.line(4, 0, 8, i * 6);    // Right side
      }
      
      p5.pop();
    }
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.background(255, 255, 255, 200); // Set initial background with some transparency
  };

  const draw = (p5) => {
    p5.clear();
    p5.background(255, 255, 255, 200); // Semi-transparent background

    // Add new cockroach every 3 seconds
    if (p5.frameCount % (60 * 3) === 0) {
      roachesRef.current = [...roachesRef.current, new Cockroach(p5)];
    }

    // Update and draw cockroaches
    roachesRef.current = roachesRef.current.filter(roach => {
      const isVisible = !roach.update(p5);
      roach.draw(p5);
      return isVisible;
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <DynamicSketch setup={setup} draw={draw} />
    </div>
  );
}
