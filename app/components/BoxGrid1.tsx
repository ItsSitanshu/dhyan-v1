"use client";
import React, { useState } from "react";

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
  "What are some effective note-taking methods?",
  "How can I improve my memory for exams?",
  "What’s the best way to manage my study time?",
  "How do I write a Python function that finds the largest number in a list?",
  "Can you explain object-oriented programming with examples?",
  "What were the main causes of World War I?",
  "Can you summarize the American Civil Rights Movement?",
  "Who were the key figures in the Renaissance?",
  "Can you help me analyze this poem by Robert Frost?",
  "What is the difference between a simile and a metaphor?",
  "Can you check my essay for grammar mistakes?",
  "Explain Newton’s laws of motion with real-life examples.",
  "What is the difference between mitosis and meiosis?",
  "How does photosynthesis work in plants?",
  "Can you explain the Pythagorean theorem with an example?",
  "How do I solve quadratic equations using the quadratic formula?"
];

interface BoxGridProps {
  speed?: number; // Speed in seconds
  direction?: "left" | "right";
}

const BoxGrid1: React.FC<BoxGridProps> = ({ speed = 90, direction = "left" }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="carousel-track">
        <div
          className={`carousel-track-inner ${direction === "left" ? "marquee-left" : "marquee-right"}`}
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: isPaused ? "paused" : "running"
          }}
        >
          {[...boxItems, ...boxItems].map((item, index) => (
            <div 
              key={index} 
              className="box" 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track {
          display: flex;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          margin-top : 25px ;
        }

        .carousel-track-inner {
          display: flex;
          width: max-content;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee-left {
          animation-name: looping-scroll-left;
        }

        .marquee-right {
          animation-name: looping-scroll-right;
        }

        .box {
          flex: 0 0 auto;
          padding: 22px 40px;
          margin: 8px;
          background: #3D358A;
          color: white;
          font-size: 16px;
          border-radius: 12px;
          text-align: center;
          white-space: nowrap;
          cursor: pointer; /* Makes cursor pointer on hover */
        }

        .box:hover {
          background : #283574;
          transition : 0.08s ;
        }

        @keyframes looping-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes looping-scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default BoxGrid1;