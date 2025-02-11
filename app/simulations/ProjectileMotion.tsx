"use client";

import React, { useRef, useEffect, useState } from "react";
import Matter from "matter-js";

const ProjectileSimulation: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(50);
  const [engine, setEngine] = useState<Matter.Engine | null>(null);
  const projectileRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, Composite, Bodies, World } = Matter;
    const newEngine = Engine.create();
    setEngine(newEngine);

    const render = Render.create({
      element: sceneRef.current,
      engine: newEngine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "#111",
        wireframes: false,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, newEngine);

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 20,
      window.innerWidth,
      40,
      { isStatic: true, render: { fillStyle: "#444" } }
    );

    World.add(newEngine.world, [ground]);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(newEngine.world, false);
      Engine.clear(newEngine);
      render.canvas.remove();
    };
  }, []);

  const launchProjectile = () => {
    if (!engine || !sceneRef.current) return;

    const { Composite, Bodies, Body } = Matter;

    if (projectileRef.current) {
      Composite.remove(engine.world, projectileRef.current);
    }

    const radianAngle = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(radianAngle);
    const vy = -velocity * Math.sin(radianAngle);

    const projectile = Bodies.circle(100, window.innerHeight - 100, 10, {
      restitution: 0.8,
      friction: 0.1,
      render: { fillStyle: "#4ECDC4" },
    });

    projectileRef.current = projectile;
    Body.setVelocity(projectile, { x: vx, y: vy });

    Composite.add(engine.world, projectile);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      <div className="absolute top-4 left-4 bg-gray-900 p-4 rounded-lg shadow-lg">
        <label className="block mb-2">
          Angle: {angle}°
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full mt-1"
          />
        </label>
        <label className="block mb-2">
          Velocity: {velocity} m/s
          <input
            type="range"
            min="10"
            max="35"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full mt-1"
          />
        </label>
        <button
          onClick={launchProjectile}
          className="w-full bg-blue-500 px-4 py-2 rounded-lg mt-2"
        >
          Launch
        </button>
      </div>

      <div ref={sceneRef} className="h-full w-full"></div>
    </div>
  );
};

export default ProjectileSimulation;
