"use client"; // ONLY for Next.js

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const CollisionFiltering: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    try {
      const {
        Engine,
        Render,
        Runner,
        Composite,
        Composites,
        Bodies,
        Mouse,
        MouseConstraint,
      } = Matter;

      const engine = Engine.create();
      const world = engine.world;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
          width,
          height,
          wireframes: false,
        },
      });
      Render.run(render);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const defaultCategory = 0x0001;
      const redCategory = 0x0002;
      const greenCategory = 0x0004;
      const blueCategory = 0x0008;

      const colorA = "#f55a3c";
      const colorB = "#063e7b";
      const colorC = "#f5d259";

      // Ground at bottom
      Composite.add(
        world,
        Bodies.rectangle(width / 2, height - 25, width, 50, {
          isStatic: true,
          render: { fillStyle: "transparent", lineWidth: 1 },
        })
      );

      // Centered stack of objects
      const stackX = width / 2 - 100; // Adjusted to center the stack
      const stackY = height / 2 - 150; // Placed in the center vertically

      Composite.add(
        world,
        Composites.stack(stackX, stackY, 5, 9, 10, 10, (x, y, column, row) => {
          let category = redCategory;
          let color = colorA;

          if (row > 5) {
            category = blueCategory;
            color = colorB;
          } else if (row > 2) {
            category = greenCategory;
            color = colorC;
          }

          return Bodies.circle(x, y, 20, {
            collisionFilter: { category },
            render: {
              strokeStyle: color,
              fillStyle: "transparent",
              lineWidth: 1,
            },
          });
        })
      );

      // Balls falling into the center
      Composite.add(
        world,
        Bodies.circle(width / 2 - 80, height / 2 - 200, 30, {
          collisionFilter: { mask: defaultCategory | greenCategory },
          render: { fillStyle: colorC },
        })
      );

      Composite.add(
        world,
        Bodies.circle(width / 2, height / 2 - 200, 30, {
          collisionFilter: { mask: defaultCategory | redCategory },
          render: { fillStyle: colorA },
        })
      );

      Composite.add(
        world,
        Bodies.circle(width / 2 + 80, height / 2 - 200, 30, {
          collisionFilter: { mask: defaultCategory | blueCategory },
          render: { fillStyle: colorB },
        })
      );

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });

      Composite.add(world, mouseConstraint);
      render.mouse = mouse;

      mouseConstraint.collisionFilter.mask =
        defaultCategory | blueCategory | greenCategory;

      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height },
      });

      // Resize event listener
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        render.canvas.width = newWidth;
        render.canvas.height = newHeight;
        Render.lookAt(render, {
          min: { x: 0, y: 0 },
          max: { x: newWidth, y: newHeight },
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        Render.stop(render);
        Runner.stop(runner);
        Engine.clear(engine);
        render.canvas.remove();
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("An error occurred in the physics simulation:", error);
    }
  }, []);

  return <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default CollisionFiltering;
