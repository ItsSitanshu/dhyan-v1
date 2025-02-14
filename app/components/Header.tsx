"use client";

import React from "react";
import SloganRotator from "./SloganRotator";

const HeaderHero = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <header className="w-full max-w-5xl flex justify-between items-center px-6 py-4 ">
        <div className="flex items-center space-x-3">
          <img alt="logo" className="h-16" src="/logo.svg" />
          <span className="text-4xl mt-1.5 font-semibold font-nue text-white">
            Dhyan.AI
          </span>
        </div>
        <a href="auth/login">
          <button className="bg-bgsec border text-background px-6 py-2 rounded-full font-semibold hover:bg-opacity-80 hover:scale-105 transition-transform duration-200">
            Get Started
          </button>
        </a>
      </header>
      <SloganRotator/>
    </div>
  );
};

export default HeaderHero;
