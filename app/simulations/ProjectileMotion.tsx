"use client";

import React, { useRef, useEffect, useState } from "react";
import Matter from "matter-js";

const ProjectileSimulation: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const projectileRef = useRef<Matter.Body | null>(null);
  const trajectories = useRef<{ x: number; y: number }[][]>([]);
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(25);
  const [mass, setMass] = useState<number>(5);

  useEffect(() => {
    if (!sceneRef.current || !canvasRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Composite,
      Bodies,
      Mouse,
      MouseConstraint,
      World,
      Events,
    } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "rgb(20, 16, 16)",
        wireframes: false,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create the ground
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 20,
      window.innerWidth,
      40,
      { isStatic: true, render: { fillStyle: "#222" } }
    );

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    });

    World.add(world, [ground, mouseConstraint]);

    Events.on(engine, "afterUpdate", () => {
      if (projectileRef.current) {
        if (!trajectories.current.length || projectileRef.current.position.y < window.innerHeight - 30) {
          trajectories.current[trajectories.current.length - 1].push({
            x: projectileRef.current.position.x,
            y: projectileRef.current.position.y,
          });
        }
      }
      drawCanvas(render); // Redraw trajectories and force vectors
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const launchProjectile = () => {
    if (!engineRef.current) return;

    const { Composite, Bodies, Body } = Matter;
    const engine = engineRef.current;
    const world = engine.world;

    if (projectileRef.current) {
      Composite.remove(world, projectileRef.current);
    }

    const radianAngle = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(radianAngle);
    const vy = -velocity * Math.sin(radianAngle);

    const radius = 10 + mass * 2;
    const projectile = Bodies.circle(0, window.innerHeight - 20, radius, {
      restitution: 0.6,
      friction: 0.05,
      mass: mass,
      render: { fillStyle: "#ffffff" },
    });

    projectileRef.current = projectile;
    Body.setVelocity(projectile, { x: vx, y: vy });

    Composite.add(world, [projectile]);

    // Store trajectory path
    trajectories.current.push([]);
  };


  const drawCanvas = (render: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = render.context;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    trajectories.current.forEach((trajectory) => {
      ctx.beginPath();
      trajectory.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    if (projectileRef.current) {
      const body = projectileRef.current;

      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(body.position.x, body.position.y + body.mass * 5);
      ctx.stroke();

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(body.position.x + body.velocity.x * 5, body.position.y);
      ctx.stroke();

      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(body.position.x, body.position.y + body.velocity.y * 5);
      ctx.stroke();

      ctx.strokeStyle = "green";
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(
        body.position.x + body.velocity.x * 5,
        body.position.y + body.velocity.y * 5
      );
      ctx.stroke();

      ctx.fillStyle = "blue";
      ctx.font = "14px Arial";
      ctx.fillText(`Vertical Force: ${(body.velocity.y).toFixed(2)} m/s`, 250, 250);
      ctx.fillStyle = "yellow";
      ctx.fillText(`Horizontal Force: ${(body.velocity.x).toFixed(2)} m/s`, 250, 280);

    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={sceneRef} className="absolute w-full h-full"></div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="absolute top-4 left-4 bg-foreground text-background p-4 rounded-lg shadow-lg">
        <label className="block mb-2">
          Angle: {angle}°
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full mt-1 accent-prim1"
          />
        </label>
        <label className="block mb-2">
          Velocity: {velocity} m/s
          <input
            type="range"
            min="10"
            max="25"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full mt-1"
          />
        </label>  
        <button
          onClick={launchProjectile}
          className="w-full bg-lsec text-foreground hover:bg-bgsec font-bold px-4 py-2 rounded-lg mt-2"
        >
          Launch
        </button>
      </div>
    </div>
  );
};

export default ProjectileSimulation;
