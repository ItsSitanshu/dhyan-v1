import React from "react";

const FeatureSection = () => {
  return (
    <div className="flex flex-wrap justify-center mt-8 gap-4">
      {["Smart Notes", "Exam Prep", "AI Tutor", "Interactive Quizzes"].map(
        (text, index) => (
          <button
            key={index}
            className="bg-prim1 text-foreground px-4 py-2 rounded-full hover:bg-opacity-80 transition"
          >
            {text}
          </button>
        )
      )}
    </div>
  );
};

export default FeatureSection;
