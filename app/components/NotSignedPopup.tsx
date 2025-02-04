import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NotSignedPopup: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center bg-background"
    >
      <div className="w-96 p-10 shadow-lg rounded-2xl bg-bgsec text-center">
        <p className="text-foreground font-nue text-2xl mb-4">Please log in or sign up to continue</p>
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="hover:cursor-pointer hover:bg-foreground transition duration-300 ease-in-out flex flex-col
            items-center justify-center w-full h-12 rounded-xl mt-3 hover:opacity-100 opacity-70 text-2xl
            text-background bg-foreground font-bold pt-1.5 font-nue"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
          <button
            type="submit"
            className="hover:cursor-pointer hover:bg-foreground transition duration-300 ease-in-out flex flex-col
            items-center justify-center w-full h-12 rounded-xl mt-3 hover:opacity-100 opacity-70 text-2xl
            text-background bg-foreground font-bold pt-1.5 font-nue"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotSignedPopup;