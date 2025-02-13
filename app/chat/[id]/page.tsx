"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { APITutor, APITitle, getTokenCount, trimToMaxTokens, getSimulationTitle } from "@/app/lib";

import arrowLogo from "@/app/assets/icons/arrow.svg";
import documentLogo from "@/app/assets/icons/document.svg";

import SloganRotator from "@/app/components/SloganRotator";
import NotSignedPopup from "@/app/components/NotSignedPopup";
import InitialForm from "@/app/components/InitialForm";
import LoadingScreen from "@/app/components/LoadingScreen";
import Sidebar from "@/app/components/Sidebar";
import TT from "@/app/components/ToolTip";

import Orbitals from "@/app/simulations/Orbitals";
import FrictionSimulation from "@/app/simulations/Friction";
import NewtonSecondLaw from "@/app/simulations/NewtonSecondLaw";
import ProjectileSimulation from "@/app/simulations/ProjectileMotion";


import { useParams, useRouter } from "next/navigation";

type Chat = {
  isUser: boolean;
  message: string;
  timestamp: number;
  data?: any;
};

const simulationComponents: Record<string, React.FC> = {
  newtons_laws_simulation: NewtonSecondLaw,
  projectile_motion_simulation: ProjectileSimulation,
  friction_simulation: FrictionSimulation,
  electric_circuit_simulation: FrictionSimulation,
  gravity_orbit_simulation: Orbitals,
  fluid_dynamics_simulation: FrictionSimulation,
  wave_interference_simulation: FrictionSimulation,
  chemical_reactions_lab: FrictionSimulation,
  dna_replication_visualizer: FrictionSimulation,
};

const MAX_TOKENS = 500_000;
const supabase = createClientComponentClient();

