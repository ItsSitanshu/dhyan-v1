import React from "react";

const App = () => {
  return (
    <div className="bg-black text-white font-sans">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <img alt="" className="h-10" src="/logo.svg" />
          <span className="ml-2 text-xl font-semibold">DhyanAI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a className="hover:underline" href="#">
            lorem
          </a>
          <a className="hover:underline" href="#">
            lorem
          </a>
          <a className="hover:underline" href="#">
            lorem
          </a>
          <a className="hover:underline" href="#">
            lorem
          </a>
        </nav>
        <div className="hidden md:block"></div>
      </header>
      <main className="flex flex-col items-center text-center px-4 md:px-0">
        <p className="text-gray-400 mt-12">Lorem, ipsum dolor.</p>
        <h1 className="text-4xl md:text-6xl font-bold mt-4">Lorem, ipsum.</h1>
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
        <div className="max-w-2xl mt-12 text-gray-400">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            odit mollitia eum vel ducimus ea tempora doloremque fuga repellendus
            accusamus maxime voluptatum, sapiente earum excepturi suscipit ex
            distinctio harum nemo laudantium. Natus officiis a maxime quia, odit
            excepturi repellat tenetur.
          </p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
            laborum, dolores eum aut perspiciatis quaerat sunt! Molestias
            dolores, molestiae et, eveniet sit, corrupti laborum veniam culpa
            temporibus cumque quis numquam!
          </p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur
            libero et quo ea quaerat eius odit provident. Laudantium inventore
            sunt quas consequuntur tenetur. Odit corporis voluptatem debitis
            iusto reiciendis eveniet.
            <a className="underline" href="">
              {" "}
              dhyanai.com
            </a>
            .
          </p>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-16">lorem</h2>
        <div className="flex flex-wrap justify-center mt-8 space-x-4 space-y-4 md:space-y-0">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
            Lorem, ipsum.
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
            Lorem, ipsum.
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
            Lorem, ipsum dolor.
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
            Lorem, ipsum.
          </button>
        </div>
      </main>
      <div className="bg-gray-900 text-white font-sans p-6 rounded-lg shadow-lg mt-12">
        <div className="mb-4">
          <p className="text-lg font-semibold">User</p>
          <p className="text-gray-400">
            this code is not working like i expect — how do i fix it?
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <pre className="text-gray-300">
            <code>
              {`#include <stdio.h>

int main() {
    int numbers[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    for (int i = 0; i < 10; i++) {
        printf("Element %d: %d\n", i, numbers[i]);
    }

    return 0;
}
`}
            </code>
          </pre>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">DhyanAI</p>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi,
            officia nihil. Assumenda sit ipsum facilis impedit fuga corrupti
            debitis modi, dolores minima vitae accusamus repellat possimus id,
            quod asperiores suscipit!
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">User</p>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            alias?
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold">DhanAI</p>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
            impedit dolorum eaque dignissimos. Sunt nihil earum iure non ipsa,
            aliquam atque saepe harum repellendus vero incidunt molestias,
            asperiores at rem.
            <code className="bg-gray-600 p-1 rounded">lorem</code> Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Porro, officiis!
            <code className="bg-gray-600 p-1 rounded">
              Lorem ipsum dolor sit.
            </code>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime hic
            sint quasi at earum. Autem animi eveniet doloremque et? Ea.
            <code className="bg-gray-600 p-1 rounded">lorem2</code>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo,
            porro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
