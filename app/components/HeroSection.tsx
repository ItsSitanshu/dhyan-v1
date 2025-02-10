"use client";

import React from "react";
import SloganRotator from "./SloganRotator";

const HeroSection = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
        <a href="auth/login">
          <button className="bg-prim2 text-background px-6 py-2 rounded-full font-semibold hover:bg-opacity-80 transition">
            Get Started
          </button>
        </a>
      </div>
    </main>
  );
};

export default HeroSection;
