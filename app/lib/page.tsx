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
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  
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
    if (!file || !fileName) return;
    setUploading(true);

    const { data, error } = await supabase.storage.from("pdfs").upload(`${Date.now()}_${file.name}`, file);
    
    if (error) {
      console.error("Error uploading file:", error);
    } else {
      const fileUrl = `https://your-supabase-bucket-url/${data.path}`;
      await supabase.from("pdfs").insert([{ name: fileName, link: fileUrl }]);
      fetchPdfs();
    }
    
    setUploading(false);
    setFile(null);
    setFileName("");
  };

  return !(user && dbUser) ? (
    <LoadingScreen />
  ) : user ? (
    dbUser ? (
      <div className="h-screen bg-lprim flex flex-row gap-2 items-center p-4 overflow-hidden">
        <Sidebar currentPage={"lib"} />
        <div className="flex bg-opacity-25 w-[82%] h-[94%] rounded-[3rem] bg-bgsec flex-col items-center p-6">
          <h1 className="text-8xl font-bold font-nue text-background">Library</h1>

          <div className="w-full max-w-2xl flex flex-row items-center justify-between space-x-4">
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
                Add Selected to Collection
              </button>
            )}
            <div className="flex flex-col items-center gap-4 mt-4">
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <input type="text" placeholder="Enter PDF Name" value={fileName} onChange={(e) => setFileName(e.target.value)} className="bg-bgsec h-10 text-white rounded-lg pl-3 border focus:border-prim2" />
            <button onClick={handleFileUpload} disabled={uploading} className="bg-prim2 text-white px-4 py-2 rounded hover:bg-lprim transition-all duration-300">
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
          </div>

          

          <div className="h-full overflow-y-auto w-2/3 mt-6" style={{ scrollbarWidth: 'none' }}>
            {pdfs
              .filter((pdf) => pdf.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .filter((pdf) => !dbUser.res?.includes(pdf.id))
              .map((pdf) => (
                <div key={pdf.id} 
                  className={`flex justify-between items-start p-4 border-b ${selectedPdfs.includes(pdf.id) && 'bg-white/20'}`}
                  onClick={() => toggleSelectPdf(pdf.id)}
                >
                  <div>
                    <p className="text-lg font-semibold text-background">{pdf.name}</p>
                    <p className="text-sm text-gray-500">{new Date(pdf.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={pdf.link} target="_blank" rel="noopener noreferrer" className="bg-prim2 text-white px-4 py-2 rounded hover:bg-lprim transition-all duration-300">
                      View
                    </a>
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