import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import FeatureSection from "@/app/components/FeatureSection";
import CodeExample from "@/app/components/CodeExample";
import BoxGrid from "@/app/components/BoxGrid";

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden">
      <Header />
      <HeroSection />
      <FeatureSection />
      <CodeExample />
      <BoxGrid speed={140} direction="right" />
      <BoxGrid speed={140} direction="left" />
      <BoxGrid speed={140} direction="right" />
    </div>
  );
};

export default LandingPage;
