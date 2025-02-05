import React from "react";

const Header = () => {
  return (
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
  );
};

export default Header;
