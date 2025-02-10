"use client";
import React, { useState, useEffect, useRef } from "react";

const boxItems = [
  "Write a message that goes with a kitten gif for a friend on a rough day",
  "Test my knowledge on ancient civilizations",
  "Write a text asking a friend to be my plus-one at a wedding",
  "Improve my essay writing ask me to outline my thoughts",
  "Create a personal webpage for me after asking me three questions",
  "Create a morning routine to boost my productivity",
  "Plan a 'mental health day' to help me relax",
  "Give me ideas about how to plan my New Year's resolutions",
  "Help me pick an outfit that will look good on camera",
];

const BoxGrid: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const intervalRef = useRef<number | NodeJS.Timeout | null>(null);

  const itemsPerRow = 3; // 3 items per row in the grid

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + itemsPerRow) % boxItems.length);
  };

  const startCarousel = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current as number);
      intervalRef.current = null;
    }
    intervalRef.current = window.setInterval(nextSlide, 4000); // Auto slide every 4 seconds
  };

  useEffect(() => {
    startCarousel();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
    };
  }, []);

  const stopCarousel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current as number);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={stopCarousel} // Stop the carousel when the mouse enters
      onMouseLeave={startCarousel} // Start the carousel when the mouse leaves
    >
      <div className="carousel-track-container">
        <div className="carousel-track flex">
          {/* Loop through the boxItems array and display in 3x3 grid */}
          {boxItems
            .slice(startIndex, startIndex + itemsPerRow)
            .map((item, index) => (
              <div key={index} className="box-container relative w-1/3 p-2">
                <div className="bg-[#1F1F1F] p-4 rounded-lg text-center h-24 flex items-center justify-center hover:bg-[#060606] transition-opacity">
                  <a href="#" className="block text-foreground">
                    {item}
                  </a>
                </div>
              </div>
            ))}

          {/* Duplicate the boxItems for seamless loop */}
          {boxItems.slice(0, itemsPerRow).map((item, index) => (
            <div
              key={index + boxItems.length}
              className="box-container relative w-1/3 p-2"
            >
              <div className="bg-[#1F1F1F] p-4 rounded-lg text-center h-24 flex items-center justify-center hover:bg-[#060606] transition-opacity">
                <a href="#" className="block text-foreground">
                  {item}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track-container {
          width: 100%;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          animation: slide 20s linear infinite; /* Infinite slide */
        }

        .box-container {
          flex: 0 0 33.33%; /* Each box item takes 1/3 of the width (3 items per row) */
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%); /* Moves entire row of items */
          }
        }

        .carousel-track:hover {
          animation-play-state: paused; /* Pause animation on hover */
        }

        .carousel-track-container:hover .carousel-track {
          animation-play-state: paused; /* Ensure all items stop moving when hovering anywhere in the carousel */
        }
      `}</style>
    </div>
  );
};

export default BoxGrid;
