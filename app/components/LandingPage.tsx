import React from "react";
import Header from "@/app/components/Header";
import FeatureSection from "@/app/components/FeatureSection";
import Example from "./Example";
import BoxGrid from "./BoxGrid";
import Methods from "./Methods";

const LandingPage = () => {
  return (
    <div className="bg-foreground text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden">
      <Header />
      <FeatureSection />
      <Example />
      <BoxGrid speed={140} direction="right" />
      <BoxGrid speed={140} direction="left" />
      <BoxGrid speed={140} direction="right" />
      <Methods />
    </div>
  );
};

export default LandingPage;
