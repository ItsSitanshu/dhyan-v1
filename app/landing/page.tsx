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
    </div>
  );
};

export default App;
