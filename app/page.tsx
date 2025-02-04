"use client";

import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect, useRef } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import brainLogo from "@/app/assets/icons/brain.svg";
import notepadLogo from "@/app/assets/icons/notepad.svg";
import questionLogo from "@/app/assets/icons/question.svg";
import tipLogo from "@/app/assets/icons/tip.svg";
import arrowLogo from "@/app/assets/icons/arrow.svg";

import { rawLLM, getTokenCount, trimToMaxTokens } from "@/app/lib";

import SloganRotator from "@/app/components/SloganRotator";
import NotSignedPopup from "@/app/components/NotSignedPopup";

type ButtonData = {
  [key: string]: {
    label: string;
    icon: string | any;
  };
};

type Chat = {
  isUser: boolean;
  message: string;
  timestamp: number;
};

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

const MAX_TOKENS = 500_000; 

const supabase = createClientComponentClient();

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [responses, setResponses] = useState<Chat[]>([]);
  const [chatView, setChatView] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null); 

  const handleResponse = async () => {
    if (!message.trim()) return;

    const timestamp = Date.now();
    const newResponses = [...responses, { isUser: true, message, timestamp }];
    setResponses(newResponses);
    setMessage("");
    if (!chatView) setChatView(true);

    try {
      let conversationContext = newResponses.map((chat) => {
        return `${chat.isUser ? 'User' : 'Assistant'}: ${chat.message}\n`;
      }).join('\n');

      console.log(conversationContext)

      const tokenCount = getTokenCount(conversationContext);

      if (tokenCount > MAX_TOKENS) {
        conversationContext = trimToMaxTokens(conversationContext, MAX_TOKENS);
      }

      const response = await rawLLM(message, conversationContext);

      if (response.code === 200) {
        setResponses([...newResponses, { isUser: false, message: response.response, timestamp: Date.now() }]);
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

  const [user, setUser] = useState<any>();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    !user ?
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
        <div 
          className="flex-1 flex flex-col items-center justify-center relative "
        >
          <div 
            className="flex flex-col w-1/2 p-4 h-5/6 overflow-y-auto"
            ref={chatContainerRef}  
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none', 
            }}
          >
            {responses.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    chat.isUser ? "bg-white/30 text-white" : "text-white"
                  } px-2 py-1.5 rounded-md my-2`}
                >
                  {chat.message}
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
    : <NotSignedPopup/>
  );
};

export default App;
