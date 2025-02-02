"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import logo from "@/app/assets/images/logo.svg";

const buttonData = {
  create_image: {
    label: "Create image",
    icon: "path/to/camera-icon.svg",
  },
  summarize_text: {
    label: "Summarize text",
    icon: "path/to/text-bubble-icon.svg",
  },
  get_advice: {
    label: "Get advice",
    icon: "path/to/lightbulb-icon.svg",
  },
  surprise_me: {
    label: "Surprise me",
    icon: "path/to/dice-icon.svg",
  },
  more: {
    label: "More",
    icon: "",
  },
};


const SloganRotator = () => {
  const slogans = [
    "I will explain without the pop quizzes",
    "I will teach without the boring lectures",
    "I will make learning fun—no chalk dust required",
    "I will answer questions without sighing first",
    "I will repeat myself without getting annoyed",
    "I will simplify topics; no confusing tangents",
    "I will adapt to your pace, unlike your math teacher",
    "I will make tough topics easy; no red pen corrections",
    "I will teach without saying ‘yo ta class 6 ko kura ho!’",
    "I will repeat myself without saying ‘kaan kholera sun!’",
    "I will explain without throwing chalk at you",
    "I will answer questions; no ‘ghar gayera aafai gar!’",
    "I will make learning fun; no duster flying at your head",
    "I will teach without the ‘40 marks internal, ho ni?’ stress",
    "I will simplify things; no unnecessary ghyan like sir ko lecture",
    "I will help you learn; no ‘bujhena vane yo kitaab nalyauna!’",
    "I will guide you; without ‘yo ta testo easy ho!’ frustration",
    "I will make learning fun; no ‘yo exam ma aaudaina, hataideu’ moments",
  ];
  
  
  const [typedSlogan, setTypedSlogan] = useState<string>("");
  const [sloganIndex, setSloganIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const typingSpeed = 100; 
  const deletingSpeed = 50;
  const changingSpeed = 1500;

  useEffect(() => {
    let interval: any = 0;

    const currentSlogan = slogans[sloganIndex];

    if (isDeleting) {
      interval = setInterval(() => {
        setTypedSlogan((prev) => prev.slice(0, -1));
      }, deletingSpeed);

      if (typedSlogan === "") {
        clearInterval(interval);
        setIsDeleting(false);
        setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
      }
    } else {
      if (typedSlogan.length < currentSlogan.length) {
        interval = setInterval(() => {
          setTypedSlogan((prev) => currentSlogan.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        clearInterval(interval);
        setTimeout(() => setIsDeleting(true), changingSpeed);
      }
    }

    return () => clearInterval(interval);
  }, [typedSlogan, isDeleting, sloganIndex, slogans]);

  return (
    <h1 className="text-2xl font-semibold mb-6">I'm Dhyan, {typedSlogan}</h1>
  );
};

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
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <SloganRotator />
          {/* <div className="w-6 h-6 bg-prim2 mr-4"></div>
          <div className="w-6 h-6 bg-prim2 mr-4"></div>
          <div className="w-6 h-6 bg-prim2 mr-4"></div> */}
          <input
            type="text"
            className="bg-search p-4 rounded-xl flex items-center w-3/4 max-w-4xl mb-6 text-foreground focus:outline-none focus:border focus:ring-white "
            placeholder=""
          />
        <div className="flex space-x-4">
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            Create image
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
            Summarize text
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Get advice
          </button>
          <button className="bg-prim2 py-2 px-4 rounded-full flex items-center">
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
