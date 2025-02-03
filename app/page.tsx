"use client";

import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect, useRef } from "react";

import logo from "@/app/assets/images/logo.svg";
import brainLogo from "@/app/assets/images/icons/brain.svg";
import notepadLogo from "@/app/assets/images/icons/notepad.svg";
import questionLogo from "@/app/assets/images/icons/question.svg";
import tipLogo from "@/app/assets/images/icons/tip.svg";
import arrowLogo from "@/app/assets/images/icons/arrow.svg";

import { rawLLM } from "@/app/lib";

import SloganRotator from "@/app/components/SloganRotator";

type ButtonData = {
  [key: string]: {
    label: string;
    icon: string | any;
  };
};

type Chat = {
  isUser: boolean;
  message: string;
}

const buttonData: ButtonData = {
  explain_concept: {
    label: "Explain",
    icon: brainLogo,
  },
  summarize_notes: {
    label: "Summarize",
    icon: notepadLogo,
  },
  ask_question: {
    label: "Ask a question",
    icon: questionLogo,
  },
  study_tip: {
    label: "Study Tip",
    icon: tipLogo,
  }
};

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [responses, setResponses] = useState<Chat[]>([]);

  const [chatView, setChatView] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);  // ref for scrolling

  const handleResponse = async () => {
    if (!message.trim()) return;

    const newResponses = [...responses, { isUser: true, message }];

    setResponses(newResponses);

    setMessage("");
    if (!chatView) setChatView(true);

    try {
      const response = await rawLLM(message);
      if (response.code === 200) {
        setResponses([...newResponses, { isUser: false, message: response.response }]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responses]);

  return (
    <div className="h-screen flex">
      <div className="w-64 bg-bgsec text-lsec p-4 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <div className="flex flex-row items-center gap-3">
              <h2 className="text-3xl mt-1 font-nue">Dhyan.AI</h2>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-4">
            <button className="bg-background py-2 px-4 rounded-full w-full">
              Upgrade plan
            </button>
          </div>
        </div>
      </div>

      {!chatView ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <SloganRotator />
          <div
            className="bg-bgsec rounded-xl w-3/4 h-auto max-h-96 max-w-4xl mb-6 relative"
          >
            <textarea
              className="bg-bgsec h-full w-full p-4 text-foreground focus:outline-none overflow-y-auto rounded-xl resize-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              className="absolute bottom-0 right-0 w-10 h-10 bg-background rounded-full m-2 hover:cursor-pointer hover:bg-white/20"
              onClick={handleResponse}
            >
              <Image
                src={arrowLogo}
                alt="->"
                width={256}
                height={256}
                className="p-1"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            {Object.keys(buttonData).map((key) => (
              <button
                key={key}
                className="bg-bgsec border-[0.2px] border-white/20 hover:bg-white/20 py-2 px-3 rounded-full font-normal flex items-center"
              >
                {buttonData[key].icon && (
                  <Image
                    src={buttonData[key].icon}
                    alt={buttonData[key].label}
                    width={256}
                    height={256}
                    className="w-5 h-5 mr-2"
                  />
                )}
                <h1 className="font-normal text-sm">{buttonData[key].label}</h1>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative">

          <div className="flex flex-col overflow-y-auto w-1/2 p-4 h-full">
            {responses.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    chat.isUser ? "bg-white/30 text-white" : "text-white"
                  } px-2 py-1.5 rounded-md`}
                >
                  <ReactMarkdown>{chat.message}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <div
              className="bg-bgsec rounded-xl w-3/4 h-auto max-h-96 max-w-4xl mb-6 relative"
            >
              <textarea
                className="bg-bgsec h-full w-full p-4 text-foreground focus:outline-none overflow-y-auto rounded-xl resize-none"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div
                className="absolute bottom-0 right-0 w-10 h-10 bg-background rounded-full m-2 hover:cursor-pointer hover:bg-white/20"
                onClick={handleResponse}
              >
                <Image
                  src={arrowLogo}
                  alt="->"
                  width={256}
                  height={256}
                  className="p-1"
                />
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
