import Image from "next/image";

interface SidebarProps {
  currentPage: string;
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  return (
    <div className="w-[17rem] h-[94%] text-lsec p-4 flex flex-col justify-between">
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
      </div>
  
    </div>
  )
}

export default Sidebar;