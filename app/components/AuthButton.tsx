import Image from "next/image";
import { FC } from "react";

import googleIcon from "@/app/assets/icons/google.svg"
import githubIcon from "@/app/assets/icons/github.svg"

const AuthButton : FC = () => {
    function RegisterGoogle() {

    }

    function RegisterGithub() {

    }

    return (
        <>
        <div className="flex flex-row justify-evenly w-10/12 h-16 mt-5 mb-7">
            <div className="hover:cursor-pointer hover:bg-foreground hover:text-background hover:scale-[1.05] transition duration-300 ease-in-out  
            flex flex-row justify-center items-center w-2/5 h-full border-[0.5px] border-foreground/20 bg-transparent rounded-lg">
                <Image aria-hidden src={googleIcon} alt="File icon" width={26} height={26} className="mr-1.5"/>
                <h1 className=" text-[1rem]">Google</h1>
            </div>
            <div className="hover:cursor-pointer hover:bg-foreground hover:text-background hover:scale-105 transition duration-300 ease-in-out
             flex flex-row justify-center items-center w-2/5 h-full border-[0.5px] border-foreground/20 bg-transparent rounded-lg">
                <Image aria-hidden src={githubIcon} alt="File icon" width={28} height={28} className="mr-1.5"/>
                <h1 className=" text-[1rem]">Github</h1>
            </div>
        </div>
        {/* <div className="flex flex-row w-10/12 h-4 mt-4 mb-4 items-center justify-center">
            <span className="text-xs font-nue">OR</span>
        </div> */}
        </>
    )
};

export default AuthButton;