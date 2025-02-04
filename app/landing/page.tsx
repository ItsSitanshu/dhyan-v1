import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  
  const items = [
    "Write a message that goes with a kitten gif for a friend on a rough day ↗",
    "Test my knowledge on ancient civilizations ↗",
    "Write a text asking a friend to be my plus-one at a wedding ↗",
    "Improve my essay writing ask me to outline my thoughts ↗",
    "Tell me a fun fact about the Roman Empire ↗",
    "Create a personal webpage for me after asking me three questions ↗",
    "Create a morning routine to boost my productivity ↗",
    "Plan a 'mental health day' to help me relax ↗",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground font-jksans min-h-screen">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <img alt="DhyanAI Logo" className="h-10" src="/logo.svg" />
          <span className="ml-2 text-xl font-semibold">DhyanAI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          {["Home", "Features", "Pricing", "Contact"].map((item, index) => (
            <a key={index} className="hover:underline" href="#">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div className="flex flex-col items-center text-center px-4">
        <p className="text-psec mt-12">Empowering AI-driven solutions</p>
        <h1 className="text-4xl md:text-6xl font-bold mt-4 font-nue">
          Revolutionizing AI Assisted Learning
        </h1>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button className="bg-prim1 text-foreground px-6 py-2 rounded-full font-semibold">
            Get Started
          </button>
          <button className="bg-prim1 text-foreground px-6 py-2 rounded-full font-semibold">
            Get Started
          </button>
        </div>

        <div className="bg-black text-white w-full py-10">
          <div className="container mx-auto px-4">
            <Slider {...settings}>
              {items.map((item, index) => (
                <div key={index} className="p-4">
                  <div 
                    className="bg-gray-800 p-4 rounded-lg cursor-pointer text-center"
                    // href={() => (`/q?=${encodeURIComponent(item)}`)}
                  >
                    <p className="text-white">{item}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
