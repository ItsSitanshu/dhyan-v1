import React from "react";

const BoxGrid = () => {
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

  return (
    <div className="w-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 px-4">
      {boxItems.map((item, index) => (
        <div
          key={index}
          className="bg-prim1 p-4 rounded-lg text-center h-24 flex items-center justify-center hover:bg-opacity-80 transition"
        >
          <a href="#" className="block text-foreground">
            {item}
          </a>
        </div>
      ))}
    </div>
  );
};

export default BoxGrid;
