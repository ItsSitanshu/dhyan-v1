'use client';

import Image from "next/image";
import AuthButton from "@/app/components/AuthButton";
import AuthLoginForm from "@/app/components/AuthLoginForm";
import { useState } from "react";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function Login() {
    const [scale, setScale] = useState<number>(100);


    return (
        <div className="flex h-screen w-screen justify-center items-center" onClick={() => setScale(scale == 100 ? 150 : 100)}>
            <div className="flex flex-row justify-start w-10/12 h-5/6 bg-stone-950 rounded-3xl">
                <div className="w-1/2 h-full relative flex flex-col items-center justify-center rounded-l-3xl z-0" style={{
                    background: `radial-gradient(100% 80% at 1% 1%, var(--bunting) -100%, var(--background) 30%, var(--bunting) 100%, var(--foreground) 200%)`,
                }}>
                    <div style={{ content: "''", position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAAIFJREFUGFc1i7sNwkAQRGeFSBwQEAOiBzqgBpzvYXtdk/eQbmmEQogs6MGJdTq0J5HMRzOPCMC96/Y5593TbC4EtLd2Q4H5nMxmgMCBj5bS17MDkFG2OunqxQkXqu6jjE3UafHc98OlDoPISTV+6uVPiEhTSjnE+HgTCpjDNVl6/QCorzBsJWmYUAAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'overlay', opacity: 0.7, pointerEvents: 'none', zIndex: 10, borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }} />
                    <Image
                        aria-hidden
                        src="/logo.svg"
                        alt="File icon"
                        width={32}
                        height={32}
                        className={`transition-transform duration-300 w-32 h-32`}
                        style={{
                        transform: `scale(${scale}%)` 
                        }}
                    />
                    <div className="flex flex-row w-3/4 text-center mt-6">
                    <h1 className="text-foreground text-8xl font-nue uppercase font-bold tracking-widest">
                        focus and Dhyan
                        <span className="text-prim1 opacity-30 text-8xl font-nue uppercase font-bold tracking-widest">
                        .AI
                        </span> 
                    </h1>
                    </div>
                </div>
                <div className="w-1/2 h-full relative flex flex-col items-center justify-center z-0">
                    <div className="w-9/12 flex flex-col items-center justify-center pt-16">
                        <h1 className="text-foreground font-nue text-3xl">Login to your Account</h1>
                        <p className="text-foreground/[.5]  text-lg">Welcome back! Are you ready to start learning?</p>
                        <AuthButton />
                        <AuthLoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
