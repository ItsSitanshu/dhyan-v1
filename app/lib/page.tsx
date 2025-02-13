"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import NotSignedPopup from "@/app/components/NotSignedPopup";
import InitialForm from "@/app/components/InitialForm";
import LoadingScreen from "@/app/components/LoadingScreen";

const supabase = createClientComponentClient();

const LibraryPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPdfs, setSelectedPdfs] = useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
          setDbUser(userData);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchUser();
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    const { data, error } = await supabase
      .from("pdfs")
      .select("id, created_at, name, link");
    
    if (error) console.error("Error fetching PDFs:", error);
    else setPdfs(data);
  };

  const toggleSelectPdf = (pdfId: number) => {
    setSelectedPdfs((prevSelected) =>
      prevSelected.includes(pdfId)
        ? prevSelected.filter((id) => id !== pdfId)
        : [...prevSelected, pdfId]
    );
  };

  const handleBulkAddToCollection = async () => {
    if (!user || !dbUser) return;

    const updatedRes = [...new Set([...(dbUser.res || []), ...selectedPdfs])];

    const { error } = await supabase.from("users").update({ res: updatedRes }).eq("id", user.id);

    if (error) {
      console.error("Error updating collection:", error);
    } else {
      setDbUser({ ...dbUser, res: updatedRes });
      setSelectedPdfs([]);
    }
  };

  const handleFileUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const fileName = prompt("Enter PDF Name:");
      if (!fileName) return;
      
      setUploading(true);
      const { data, error } = await supabase.storage.from("books").upload(`${Date.now()}_${file.name}`, file);
      
      if (error) {
        console.log(data);
        console.error("Error uploading file:", error);
      } else {
        const { data: publicUrlData } = supabase.storage.from("books").getPublicUrl(data.path);
        const fileUrl = publicUrlData.publicUrl;
        const { data: insertedPdf } = await supabase.from("pdfs").insert([{ name: fileName, link: fileUrl }]).select("id").single();
        
        if (insertedPdf) {
          const updatedRes = [...new Set([...(dbUser?.res || []), insertedPdf.id])];
          await supabase.from("users").update({ res: updatedRes }).eq("id", user.id);
          setDbUser({ ...dbUser, res: updatedRes });
        }
        
        fetchPdfs();
      }
      
      setUploading(false);
    };
    
    fileInput.click();
  };

  return !(user && dbUser) ? (
    <LoadingScreen />
  ) : user ? (
    dbUser ? (
      <div className="h-screen bg-lprim flex flex-row gap-2 items-center p-4 overflow-hidden">
        <Sidebar currentPage={"lib"} />
        <div className="flex bg-opacity-25 w-[82%] h-[94%] rounded-[3rem] bg-bgsec flex-col items-center p-6">
          <h1 className="text-8xl font-bold font-nue text-background">Library</h1>

          <div className="w-full max-w-2xl h-16 flex items-center justify-between space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search PDFs..."
              className="bg-bgsec h-16 text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none border focus:border-prim2 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {selectedPdfs.length > 0 && (
              <button
                onClick={handleBulkAddToCollection}
                className="bg-prim2 text-white px-4 py-2 rounded hover:bg-lprim transition-all duration-300"
              >
                Add to Collection
              </button>
            )}
              <button onClick={handleFileUpload} disabled={uploading} className="bg-prim2 text-white px-3 py-2 h-16 
              rounded hover:bg-lprim transition-all duration-300">
                {uploading ? "Uploading..." : "Upload "}
              </button>
          </div>
          

          <div className="flex flex-col w-1/2 overflow-y-auto" style={{scrollbarWidth: 'none'}}>
            {pdfs
              .filter((pdf) => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((pdf) => (
                <div key={pdf.id} 
                  onClick={() => toggleSelectPdf(pdf.id)}
                  className={`flex shadow-md flex-row items-center justify-between border-b 
                  ${selectedPdfs.includes(pdf.id) ? "bg-white/30" : "Select"}`}>
                  <div className="flex flex-col p-3">
                    <h2 className="text-lg font-semibold text-background">{pdf.name}</h2>
                    <a href={pdf.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">View PDF</a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    ) : (
      <InitialForm user={user} />
    )
  ) : (
    <NotSignedPopup />
  );
};

export default LibraryPage;
