"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";

const FrictionSimulation: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [simulationKey, setSimulationKey] = useState(0); // Key to re-render the simulation

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies,
      Events = Matter.Events;

    const engine = Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 9.8;

    const container = sceneRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        background: "rgb(20, 16, 16)",
        wireframes: false,
        showVelocity: true,
        showCollisions: true,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const wallThickness = 100;
    Composite.add(world, [
      Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: "rgba(0, 0, 0, 0)" } }),
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: "rgba(0, 0, 0, 0)" } }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: "rgba(0, 0, 0, 0)" } }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: "rgba(0, 0, 0, 0)" } }),
    ]);

    const frictionMaterials = [
      { name: "Oiled Metal", kinetic: 0.02, static: 0.1, color: "gray" },
      { name: "Ice", kinetic: 0.1, static: 0.3, color: "lightblue" },
      { name: "Smooth Plastic", kinetic: 0.2, static: 0.4, color: "lightgray" },
      { name: "Rubber on Dry Asphalt", kinetic: 0.4, static: 0.6, color: "black" },
      { name: "Wood", kinetic: 0.5, static: 0.7, color: "brown" },
      { name: "Rough Concrete", kinetic: 0.7, static: 0.9, color: "darkgray" },
    ];

    const platforms = frictionMaterials.map((material, index) =>
      Bodies.rectangle(300, 180 + index * 100, 800, 20, {
        isStatic: true,
        angle: Math.PI * 0.06,
        render: { fillStyle: material.color },
        label: material.name,
      })
    );
    Composite.add(world, platforms);

    const objects = frictionMaterials.map((material, index) =>
      Bodies.rectangle(300, 140 + index * 100, 40, 40, {
        friction: 0,
        frictionStatic: 0,
        render: { fillStyle: "white" },
        label: material.name,
      })
    );
    Composite.add(world, objects);

    Matter.Body.applyForce(objects[0], objects[0].position, { x: 0.02, y: 0 });

    Events.on(engine, "collisionStart", (event: any) => {
      event.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        const platform = platforms.find((p) => p.id === bodyA.id || p.id === bodyB.id);
        const object = objects.find((o) => o.id === bodyA.id || o.id === bodyB.id);
        if (platform && object) {
          object.friction = frictionMaterials.find((m) => m.name === platform.label)?.kinetic || 0.5;
        }
      });
    });

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.fillText("Friction Simulation: Understanding Different Materials", 50, 50);
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Objects interact with different surfaces based on their friction coefficients.", 50, 70);
      objects.forEach((body) => {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(body.position.x, body.position.y);
        ctx.lineTo(body.position.x - body.friction * 50, body.position.y);
        ctx.stroke();
      });

      platforms.forEach((platform) => {
        ctx.fillText(platform.label, platform.position.x - 20, platform.position.y - 30);
      });
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    const resize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: newWidth, y: newHeight } });
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
  }, [simulationKey]); // Re-run when simulationKey changes

  const resetSimulation = () => {
    setSimulationKey((prevKey) => prevKey + 1); // Change the key to force re-render
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={sceneRef} style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "3em" }}></div>
      <button
        onClick={resetSimulation}
        className="absolute top-[20px] right-[20px] p-[10px] font-md text-background font-bold bg-prim1 hover:bg-sec1 transition-all duration-300 hover:cursor-pointer rounded-md"
      >
        Reset Simulation
      </button>
    </motion.div>
  );
};


export default FrictionSimulation;
