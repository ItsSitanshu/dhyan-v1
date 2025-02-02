"use client";

import Image from "next/image";
import React from "react";

import logo from "@/app/assets/images/logo.svg";

const DhyanUI = () => {
  return (
    <div className="h-screen flex">
      <div className="w-64 bg-search text-lsec p-4 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <div className="flex flex-row items-center gap-3">
              <Image
                src={logo}
                width={256}
                height={256}
                alt="Dhyan.AI"
                className="w-1/3 p-1 aspect-square"
              />
              <h2 className="text-3xl mt-1 font-nue">Dhyan.AI</h2>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-search mr-2"></div>
              <h2 className="text-lg font-semibold">Explore Dhyan</h2>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Today</h3>
            <ul>
              <li className="mb-2">Lorem, ipsum.</li>
              <li className="mb-2">Lorem, ipsum dolor.</li>
              <li className="mb-2">Lorem ipsum dolor sit.</li>
              <li className="mb-2">Lorem, ipsum dolor.</li>
              <li className="mb-2">Lorem ipsum dolor sit.</li>
            </ul>
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-4">
            <button className="bg-prim2 py-2 px-4 rounded-full w-full">
              Upgrade plan
            </button>
            <p className="text-psec mt-2">More access to the best models</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <h1 className="text-2xl font-semibold mb-6">What can I help with?</h1>
        <div className="bg-search p-4 rounded-full flex items-center w-3/4 max-w-xl mb-6">
          {/* Slot for SVG icons */}
          <div className="w-6 h-6 bg-prim2 mr-4"></div>
          <div className="w-6 h-6 bg-prim2 mr-4"></div>
          <div className="w-6 h-6 bg-prim2 mr-4"></div>
          <input
            type="text"
            className="bg-transparent flex-1 outline-none text-foreground"
            placeholder=""
          />
          <div className="w-6 h-6 bg-prim2"></div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            {/* Slot for SVG icons */}
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            Create image
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            {/* Slot for SVG icons */}
            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
            Summarize text
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            {/* Slot for SVG icons */}
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Get advice
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            {/* Slot for SVG icons */}
            <div className="w-4 h-4 bg-teal-500 mr-2"></div>
            Surprise me
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full">More</button>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-prim2 rounded-full h-10 w-10 flex items-center justify-center text-foreground font-semibold">
            PP
          </div>
        </div>
      </div>
    </div>
  );
};

export default DhyanUI;
