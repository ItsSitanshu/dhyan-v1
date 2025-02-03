import React from "react";

const App = () => {
  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center p-6">
        <div className="flex items-center">
          <img alt="logo" className="h-10" src="/logo.svg" />
          <span className="ml-2 text-xl font-semibold">DhyanAI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          {["lorem", "lorem", "lorem", "lorem"].map((item, index) => (
            <a key={index} className="hover:underline" href="#">
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center text-center px-4">
        <p className="text-gray-400 mt-12">Lorem, ipsum dolor.</p>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">Lorem, ipsum.</h1>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold">
            Lorem, ipsum.
          </button>
          <a className="text-gray-400 hover:underline" href="#">
            Lorem, ipsum dolor.
          </a>
          <a className="text-gray-400 hover:underline" href="#">
            Lorem, ipsum dolor.
          </a>
        </div>

        {/* Text Section */}
        <div className="max-w-2xl mt-12 text-gray-400 space-y-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            odit mollitia eum vel ducimus ea tempora doloremque fuga repellendus
            accusamus maxime.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            laborum, dolores eum aut perspiciatis quaerat sunt!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <a className="underline" href="#">
              {" "}
              dhyanai.com
            </a>
            .
          </p>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold mt-16">lorem</h2>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {[
            "Lorem, ipsum.",
            "Lorem, ipsum.",
            "Lorem, ipsum dolor.",
            "Lorem, ipsum.",
          ].map((text, index) => (
            <button
              key={index}
              className="bg-gray-800 text-white px-4 py-2 rounded-full"
            >
              {text}
            </button>
          ))}
        </div>
      </main>

      {/* Code Block Section */}
      <div className="bg-black text-white font-sans p-6 mt-12 w-full max-w-4xl">
        {/* User Message */}
        <div className="mb-4">
          <p className="text-lg font-semibold">User</p>
          <p className="text-gray-400">
            This code is not working like I expect — how do I fix it?
          </p>
        </div>

        {/* Code Block */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <pre className="text-gray-300 overflow-x-auto">
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
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-lg font-semibold">DhyanAI</p>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              sit ipsum facilis impedit fuga corrupti debitis modi.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">User</p>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
              alias?
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">DhyanAI</p>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              <code className="bg-gray-700 p-1 rounded mx-1">lorem</code>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              <code className="bg-gray-700 p-1 rounded mx-1">lorem2</code>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
