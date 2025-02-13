import React from "react";

const FeatureSection = () => {
  return (
    <div className="flex flex-wrap justify-center mt-8 gap-4">
      {["Smart Notes", "Exam Prep", "AI Tutor", "Interactive Quizzes"].map(
        (text, index) => (
          <button
            key={index}
            className="bg-bgsec border text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200"
          >
            {text}
          </button>
        )
      )}
    </div>
  );
};

export default FeatureSection;
