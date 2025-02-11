"use client";
import React, { useRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";

const NewtonSecondLaw: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mass1, setMass1] = useState<number>(5);
  const [mass2, setMass2] = useState<number>(5);
  const [velocity1, setVelocity1] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [velocity2, setVelocity2] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [engine, setEngine] = useState<Matter.Engine | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Matter.Vector | null>(null);
  const [currentBall, setCurrentBall] = useState<Matter.Body | null>(null);
  const [forceLine, setForceLine] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const ballsRef = useRef<{
    ball1: Matter.Body | null;
    ball2: Matter.Body | null;
  }>({ ball1: null, ball2: null });

  useEffect(() => {
    if (!sceneRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Composite,
      Bodies,
      Mouse,
      MouseConstraint,
    } = Matter;
    const newEngine = Engine.create();
    setEngine(newEngine);

    const render = Render.create({
      element: sceneRef.current,
      engine: newEngine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        hasBounds: true,
      },
    });

    // Mouse setup
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(newEngine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Composite.add(newEngine.world, mouseConstraint);
    render.mouse = mouse;
    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, newEngine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(newEngine.world, false);
      Engine.clear(newEngine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (engine) startSimulation();
  }, [mass1, mass2]);

  const startSimulation = () => {
    if (!engine || !sceneRef.current) return;
    const { Composite, Bodies, Body, Vector } = Matter;

    Composite.clear(engine.world, false);

    // Create balls with mass-dependent radius
    const createBall = (x: number, y: number, mass: number, color: string) => {
      const radius = 10 + mass * 3;
      const ball = Bodies.circle(x, y, radius, {
        mass,
        restitution: 0.2,
        frictionAir: 0,
        render: { fillStyle: color },
      });
      Body.setVelocity(ball, Vector.create(0, 0));
      return ball;
    };

    const ball1 = createBall(
      window.innerWidth / 2 - 100,
      200,
      mass1,
      "#FF6B6B"
    );
    const ball2 = createBall(
      window.innerWidth / 2 + 100,
      200,
      mass2,
      "#4ECDC4"
    );
    ballsRef.current = { ball1, ball2 };

    // Walls
    const walls = [
      Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight,
        window.innerWidth,
        50,
        { isStatic: true }
      ),
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, {
        isStatic: true,
      }),
      Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
      }),
      Bodies.rectangle(
        window.innerWidth,
        window.innerHeight / 2,
        50,
        window.innerHeight,
        { isStatic: true }
      ),
    ];

    Composite.add(engine.world, [...walls, ball1, ball2]);

    // Collision handling
    // Matter.Events.on(engine, "collisionStart", (event) => {
    //   event.pairs.forEach(({ bodyA, bodyB }) => {
    //     if ([bodyA, bodyB].includes(ball1)) Body.scale(ball1, 1.1, 1.1);
    //     if ([bodyA, bodyB].includes(ball2)) Body.scale(ball2, 1.1, 1.1);
    //   });
    // });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (ballsRef.current.ball1) setVelocity1(ballsRef.current.ball1.velocity);
      if (ballsRef.current.ball2) setVelocity2(ballsRef.current.ball2.velocity);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!engine) return;
    const { ball1, ball2 } = ballsRef.current;
    const mousePosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    const clickedBall = [ball1, ball2].find(
      (ball) => ball && Matter.Bounds.contains(ball.bounds, mousePosition)
    );

    if (clickedBall) {
      setCurrentBall(clickedBall);
      setDragStart(mousePosition);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && currentBall && dragStart) {
      const mousePosition = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
      setForceLine(mousePosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && currentBall && dragStart) {
      const force = Matter.Vector.sub(dragStart, forceLine);
      Matter.Body.applyForce(
        currentBall,
        currentBall.position,
        Matter.Vector.div(force, -1000)
      );
      setIsDragging(false);
      setDragStart(null);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
    <div>
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <div className="mb-4">
          <label className="block mb-2">
            Ball 1 Mass: {mass1}kg
            <input
              type="range"
              min="1"
              max="20"
              value={mass1}
              onChange={(e) => setMass1(Number(e.target.value))}
              className="w-full mt-1"
            />
          </label>
          <label className="block">
            Ball 2 Mass: {mass2}kg
            <input
              type="range"
              min="1"
              max="20"
              value={mass2}
              onChange={(e) => setMass2(Number(e.target.value))}
              className="w-full mt-1"
            />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            Ball 1 Velocity:
            {velocity1.x.toFixed(1)}m/s, {velocity1.y.toFixed(1)}m/s
          </p>
          <p className="text-sm">
            Ball 2 Velocity:
            {velocity2.x.toFixed(1)}m/s, {velocity2.y.toFixed(1)}m/s
          </p>
        </div>
      </div>

      <div
        ref={sceneRef}
        className="h-full w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {isDragging && currentBall && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <line
              x1={currentBall.position.x}
              y1={currentBall.position.y}
              x2={forceLine.x}
              y2={forceLine.y}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </svg>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default NewtonSecondLaw;
