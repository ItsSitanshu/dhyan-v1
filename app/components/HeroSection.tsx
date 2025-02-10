"use client";

import React from "react";
import SloganRotator from "./SloganRotator";

const HeroSection = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4">

      <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
        <button className="bg-prim2 text-background px-6 py-2 rounded-full font-semibold hover:bg-opacity-80 transition">
          Get Started
        </button>
        <a
          className="relative text-psec after:block after:content-[''] after:absolute after:h-[2px] after:bg-psec after:w-0 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full"
          href="#"
        >
          Learn More
        </a>
      </div>
    </main>
  );
};

export default HeroSection;
