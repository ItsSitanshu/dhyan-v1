import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DetailsPopup from "@/app/components/DetailsPopup";

interface SidebarProps {
  currentPage: string;
  chats?: any[];
  editingChatId?: string | null;
  newTitle?: string;
  setEditingChatId?: (id: string) => void;
  setNewTitle?: (title: string) => void;
  deleteChat?: (id: string) => void;
  startEditing?: (chat: any) => void;
  handleRename?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  chats = [],
  editingChatId = null,
  newTitle = "",
  setEditingChatId = () => {},
  setNewTitle = () => {},
  deleteChat = () => {},
  startEditing = () => {},
  handleRename = () => {},
}) => {
  const menuItems = [
    { name: "Chat", key: "chat", icon: "chat" },
    { name: "Laboratory", key: "lab", icon: "beaker" },
    { name: "Library", key: "lib", icon: "notebook" },
    { name: "Performance", key: "statistics", icon: "statistics" },
    { name: "Settings", key: "settings", icon: "settings" },
  ];

  const router = useRouter();

  return (
    <div className="w-2/12 h-[94%] text-lsec p-4 flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <div className="flex flex-row items-center gap-3">
            <Image
              alt="profile"
              width={512}
              height={512}
              src="/logo.svg"
              className="w-12 h-12"
            />
            <h2 className="text-3xl mt-1 font-nue">Dhyan.AI</h2>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <div
                key={item.key}
                className={`flex flex-row items-center gap-3 p-3  rounded-lg cursor-pointer transition-all ${
                  isActive ? "bg-bgsec font-bold" : "hover:bg-foreground font-medium"
                }`}
                onClick={() => router.push('/' + item.key)}
              >
                <Image
                  alt={item.name}
                  width={24}
                  height={24}
                  src={require(`@/app/assets/dashboard/${isActive ? `A_${item.icon}.svg` : `${item.icon}.svg`}`)}
                />
                <span className="text-lg ">{item.name}</span>
              </div>
            );
          })}
        </nav>
        <div className="flex items-center w-full h-full">
          <div className="flex flex-col w-full h-5/6 overflow-y-auto overflow-x-h">
            {chats?.map((chat) => (
              <div
                key={chat?.id}
                className="flex flex-row justify-between items-center pl-2 text-background shadow-lg rounded-lg
                  hover:shadow-xl h-12 transition-all duration-400 ease-in-out hover:bg-white/20 hover:cursor-pointer"
              >
                <div
                  className="flex flex-row justify-between items-center w-full"
                  onClick={() => router.push(`/chat/${chat?.id}`)}
                  onDoubleClick={() => {
                    setEditingChatId(chat?.id || null);
                    setNewTitle(chat?.title || "");
                  }}
                >
                  {editingChatId === chat?.id ? (
                    <input
                      autoFocus
                      type="text"
                      className="w-full text-lg font-semibold text-background bg-transparent cursor-pointer p-1"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRename(chat?.id || "")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(chat?.id || "");
                        if (e.key === "Escape") setEditingChatId("");
                      }}
                    />
                  ) : (
                    <h2
                      className="text-lg "
                      
                    >
                      {chat?.title?.length > 20 ? chat.title.slice(0, 20) + "..." : chat?.title || "Untitled Chat"}
                    </h2>
                  )}
                  <DetailsPopup
                    onEdit={() => startEditing(chat)}
                    onDelete={() => deleteChat(chat?.id || "")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="flex items-center w-full h-full">
          <div className="flex flex-col w-full h-5/6 overflow-y-auto">
            {chats?.map((chat) => (
              <div
                key={chat?.id}
                className="p-4 text-background shadow-lg rounded-lg transition duration-200 hover:shadow-xl"
              >
                <div
                  className="flex justify-between items-center"
                  onDoubleClick={() => {
                    setEditingChatId(chat?.id || null);
                    setNewTitle(chat?.title || "");
                  }}
                >
                  {editingChatId === chat?.id ? (
                    <input
                      autoFocus
                      type="text"
                      className="w-full text-lg font-semibold text-background bg-transparent cursor-pointer focus:outline-none"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRename(chat?.id || "")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(chat?.id || "");
                        if (e.key === "Escape") setEditingChatId(null);
                      }}
                    />
                  ) : (
                    <h2
                      className="text-lg font-semibold cursor-pointer hover:underline"
                      onDoubleClick={() => startEditing(chat)}
                      onClick={() => router.push(`/chat/${chat?.id}`)}
                    >
                      {chat?.title || "Untitled Chat"}
                    </h2>
                  )}
                  <div className="flex gap-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm transition hover:bg-red-600"
                      onClick={() => deleteChat(chat?.id || "")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
      <div 
        onClick={() => router.push('/auth/logout')}
        className="flex flex-row transition-all duration-200 hover:bg-red-500/50 hover:cursor-pointer rounded-xl p-2 items-center w-1/2 gap-2"
      >
        <Image
          width={256}
          height={256}
          alt={'<'}
          src={require('@/app/assets/icons/logout.svg')}
          className="w-8 h-8 p-1"  
        />
        <h1 className="font-nue text-2xl mt-1">LOGOUT</h1> 
      </div>
    </div>
  );
};

export default Sidebar;