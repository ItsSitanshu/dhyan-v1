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

const templates = {
  Mercury: {
    mass: 0.005,
    radius: 3,
    color: "gray",
    offset: 57.9,
    vy: Math.sqrt(0.067 * 30000 / 57.9)
  },
  Venus: {
    mass: 0.073,
    radius: 5,
    color: "yellow",
    offset: 108.2,
    vy: Math.sqrt(0.067 * 30000 / 108.2)
  },
  Earth: {
    mass: 0.090,
    radius: 6,
    color: "blue",
    offset: 149.6,
    vy: Math.sqrt(0.067 * 30000 / 149.6)
  },
  Mars: {
    mass: 0.0097,
    radius: 4,
    color: "red",
    offset: 227.9,
    vy: Math.sqrt(0.067 * 30000 / 227.9)
  },
  Jupiter: {
    mass: 28.6,
    radius: 12,
    color: "brown",
    offset: 778.6,
    vy: Math.sqrt(0.067 * 30000 / 778.6)
  },
  Saturn: {
    mass: 8.6,
    radius: 10,
    color: "goldenrod",
    offset: 1433.5,
    vy: Math.sqrt(0.067 * 30000 / 1433.5)
  },
  Uranus: {
    mass: 1.31,
    radius: 8,
    color: "lightblue",
    offset: 2872.5,
    vy: Math.sqrt(0.067 * 30000 / 2872.5)
  },
  Neptune: {
    mass: 1.55,
    radius: 8,
    color: "blue",
    offset: 4495.1,
    vy: Math.sqrt(0.067 * 30000 / 4495.1)
  }
};



const Orbital: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showGravityLines, setShowGravityLines] = useState(true);
  const G = 0.067;
  const FPS = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const sun: Particle = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      mass: 30000,
      radius: 30 * scale,
      color: "yellow",
      path: []
    };

    const earth: Particle = {
      x: canvas.width / 2 + 149.6 * scale,
      y: canvas.height / 2,
      vx: 0,
      vy: Math.sqrt(0.067 * 30000 / 149.6),
      mass: 0.090,
      radius: 6 * scale,
      color: "blue",
      path: []
    };

    particlesRef.current = [sun, earth];

    const updateParticles = () => {
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        let ax = 0, ay = 0;
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            const dx = particles[j].x - particles[i].x;
            const dy = particles[j].y - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 10) {
              const force = (G * particles[i].mass * particles[j].mass) / (distance * distance);
              ax += (force * dx) / (distance * particles[i].mass);
              ay += (force * dy) / (distance * particles[i].mass);
            }
          }
        }
        particles[i].vx += ax;
        particles[i].vy += ay;
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].path.push({ x: particles[i].x, y: particles[i].y });
        if (particles[i].path.length > 30000) {
          particles[i].path.shift();
        }
      }
    };

    const drawParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      if (showGravityLines) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

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

        if (showInfo) {
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.fillText(`Mass: ${particle.mass}`, particle.x + 15, particle.y - 15);
          ctx.fillText(`Velocity: (${particle.vx.toFixed(2)}, ${particle.vy.toFixed(2)})`, particle.x + 15, particle.y);
        }
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      setTimeout(() => requestAnimationFrame(animate), 1000 / FPS);
    };

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [scale, showGravityLines, showInfo]);


  const addPlanet = (type: keyof typeof templates) => {
    const template = templates[type];
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current.push({
      x: canvas.width / 2 + template.offset * scale,
      y: canvas.height / 2,
      vx: 0,
      vy: template.vy,
      mass: template.mass,
      radius: template.radius * scale,
      color: template.color,
      path: []
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} className="bg-black"></canvas>
      <div className="absolute top-10 left-10 bg-white p-4 rounded shadow-lg">
        <button className="m-2 p-2 bg-gray-500 text-white rounded" onClick={() => setScale(scale / 1.1)}>-</button>
        <button className="m-2 p-2 bg-gray-500 text-white rounded" onClick={() => setShowGravityLines(!showGravityLines)}>Toggle Gravity Lines</button>
        <button className="m-2 p-2 bg-gray-500 text-white rounded" onClick={() => setShowInfo(!showInfo)}>Toggle Info</button>
        <button className="m-2 p-2 bg-blue-500 text-white rounded" onClick={() => addPlanet("Mars")}>Add Mars</button>
        <button className="m-2 p-2 bg-orange-500 text-white rounded" onClick={() => addPlanet("Jupiter")}>Add Jupiter</button>
        <button className="m-2 p-2 bg-yellow-500 text-white rounded" onClick={() => addPlanet("Venus")}>Add Venus</button>
      </div>
    </div>
  );
};

export default Orbital;
