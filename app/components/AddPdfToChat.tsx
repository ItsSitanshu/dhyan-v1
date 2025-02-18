"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import documentLogo from "@/app/assets/icons/document.svg";
import TT from "@/app/components/ToolTip";
import { fetchChats } from "../lib";

interface AddPdfToChatInterface {
  chatId: string;
  user: any;
  dbUser: any;
  setChats: (chats: any) => void;
}

const AddPdfToChat: React.FC<AddPdfToChatInterface> = ({ chatId, user, dbUser, setChats }) => {
  const supabase = createClientComponentClient();
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [userPdfs, setUserPdfs] = useState<{ id: string; name: string }[]>([]);
  const [chatPdfs, setChatPdfs] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserPdfs = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase.from("users").select("res").eq("id", user.id).single();
      if (error || !data) return;

      const pdfIds = data.res || [];
      if (pdfIds.length === 0) return;

      const { data: pdfNames, error: pdfError } = await supabase
        .from("pdfs")
        .select("id, name")
        .in('id', pdfIds)
      
      if (!pdfError && pdfNames) {
        setUserPdfs(pdfNames);
      }
    };
    fetchUserPdfs();
  }, [user?.id]);

  useEffect(() => {
    if (!chatId) return;
    const fetchChatPdfs = async () => {
      const { data, error } = await supabase.from("chats").select("pdfs").eq("id", chatId).single();
      if (error || !data) return;

      const pdfIds = data.pdfs || [];
      if (pdfIds.length === 0) return;

      const { data: pdfNames, error: pdfError } = await supabase
        .from("pdfs")
        .select("id, name")
        .in("id", pdfIds);

      if (!pdfError && pdfNames) {
        setChatPdfs(pdfNames);
      }
    };
    fetchChatPdfs();
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);


  const handleAddToChat = async () => {
    if (!chatId) return;
  
    const updatedChatPdfs = [...new Set([...chatPdfs.map((p) => p.id), ...selectedPdfs])];
  
    const { error } = await supabase.from("chats").update({ pdfs: updatedChatPdfs }).eq("id", chatId);
  
    if (!error) {
      setChatPdfs((prev) => {
        const updatedPdfs = [...prev, ...userPdfs.filter((pdf) => selectedPdfs.includes(pdf.id))];
  
        const uniquePdfs = Array.from(new Map(updatedPdfs.map((pdf) => [pdf.id, pdf])).values());
  
        return uniquePdfs;
      });
  
      setSelectedPdfs([]);
      setIsModalOpen(false);
      fetchChats(supabase, user, setChats);
    }
  };
  

  return (
    <div className="relative">
      <TT text="Select documents to reference">
        <div
          ref={buttonRef}
          className="flex items-center justify-center w-12 h-12 bg-foreground rounded-xl
          transition-all hover:scale-105 duration-300 hover:cursor-pointer z-50"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <Image src={documentLogo} alt="+" width={256} height={256} className="p-1.5 w-10 h-10" />
        </div>
      </TT>

      {isModalOpen && (
        <div
          ref={popupRef}
          className="absolute border-white/20 bg-foreground text-sm font-semibold  overflow-hidden p-4 rounded-lg shadow-lg w-96 border z-[100]"
          style={{
            bottom: "100%", // Always place above the button
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
          }}
        >
          <h2 className="text-lg text-background font-bold">Select PDFs</h2>
          <ul className="max-h-48 overflow-auto">
            {userPdfs.map((pdf) => (
              <li key={pdf.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPdfs.includes(pdf.id)}
                  onChange={() =>
                    setSelectedPdfs((prev) =>
                      prev.includes(pdf.id) ? prev.filter((p) => p !== pdf.id) : [...prev, pdf.id]
                    )
                  }
                />
                <span className="text-background">{pdf.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end space-x-2 mt-4">
            <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="bg-prim1 text-white px-3 py-1 rounded" onClick={handleAddToChat}>
              Add to Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPdfToChat;
