import React from "react";

const LandingPage = () => {
  const boxItems = [
    "Write a message that goes with a kitten gif for a friend on a rough day ↗",
    "Test my knowledge on ancient civilizations ↗",
    "Write a text asking a friend to be my plus-one at a wedding ↗",
    "Improve my essay writing ask me to outline my thoughts ↗",
    "Create a personal webpage for me after asking me three questions ↗",
    "Create a morning routine to boost my productivity ↗",
    "Plan a 'mental health day' to help me relax ↗",
    "Give me ideas about how to plan my New Year's resolutions ↗",
    "Help me pick an outfit that will look good on camera ↗",
  ];

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center p-6">
        <div className="flex items-center">
          <img alt="logo" className="h-10" src="/logo.svg" />
          <span className="ml-2 text-xl font-semibold">DhyanAI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          {["Home", "Features", "About", "Contact"].map((item, index) => (
            <a key={index} className="hover:underline" href="#">
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400 mt-12">
          Your AI-powered learning assistant
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          Unlock Your Potential
        </h1>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button className="bg-foreground text-background px-6 py-2 rounded-full font-semibold">
            Get Started
          </button>
          <a className="text-gray-400 hover:underline" href="#">
            Learn More
          </a>
        </div>

        {/* Text Section */}
        <div className="max-w-2xl mt-12 text-gray-400 space-y-4">
          <p>
            DhyanAI helps students prepare for board exams by enhancing notes,
            providing alternative study methods, and making learning
            interactive.
          </p>
          <p>
            Whether you need help organizing your study materials, revising key
            concepts, or generating practice questions, DhyanAI is here to
            assist.
          </p>
          <p>
            Visit{" "}
            <a className="underline" href="#">
              dhyanai.com
            </a>{" "}
            to explore more.
          </p>
        </div>

        {/* Feature Section */}
        <h2 className="text-2xl md:text-3xl font-bold mt-16">
          Explore Features
        </h2>
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {["Smart Notes", "Exam Prep", "AI Tutor", "Interactive Quizzes"].map(
            (text, index) => (
              <button
                key={index}
                className="bg-gray-800 text-foreground px-4 py-2 rounded-full"
              >
                {text}
              </button>
            )
          )}
        </div>
      </main>

      {/* Code Example Section */}
      <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
        {/* User Question */}
        <div>
          <p className="text-lg font-semibold">User</p>
          <p className="text-gray-400">
            This code is not working like I expect — how do I fix it?
          </p>
        </div>

        {/* Code Block */}
        <div className="w-full bg-gray-900 p-6 rounded-lg text-foreground text-sm overflow-x-auto">
          <pre>
            <code>
              {`#include <stdio.h>

int main() {
    int numbers[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    for (int i = 0; i < 10; i++) {
        printf("Element %d: %d\\n", i, numbers[i]);
    }

    return 0;
}`}
            </code>
          </pre>
        </div>

        {/* Chat Responses */}
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">DhyanAI</p>
            <p className="text-gray-400">
              It looks like your code is correctly printing the array elements.
              Is there a specific issue you're facing?
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">User</p>
            <p className="text-gray-400">
              I expected a different output format. Can I format the numbers
              differently?
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">DhyanAI</p>
            <p className="text-gray-400">
              Yes! You can modify the{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">printf</code>{" "}
              statement to change the format. For example, use{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">
                "%d - %d\\n"
              </code>{" "}
              instead.
            </p>
          </div>
        </div>
      </div>

      {/* Boxes Section */}
      <div className="w-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-4">
        {boxItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg text-center h-24 flex items-center justify-center"
          >
            <a href="#" className="block text-foreground">
              {item}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
