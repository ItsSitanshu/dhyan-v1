"use client";
import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const FrictionSimulation: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

    // Create engine and world
    const engine = Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 9.8;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showVelocity: true,
        showCollisions: true,
        wireframes: false,
      },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Static boundaries
    Composite.add(world, [
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true }),
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true }),
      Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
      Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
    ]);

    // Friction values based on real-world materials
    const frictionValues = [
      { kinetic: 0.5, static: 0.7 }, // Wood on wood
      { kinetic: 0.1, static: 0.3 }, // Ice on ice
      { kinetic: 0.02, static: 0.1 }, // Oiled metal
    ];

    // Platforms
    Composite.add(world, [
      Bodies.rectangle(300, 180, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
      }),
      Bodies.rectangle(300, 350, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
      }),
      Bodies.rectangle(300, 520, 700, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
      }),
    ]);

    // Objects with realistic friction
    const objects = frictionValues.map((friction, index) =>
      Bodies.rectangle(300, 70 + index * 180, 40, 40, {
        friction: friction.kinetic, // Kinetic friction
        frictionStatic: friction.static, // Static friction
      })
    );

    Composite.add(world, objects);

    // Apply force to the first object to see friction in action
    Matter.Body.applyForce(objects[0], objects[0].position, { x: 0.02, y: 0 });

    // Mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    const resize = () => {
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight },
      });
    };
    window.addEventListener("resize", resize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default FrictionSimulation;
