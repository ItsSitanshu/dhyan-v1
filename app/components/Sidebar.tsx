import Image from "next/image";
import { useRouter } from "next/navigation";

interface SidebarProps {
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  const menuItems = [
    { name: "Chat", key: "chat", icon: "chat" },
    { name: "Labaratory", key: "dashboard", icon: "beaker" },
    { name: "Resourece Library", key: "notebook", icon: "notebook" },
    { name: "My Statistics", key: "statistics", icon: "statistics" },
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
      </div>
    </div>
  );
};

export default Sidebar;
