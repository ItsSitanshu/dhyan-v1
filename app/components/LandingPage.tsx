import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import FeatureSection from "@/app/components/FeatureSection";
import Example from "@/app/components/Example";
import BoxGrid from "@/app/components/BoxGrid";

const LandingPage = () => {
  return (
    <div className="bg-foreground text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden">
      <Header />
      <HeroSection />
      <FeatureSection />
      <Example />
      <BoxGrid speed={140} direction="right" />
      <BoxGrid speed={140} direction="left" />
      <BoxGrid speed={140} direction="right" />
    </div>
  );
};

export default LandingPage;
