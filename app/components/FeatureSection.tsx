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
    <div className="flex flex-col justify-center items-center mt-8 py-12 px-6 ">
      <h2 className="font-nue text-backgrountext-centerd text-5xl font-bold text-center mb-8">
        Key Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col group relative cursor-pointer overflow-hidden bg-bgsec px-6 pt-10 pb-10 shadow-xl rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            <span
              className={`absolute top-10 z-0 h-20 w-20 rounded-full bg-lprim transition-all duration-300 group-hover:scale-[10]`}
            ></span>

            <div className="relative z-10 mx-auto max-w-md">
              <span
                className={`grid h-20 w-20 place-items-center rounded-full bg-foreground transition-all duration-300 group-hover:bg-${item.hoverColor}`}
              >
                <Image
                  width={80}
                  height={80}
                  alt={item.title}
                  src={item.icon}
                  className="h-14 w-14 p-2 text-white transition-all"
                />
              </span>

              {/* Feature Description */}
              <h3 className="text-lg font-semibold mt-4  transition-all duration-300 text-white group-hover:font-bold">
                {item.title}
              </h3>

              <p className="text-gray-600 mt-2  group-hover:text-white/90 transition-all duration-300">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
