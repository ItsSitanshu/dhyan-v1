import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import VisualIcon from "@/app/assets/icons/types/1.svg";
import AuditoryIcon from "@/app/assets/icons/types/2.svg";
import KinestheticIcon from "@/app/assets/icons/types/3.svg";
import LoadingScreen from "@/app/components/LoadingScreen";

const supabase = createClientComponentClient();

const gradeOptions = [
  { label: "Grade 8", title: "८", color: "#FFB74D" },
  { label: "Grade 9", title: "९", color: "#64B5F6" },  
  { label: "Grade 10", title: "१०", color: "#81C784" }, 
  { label: "Grade 11", title: "११", color: "#FF8A80" }, 
  { label: "Grade 12", title: "१२", color: "#BA68C8" }  
];

const learningStyles = [
  { label: "Visual", image: VisualIcon, description: "Learns best through images, diagrams, and videos." },
  { label: "Auditory", image: AuditoryIcon, description: "Prefers listening to lectures and discussions." },
  { label: "Kinesthetic", image: KinestheticIcon, description: "Hands-on learning with activities and practice." }
];

interface InitialFormInterface {
  user: any;
}


const InitialForm: React.FC<InitialFormInterface> = ({ user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    grade: "",
    learningStyle: "",
  });

  const router = useRouter();

  const handleSelect = async (key: any, value: any) => {
    const updatedFormData = { ...formData, [key]: value };
    setFormData(updatedFormData);

    setStep(step + 1);

    if (key === "learningStyle") {      
      const { data, error } = await supabase.from("users").insert([
        {
          id: user.id,
          chats: [],
          info: updatedFormData,
        },
      ]);
      if (!error) router.push("/");
    }
  };

  if (step === 3) {
    return <LoadingScreen status="Telling all the teachers about a new student" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground text-background p-6">
      <div className="w-2/3 p-6 bg-bgsec shadow-lg rounded-2xl">
        {step === 1 && (
          <div>
            <h2 className="text-4xl font-semibold text-center">
              Hello, {user?.user_metadata?.username || "Student"}! Select Your Grade
            </h2>
            <div className="flex flex-row space-x-5 mt-4">
              {gradeOptions.map(({ label, title, color }) => (
                <div
                  key={label}
                  className="flex flex-col text-foreground items-center w-1/3 cursor-pointer p-4 bg-background justify-center
                  rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:bg-lprim 
                  hover:text-background"
                  onClick={() => handleSelect("grade", label)}
                >
                  <div
                    className="p-3 aspect-square rounded-full text-white text-3xl font-bold flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {title}
                  </div>
                  <p className="mt-4 font-medium text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-4xl font-semibold text-center">What is your Learning Style?</h2>
            <div className="flex flex-row w-full space-x-4 mt-6">
              {learningStyles.map(({ label, image, description }) => (
                <div
                  key={label}
                  className="flex flex-col text-foreground items-center w-1/3 cursor-pointer p-4 bg-background justify-center
                  rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:bg-bgsec 
                  hover:text-background"
                  onClick={() => handleSelect("learningStyle", label)}
                >
                  <Image width={512} height={512} src={image} alt={label} className="w-full h-40 rounded-lg" />
                  <p className="mt-2 text-2xl font-medium">{label}</p>
                  <p className="text-sm mt-1">{description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialForm;
