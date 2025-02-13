import React from "react";

const Header = () => {
  return (
    <header className="w-full max-w-5xl flex justify-between items-center p-6">
      <div className="flex items-center">
        <img alt="logo" className="h-10" src="/logo.svg" />
        <span className="ml-2 mt-1 text-3xl font-semibold font-nue text-white">
          Dhyan.AI
        </span>
      </div>
      <nav className="hidden md:flex space-x-6">
        {["Home", "Features", "About", "Contact"].map((item, index) => (
          <a
            key={index}
            href="#"
            className="relative text-white after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-0 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full"
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
