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
      Bodies = Matter.Bodies,
      Events = Matter.Events,
      Vector = Matter.Vector;

    // Create engine and world
    const engine = Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 1; // Apply gravity

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showVelocity: true,
        showCollisions: true,
        wireframes: false, // Enable solid rendering
      },
    });

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add walls
    Composite.add(world, [
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, {
        isStatic: true,
      }),
      Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight,
        window.innerWidth,
        50,
        { isStatic: true }
      ),
      Bodies.rectangle(
        window.innerWidth,
        window.innerHeight / 2,
        50,
        window.innerHeight,
        { isStatic: true }
      ),
      Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
      }),
    ]);

    // Create friction and force test objects
    const box1 = Bodies.rectangle(300, 70, 40, 40, { friction: 0.05 });
    const box2 = Bodies.rectangle(300, 250, 40, 40, { friction: 0.01 });
    const box3 = Bodies.rectangle(300, 430, 40, 40, { friction: 0 });

    // Create platforms
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
      box1,
      box2,
      box3,
    ]);

    // Apply an initial force to box1 for visualization
    Matter.Body.applyForce(box1, box1.position, { x: 0.02, y: 0 });

    // Mouse interactions
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

    // Event listener to draw force lines
    Events.on(engine, "beforeUpdate", () => {
      const bodies = Composite.allBodies(world);
      const ctx = render.context;
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      bodies.forEach((body) => {
        if (!body.isStatic) {
          const forceVector = Vector.mult(body.force, 5000); // Scale force for visibility
          ctx.moveTo(body.position.x, body.position.y);
          ctx.lineTo(
            body.position.x + forceVector.x,
            body.position.y + forceVector.y
          );

          // Draw directional arrow
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.moveTo(
            body.position.x + forceVector.x,
            body.position.y + forceVector.y
          );
          ctx.lineTo(
            body.position.x + forceVector.x - 5,
            body.position.y + forceVector.y - 5
          );
          ctx.lineTo(
            body.position.x + forceVector.x + 5,
            body.position.y + forceVector.y - 5
          );
          ctx.closePath();
          ctx.fill();
        }
      });

      ctx.stroke();
    });

    // Handle window resize
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

    // Cleanup
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
