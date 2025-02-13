"use client";

import React from "react";

const HeaderHero = () => {
  return (
    <div>
      <header className="w-full max-w-5xl flex justify-center items-center p-4 border-b-2">
        <div className="flex items-center space-x-2">
          <img alt="logo" className="h-10" src="/logo.svg" />
          <span className="text-3xl font-semibold font-nue text-white">
            Dhyan.AI
          </span>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <a href="auth/login">
            <button className="bg-bgsec border text-background px-6 py-2 rounded-full font-semibold hover:bg-opacity-80 hover:scale-105 transition-transform duration-200">
              Get Started
            </button>
          </a>
        </div>
      </main>
    </div>
  );
};

export default HeaderHero;
