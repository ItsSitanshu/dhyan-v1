"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useRef } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import brainLogo from "@/app/assets/icons/brain.svg";
import notepadLogo from "@/app/assets/icons/notepad.svg";
import questionLogo from "@/app/assets/icons/question.svg";
import tipLogo from "@/app/assets/icons/tip.svg";
import arrowLogo from "@/app/assets/icons/arrow.svg";

import { tutor, getTokenCount, trimToMaxTokens, getSimulationTitle } from "@/app/lib";

import SloganRotator from "@/app/components/SloganRotator";
import NotSignedPopup from "@/app/components/NotSignedPopup";
import InitialForm from "@/app/components/InitialForm";
import LoadingScreen from "./components/LoadingScreen";
import Orbitals from "@/app/simulations/Orbitals";  // Import Orbitals component

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
  data?: any;
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

  const [pendingSAct, setPendingSAct] = useState<number>(0);
  const [sActData, setSActData] = useState<any>(false);

  const [showSimulation, setShowSimulation] = useState(false); // New state for simulation view
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

      const tokenCount = getTokenCount(conversationContext);

      if (tokenCount > MAX_TOKENS) {
        conversationContext = trimToMaxTokens(conversationContext, MAX_TOKENS);
      }

      const response = await tutor(message, conversationContext);

      if (response.code === 200) {
        setResponses([
          ...newResponses,
          { isUser: false, message: response.response, timestamp: Date.now() },
        ]);

        const cleanedSpecialAction = response.special_action.replace(/json|`|\n/gi, '').trim();

        if (cleanedSpecialAction.toLowerCase().includes("null")) {
          return;
        }

        const fixedJson = cleanedSpecialAction.replace(/'/g, '"');

        let specialAction;
        specialAction = JSON.parse(fixedJson);

        if (specialAction.id === 1) {
          setPendingSAct(1);
          setSActData(specialAction.data);

          setResponses([
            ...newResponses,
            { isUser: false, message: response.response, timestamp: Date.now() },
            { isUser: false, message: "Do you want to understand this concept with an interactive simulation?", timestamp: Date.now(), data: specialAction.data },
          ]);
        } else if (specialAction.id === 0) {
          setPendingSAct(2);
          setSActData(specialAction.data);

          setResponses([
            ...newResponses,
            { isUser: false, message: response.response, timestamp: Date.now() },
            { isUser: false, message: "If you want to, you can try out these flashcards", timestamp: Date.now(), data: specialAction.data },
          ]);
        }
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

  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!error) {
            setDbUser(userData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        fetchUser();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle the simulation button click
  const handleSimulationClick = () => {
    setShowSimulation(true);  // Set simulation view to true
  };

  return (
    user ? (
      dbUser ? (
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
              {showSimulation ? (
                <Orbitals />  // Show Orbitals component when simulation view is enabled
              ) : (
                <div 
                  className="flex flex-col w-1/2 p-4 h-5/6 overflow-y-auto"
                  ref={chatContainerRef}  
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {responses.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat?.data && 'flex-col'} ${chat.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`${
                          chat.isUser ? "bg-bgsec bg-opacity-50 text-white" : "text-white"
                        } px-3 py-1.5 rounded-md my-2`}
                      >
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-relaxed text-foreground" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-600" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600" {...props} />,
                          }}
                        >
                          {chat.message}
                        </ReactMarkdown>
                        {!chat.isUser && chat?.data && (
                          <div
                            className="flex mt-2 flex-row items-center justify-center border border-foreground
                            hover:bg-foreground hover:text-background hover:cursor-pointer transition-all duration-500 w-3/12 h-8 rounded-2xl"
                            onClick={handleSimulationClick}  // Trigger simulation view on click
                          >
                            {getSimulationTitle(chat.data)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
      ) : (
        <InitialForm user={user} />
      )
    ) : (
      <NotSignedPopup />
    )
  );
};

export default App;
