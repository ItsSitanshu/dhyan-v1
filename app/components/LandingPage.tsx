"use client";
import React from "react";
import { motion } from "framer-motion"; // Import framer motion
import Header from "@/app/components/Header";
import FeatureSection from "@/app/components/FeatureSection";
import Example from "./Example";
import BoxGrid from "./BoxGrid";
import Methods from "./Methods";

// Define your motion variants (optional)
const pageVariants = {
  hidden: { opacity: 0 }, // Start with hidden opacity
  visible: { opacity: 1, transition: { duration: 1 } }, // Fade in with duration
};

const LandingPage = () => {
  return (
    <motion.div
      initial="hidden" // Start with hidden state
      animate="visible" // Animate to visible state
      variants={pageVariants} // Apply variants
      className="bg-foreground text-foreground font-sans min-h-screen flex flex-col items-center overflow-hidden"
    >
      <Header />
      <FeatureSection />
      <Example />
      <BoxGrid speed={140} direction="right" />
      <BoxGrid speed={140} direction="left" />
      <BoxGrid speed={140} direction="right" />
      <Methods />

      {/* Footer */}
      <footer className="bg-foreground text-gray-300 w-full py-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Dhyan.AI. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            <a
              href="https://github.com/ItsSitanshu/Dhyan.AI"
              className="text-sec2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
