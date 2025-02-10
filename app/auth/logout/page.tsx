"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await supabase.auth.signOut();
        router.push("/auth/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <h2 className="text-xl font-bold">Logging out...</h2>
        <p className="text-sm text-gray-500">Redirecting you to the login page...</p>
      </div>
    </div>
  );
}

export default Logout;
  