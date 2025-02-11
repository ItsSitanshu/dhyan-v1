"use client";

import { useState, useEffect, useRef } from "react";

export default function ProjectileMotion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(50);
  const [isLaunched, setIsLaunched] = useState(false);
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);

  const gravity = 9.81;
  let animationFrameId: number;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Draw initial scene
    drawScene(ctx);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const drawScene = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 600, 400);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 400);

    // Draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 380, 600, 20);

    // Draw projectile path
    ctx.fillStyle = "white";
    trajectory.forEach(({ x, y }) => ctx.fillRect(x, y, 2, 2));
  };

  const launchProjectile = () => {
    setIsLaunched(true);
    setTrajectory([]);

    let x = 50;
    let y = 350;
    let vx = speed * Math.cos((angle * Math.PI) / 180);
    let vy = -speed * Math.sin((angle * Math.PI) / 180);
    let t = 0;

    const update = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Physics equations
      x = 50 + vx * t;
      y = 350 + vy * t + 0.5 * gravity * t * t;

      if (y >= 380) {
        setIsLaunched(false);
        return;
      }

      setTrajectory((prev) => [...prev, { x, y }]);
      drawScene(ctx);

      animationFrameId = requestAnimationFrame(update);
      t += 0.1;
    };

    update();
  };

  return (
    <div className="flex flex-col items-center p-5 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Projectile Motion Simulator</h1>

      <canvas ref={canvasRef} className="border border-white mb-4"></canvas>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm">Angle ({angle}°)</label>
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <div>
          <label className="block text-sm">Speed ({speed} m/s)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <button
        onClick={launchProjectile}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isLaunched}
      >
        {isLaunched ? "Launching..." : "Launch"}
      </button>
    </div>
  );
}