const Chat = () => {
  const { id: autoChatId } = useParams();
  const [message, setMessage] = useState<string>("");
  const [responses, setResponses] = useState<Chat[]>([]);
  const [chatView, setChatView] = useState<boolean>(false);
  const [isChatCreated, setIsChatCreated] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>(autoChatId as string);
  const [pendingSAct, setPendingSAct] = useState<number>(0);
  const [sActData, setSActData] = useState<any>(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationId, setSimulationId] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const smallMsgRef = useRef<any>(null);
  const router = useRouter();

  const generateTitle = async (chatId: string) => {
    if (responses.length != 6) return;

    let conversationContext = responses.map((chat) => {
      return `${chat.isUser ? 'User' : 'Assistant'}: ${chat.message}\n`;
    }).join('\n');

    const tokenCount = getTokenCount(conversationContext);

    if (tokenCount > MAX_TOKENS) {
      conversationContext = trimToMaxTokens(conversationContext, MAX_TOKENS);
    }

    const request = await APITitle(conversationContext);

    if (request.code != 200) return;

    const { error: updateError } = await supabase
      .from('chats')
      .update({ title: request.response })
      .eq('id', chatId);

    if (updateError) {
      console.error('Error updating title:', updateError);
    }
  };

  const updateChat = async (chatId: string) => {
    const { data: chat, error: fetchError } = await supabase
      .from("chats")
      .select("msgs")
      .eq("id", chatId)
      .single();
  
    if (fetchError) {
      console.error("Error fetching chat:", fetchError);
      return null;
    }
    
    const { data, error } = await supabase
      .from("chats")
      .update({ msgs: responses })
      .eq("id", chatId)
      .select()
      .single();
  
    if (error) {
      console.error("Error updating chat:", error);
      return null;
    }
    
    await generateTitle(chatId);

    return data;
  };

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

      const response = await APITutor({}, message, conversationContext);

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
            { isUser: false, message: response.response, timestamp: Date.now(), data: specialAction.data },
          ]);
        } else if (specialAction.id === 0) {
          setPendingSAct(2);
          setSActData(specialAction.data);
          setResponses([
            ...newResponses,
            { isUser: false, message: response.response, timestamp: Date.now(), data: specialAction.data },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (responses.length === 0 && dbUser.id === user.id) {
          const { data, error } = await supabase
            .from("chats")
            .select("*")
            .eq("id", chatId)
            .single();

          if (!error) {
            setResponses(data.msgs);
          } else {
            router.push('/chat/');
          }
        }
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };

    if (dbUser && user) fetchContent();
  }, [dbUser, user]);

  useEffect(() => {
    if (responses.length >= 2) updateChat(chatId);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responses]);

  const handleSimulationClick = (simId: string) => {
    setSimulationId(simId);
    setShowSimulation(true);
  };

  const SimulationComponent = simulationId ? simulationComponents[simulationId] : null;

  return (
    !(user && dbUser) ? <LoadingScreen/> :
    user ? (
      dbUser ? (
        <div className="h-screen bg-lprim flex flex-row gap-2 items-center p-4 overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {!showSimulation ? <Sidebar currentPage="chat" /> : (
            <>
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col w-[30%] h-full p-9 overflow-y-auto"
                ref={chatContainerRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <Image
                  className="absolute border-background rounded-xl w-12 hover:scale-110
                   z-50 h-12 top-24 right-10 transition-all duration-300 hover:cursor-pointer"
                  src={'/logo.svg'}
                  width={256}
                  height={256}
                  alt='x'
                  onClick={() => setShowSimulation(false)}
                />
                <div className="mb-6 absolute z-[100]">
                  <div className="flex flex-row items-center gap-3 bg-lprim p-2 rounded-xl">
                    <Image
                      alt="profile"
                      width={512}
                      height={512}
                      src="/logo.svg"
                      className="w-12 h-12"
                    />
                    <h2 className="text-3xl mt-1 font-nue text-background">Dhyan.AI</h2>
                  </div>
                </div>
                <div className="flex flex-col h-full justify-start">
                {responses.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex  ${chat?.data && 'flex-col'} ${chat.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative px-3 py-3 font-normal rounded-2xl my-2 max-w-[85%] ${!chat.isUser ? 'bg-foreground' : ''} bg-opacity-20 z-50`}
                    >
                      {chat.isUser && (
                        <div className="absolute z-[-1] inset-0 rounded-2xl opacity-10" style={{ background: 'linear-gradient(180deg, var(--prim1) 0%, var(--sec1) 30%, var(--prim2) 100%, var(--sec2) 200%)' }}></div>
                      )}
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold" {...props} />,
                          p: ({ node, ...props }) => <p className="leading-relaxed text-background" {...props} />,
                          a: ({ node, ...props }) => <a className="text-blue-600" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2" {...props} />,
                          li: ({ node, ...props }) => <li className="text-background" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600" {...props} />,
                        }}
                      >
                        {chat.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                </div>
                <div
                  className="flex flex-row items-center justify-center space-x-4 rounded-xl w-full h-12 relative"
                >
                  <textarea
                    className="bg-foreground h-12 w-full p-3 pl-7 text-background focus:outline-none overflow-y-auto rounded-xl resize-none"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleResponse();
                      }
                    }}
                  />
                  <div className="flex flex-row space-x-2">
                    <TT text="Select documents to reference">
                      <div
                        className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
                        transition-all hover:scale-105 duration-300 hover:cursor-pointer"
                        onClick={handleResponse}
                      >
                        <Image
                          src={documentLogo}
                          alt="+"
                          width={256}
                          height={256}
                          className="p-1.5 w-10 h-10"
                        />
                      </div>
                    </TT>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
                      transition-all hover:scale-105 duration-300 hover:cursor-pointer"
                      onClick={handleResponse}
                    >
                      <Image
                        src={arrowLogo}
                        alt="->"
                        width={256}
                        height={256}
                        className="p-1.5 w-10 h-10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          <AnimatePresence>
            {showSimulation && SimulationComponent && (
              <SimulationComponent />
            )}
            {!showSimulation && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex w-[82%] h-[94%] rounded-[3rem] bg-bgsec flex-col items-center justify-center relative"
              >
                <div
                  className="flex flex-col w-4/6 p-9 h-5/6 overflow-y-auto"
                  ref={chatContainerRef}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {responses.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat?.data && 'flex-col'} ${chat.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative px-3 py-3 font-normal rounded-2xl my-2 max-w-[85%] ${!chat.isUser ? 'bg-foreground' : ''} bg-opacity-20 z-50`}
                      >
                        {chat.isUser && (
                          <div className="absolute z-[-1] inset-0 rounded-2xl opacity-10" style={{ background: 'linear-gradient(180deg, var(--prim1) 0%, var(--sec1) 30%, var(--prim2) 100%, var(--sec2) 200%)' }}></div>
                        )}
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-relaxed text-background" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-600" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="text-background" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600" {...props} />,
                          }}
                        >
                          {chat.message}
                        </ReactMarkdown>
                      </div>
                      {!chat.isUser && chat?.data && (
                        <div
                          className="flex w-fit flex-row items-center justify-center border border-foreground
                          boreder text-background hover:bg-foreground hover:font-bold hover:cursor-pointer
                          transition-all duration-500 h-8 p-3 py-5 rounded-2xl"
                          onClick={() => handleSimulationClick(chat.data)}
                        >
                          Launch a simulation: {getSimulationTitle(chat.data)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="flex flex-row items-center justify-center space-x-4 rounded-xl w-3/4 h-12 relative"
                >
                  <textarea
                    className="bg-foreground h-12 w-3/4 p-3 pl-7 text-background focus:outline-none overflow-y-auto rounded-xl resize-none"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleResponse();
                      }
                    }}
                  />
                  <div className="flex flex-row space-x-2">
                    <TT text="Select documents to reference">
                      <div
                        className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
                        transition-all hover:scale-105 duration-300 hover:cursor-pointer"
                        onClick={handleResponse}
                      >
                        <Image
                          src={documentLogo}
                          alt="+"
                          width={256}
                          height={256}
                          className="p-1.5 w-10 h-10"
                        />
                      </div>
                    </TT>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
                      transition-all hover:scale-105 duration-300 hover:cursor-pointer"
                      onClick={handleResponse}
                    >
                      <Image
                        src={arrowLogo}
                        alt="->"
                        width={256}
                        height={256}
                        className="p-1.5 w-10 h-10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <InitialForm user={user} />
      )
    ) : (
      <NotSignedPopup />
    )
  );
};

export default Chat;
