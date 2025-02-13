import React from "react";
import Image from "next/image";
import Notes from "@/app/assets/icons/landing/notepad.svg";
import exam from "@/app/assets/icons/landing/exam.svg";
import tutor from "@/app/assets/icons/landing/tutor.svg";
import quiz from "@/app/assets/icons/landing/quiz.svg";

const FeatureSection = () => {
  const features = [
    {
      color: "prim2",
      hoverColor: "bgsec",
      title: "Smart Notes",
      description: "Organize your thoughts and ideas efficiently.",
      icon: Notes,
    },
    {
      color: "prim1",
      hoverColor: "bgsec",
      title: "Exam Prep",
      description: "Prepare effectively with tailored resources.",
      icon: exam,
    },
    {
      color: "prim1",
      hoverColor: "bgsec",
      title: "AI Tutor",
      description: "Get personalized tutoring with AI assistance.",
      icon: tutor,
    },
    {
      color: "prim1",
      hoverColor: "bgsec",
      title: "Interactive Quizzes",
      description: "Engage with quizzes that adapt to your learning.",
      icon: quiz,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center mt-32 py-16 px-6 bg-background-100">
      <h2 className="font-nue  text-background text-7xl font-bold text-center mb-8">
        Key <span className="text-mod font-pacifico">Features</span>
      </h2>
      <div className="relative flex flex-col justify-center items-center overflow-hidden py-6 h-full">
        <div className="flex flex-row justify-between space-x-8 w-3/4 h-full">
          {features.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-10 w-1/4 h-full shadow-xl ring-1 
              ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto 
              sm:max-w-sm sm:rounded-lg sm:px-10`}
            >
              <span
                className={`absolute top-10 z-0 h-20 w-20 rounded-full bg-lprim transition-all duration-300 group-hover:scale-[10]`}
              ></span>
              <div className="relative z-10 mx-auto max-w-md">
                <span
                  className={`grid h-20 w-20 place-items-center rounded-full bg-lprim transition-all duration-300 group-hover:bg-${item.hoverColor}`}
                >
                  <Image
                    width={128}
                    height={128}
                    alt={item.title}
                    src={item.icon}
                    className="h-14 w-14 text-white transition-all"
                  />
                </span>
                <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
