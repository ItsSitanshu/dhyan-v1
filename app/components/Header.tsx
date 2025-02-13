import React from "react";

const Header = () => {
  return (
    <header className="w-full max-w-5xl flex justify-center items-center p-6 border-b-2">
      <div className="flex items-center space-x-2">
        <img alt="logo" className="h-10" src="/logo.svg" />
        <span className="text-3xl font-semibold font-nue text-white">
          Dhyan.AI
        </span>
      </div>
    </header>
  );
};

export default Header;
