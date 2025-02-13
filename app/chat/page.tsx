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
import documentLogo from "@/app/assets/icons/document.svg";
import hintLogo from "@/app/assets/icons/bulb.svg";

import { APITitle, APITutor, getTokenCount, trimToMaxTokens, getSimulationTitle } from "@/app/lib";

import SloganRotator from "@/app/components/SloganRotator";
import NotSignedPopup from "@/app/components/NotSignedPopup";
import InitialForm from "@/app/components/InitialForm";
import LoadingScreen from "@/app/components/LoadingScreen";
import Orbitals from "@/app/simulations/Orbitals";  // Import Orbitals component
import Sidebar from "@/app/components/Sidebar";
import TT from "@/app/components/ToolTip";

import { useRouter } from "next/navigation";

type Chat = {
  isUser: boolean;
  message: string;
  timestamp: number;
  data?: any;
};

const MAX_TOKENS = 500_000;

const supabase = createClientComponentClient();

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [responses, setResponses] = useState<Chat[]>([]);
  const [chats, setChats] = useState<any>([]);
  const [chatView, setChatView] = useState<boolean>(false);
  const [isChatCreated, setIsChatCreated] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");

  const [showSimulation, setShowSimulation] = useState(false); 
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const createChat = async (userId: string) => {
    const { data: existingChat, error: fetchError } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing chat:", fetchError);
      return null;
    }

    const { data, error } = await supabase
      .from("chats")
      .insert([{ user_id: userId, msgs: responses }])
      .select("*")
      .single();
    

    if (!error) {
      setChatId(data?.id);
      return data;
    }

    console.error("Error creating chat:", error);
    return null;
  };

  const addChatToUser = async (userId: string, chatId: string) => {
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("chats")
      .eq("id", userId)
      .single();
  
    if (fetchError) {
      console.error("Error fetching user chats:", fetchError);
      return null;
    }
    
    await updateChat(chatId);

    const updatedChats = Array.isArray(userData.chats) ? [...userData.chats, chatId] : [chatId];
    
    const { data, error } = await supabase
      .from("users")
      .update({ chats: updatedChats })
      .eq("id", userId)
      .select()
      .single();
  
    if (error) {
      console.error("Error updating user chats:", error);
      return null;
    }
  
    router.replace(`/chat/${chatId}`, undefined);
  
    return data;
  };
  
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
    if (isTyping) return;

    const timestamp = Date.now();
    const newResponses = [...responses, { isUser: true, message, timestamp }];
    setResponses(newResponses);
    setIsTyping(true);
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
          setResponses([
            ...newResponses,
            { isUser: false, message: response.response, timestamp: Date.now(), data: specialAction.data },
          ]);
        } else if (specialAction.id === 0) {
          setResponses([
            ...newResponses,
            { isUser: false, message: response.response, timestamp: Date.now(), data: specialAction.data },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsTyping(false);
    }
  }; 


  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    setMessage("");
    setResponses([]);
    setChatView(false);
    setIsChatCreated(false);

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    if (responses.length > 0 && !isChatCreated && user) {
      setIsChatCreated(true);
      createChat(user.id);
    }

    console.log("responses", responses);

  }, [responses]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
  
      try {
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .eq("user_id", user.id)

        
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching chats:", error);
          return;
        }
  
        if (data) {
          setChats(data.flatMap(chat => chat.msgs));
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
  
    fetchChats();

  }, [user]);

  useEffect(() => {
    if (!isChatCreated || chatId == "" || responses.length < 2) return;
    
    addChatToUser(user.id, chatId);
  }, [isChatCreated])

  const handleSimulationClick = () => {
    setShowSimulation(true); 
  };

  return (
    !(user && dbUser) ? <LoadingScreen/> :
    user ? (
      dbUser ? (
        <div className="h-screen bg-lprim flex items-center p-4">
          <Sidebar currentPage="chat"/>
            <div                  
            className="flex bg-opacity-25 w-[82%] h-[94%] rounded-[3rem] bg-bgsec flex-col items-center justify-center relative">
              { showSimulation ? (
                <Orbitals /> 
              ) : (
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
                            boreder text-background hover:bg-background hover:text-foreground hover:cursor-pointer transition-all duration-500 h-8 p-3 py-4 rounded-2xl"
                            onClick={handleSimulationClick}  
                          >
                            Launch a simulation: {getSimulationTitle(chat.data)}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
              <div
                className="flex flex-row items-center justify-center space-x-4 rounded-xl w-3/4 h-12  relative"
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
                  <TT text="Select documents to reference"><div
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
                  </div></TT>
                <div
                  className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
                    transition-all hover:scale-105 duration-300 hover:cursor-pointer"
                  onClick={handleResponse}
                >
                  <Image
                    src={arrowLogo}
                    aria-disabled={isTyping}
                    alt="->"
                    width={256}
                    height={256}
                    className={`p-1.5 w-10 h-10 ${isTyping && 'cursor-not-allowed'}`}
                  />
                </div>
                </div>
              </div>
            </div>
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
