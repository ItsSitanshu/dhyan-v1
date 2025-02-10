"use client";
import React, { useEffect, useRef } from "react";

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

interface BoxGridComponents {
  direction: number;
  speed: number;
};

const BoxGrid: React.FC<BoxGridComponents> = ({direction, speed}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      track.style.transition = "transform 15s linear";
      track.style.transform = "translateX(-100%)";
      
      setTimeout(() => {
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        animate();
      }, 15000);
    };

    animate();
  }, []);

  return (
    <div className="relative w-full overflow-hidden px-5">
      <div className="carousel-track-container">
        <div ref={trackRef} className="carousel-track flex whitespace-nowrap">
          {[...boxItems, ...boxItems].map((item, index) => (
            <div key={index} className="box-container relative w-1/3 p-2"> {/* Restored original size */}
              <div className="bg-[#2F5441] p-4 rounded-lg text-center h-24 flex items-center justify-center hover:bg-[#060606] transition-opacity">
                <a href="#" className="block text-foreground text-base"> {/* Restored text size */}
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
        }
        .box-container {
          flex: 0 0 33.33%; /* Each box takes 1/3 of the width for three columns */
        }
      `}</style>
    </div>
  );
};

export default BoxGrid;
