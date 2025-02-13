import React from "react";
import { motion } from "framer-motion";
import { Button, Card, CardContent } from "@/components/ui";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <header className="p-6 shadow-md flex justify-between items-center">
        <img src="/logo-dhyan.png" alt="Dhyan.AI Logo" className="h-10" />
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#features" className="hover:text-blue-600">
                Features
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="text-center py-20 bg-gradient-to-b from-blue-50 to-white">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold"
        >
          Empowering Minds with Dhyan.AI
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600">
          Revolutionizing mental wellness with advanced AI technology.
        </p>
        <Button className="mt-6">Get Started</Button>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-2xl font-semibold">Personalized Insights</h3>
              <p className="mt-2 text-gray-600">
                AI-driven insights tailored to individual mental health needs.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-2xl font-semibold">Real-time Analytics</h3>
              <p className="mt-2 text-gray-600">
                Track and analyze mental health patterns in real-time.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-2xl font-semibold">Secure & Confidential</h3>
              <p className="mt-2 text-gray-600">
                Your data is protected with top-notch security measures.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
