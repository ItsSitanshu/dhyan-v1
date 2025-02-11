"use client";
import React, { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  path: { x: number; y: number }[];
}

const G = 0.067; // Gravitational constant
const SUN_MASS = 30000;
const SCALE = 0.5;

const templates = {
  Mercury: { mass: 0.005, radius: 3, color: "gray", a: 57.9, e: 0.205 },
  Venus: { mass: 0.073, radius: 5, color: "yellow", a: 108.2, e: 0.007 },
  Earth: { mass: 0.090, radius: 6, color: "blue", a: 149.6, e: 0.017 },
  Mars: { mass: 0.0097, radius: 4, color: "red", a: 227.9, e: 0.093 },
  Jupiter: { mass: 28.6, radius: 12, color: "brown", a: 778.6, e: 0.049 },
  Saturn: { mass: 8.6, radius: 10, color: "goldenrod", a: 1433.5, e: 0.056 },
  Uranus: { mass: 1.31, radius: 8, color: "lightblue", a: 2872.5, e: 0.046 },
  Neptune: { mass: 1.55, radius: 8, color: "blue", a: 4495.1, e: 0.010 }
};

interface OrbitalsInterface {
  parentRef?: any ;
}

const Orbitals: React.FC<OrbitalsInterface> = ({ parentRef = null }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const FPS = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      if (parentRef && parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const sun: Particle = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      mass: SUN_MASS,
      radius: 30,
      color: "yellow",
      path: []
    };
    particlesRef.current = [sun];

    const updateParticles = () => {
      const particles = particlesRef.current;
      for (let i = 1; i < particles.length; i++) {
        let ax = 0, ay = 0;
        const dx = sun.x - particles[i].x;
        const dy = sun.y - particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 10) {
          const force = (G * SUN_MASS * particles[i].mass) / (distance * distance);
          ax = (force * dx) / (distance * particles[i].mass);
          ay = (force * dy) / (distance * particles[i].mass);
        }
        particles[i].vx += ax;
        particles[i].vy += ay;
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].path.push({ x: particles[i].x, y: particles[i].y });
        if (particles[i].path.length > 5000) {
          particles[i].path.shift();
        }
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();

        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < particle.path.length - 1; i++) {
          ctx.moveTo(particle.path[i].x, particle.path[i].y);
          ctx.lineTo(particle.path[i + 1].x, particle.path[i + 1].y);
        }
        ctx.stroke();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      setTimeout(() => requestAnimationFrame(animate), 1000 / FPS);
    };
    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const addPlanet = (type: keyof typeof templates) => {
    const template = templates[type];
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const a = template.a * SCALE; // Semi-major axis
    const e = template.e; // Eccentricity
  
    const trueAnomaly = Math.random() * 2 * Math.PI; 
  
    const r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly)); // Distance from the Sun
    const x = r * Math.cos(trueAnomaly);
    const y = r * Math.sin(trueAnomaly) * Math.sqrt(1 - e * e);
  
    const planetX = canvas.width / 2 + x;
    const planetY = canvas.height / 2 + y;
  
    const orbitalVelocity = Math.sqrt(G * SUN_MASS * ((2 / r) - (1 / a)));
  
    const vx = -orbitalVelocity * Math.sin(trueAnomaly);
    const vy = orbitalVelocity * Math.cos(trueAnomaly);
  
    particlesRef.current.push({
      x: planetX,
      y: planetY,
      vx,
      vy,
      mass: template.mass,
      radius: template.radius,
      color: template.color,
      path: [],
    });
  };
  
  

  return (
    <div>
      <canvas ref={canvasRef} className="bg-black"></canvas>
      <div className="absolute top-10 left-10 bg-white p-4 rounded shadow-lg">
        <button className="m-2 p-2 bg-blue-500 text-white rounded" onClick={() => addPlanet("Earth")}>Add Earth</button>
        <button className="m-2 p-2 bg-red-500 text-white rounded" onClick={() => addPlanet("Mars")}>Add Mars</button>
        <button className="m-2 p-2 bg-yellow-500 text-white rounded" onClick={() => addPlanet("Venus")}>Add Venus</button>
        <button className="m-2 p-2 bg-yellow-500 text-white rounded" onClick={() => addPlanet("Jupiter")}>Add Jupiter</button>
      
      </div>
    </div>
  );
};

export default Orbitals;
