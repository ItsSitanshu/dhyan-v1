import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import FeatureSection from "@/app/components/FeatureSection";
import CodeExample from "@/app/components/CodeExample";
import BoxGrid1 from "@/app/components/BoxGrid1";
import BoxGrid2 from "@/app/components/BoxGrid2";
import BoxGrid3 from "@/app/components/BoxGrid3";


const LandingPage = () => {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden">
      <Header />
      <HeroSection />
      <FeatureSection />
      <CodeExample />
      <BoxGrid1 />
      <BoxGrid2 />
      <BoxGrid3 />
    </div>
  );
};

export default LandingPage;
