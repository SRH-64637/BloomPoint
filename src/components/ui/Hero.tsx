import { Diamond } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "./button";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  const { isSignedIn } = useUser();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen pt-40 px-4 lg:px-8 xl:px-12">
      {/* Left-aligned content container */}
      <div className="max-w-xl space-y-4 lg:space-y-6">
        {/* Ready To Play Button */}
        <div className="relative w-40 h-10 bg-gradient-to-r from-[#F87171] to-[#7F1D1D] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
          <div className="absolute inset-[2px] bg-black rounded-full flex items-center justify-center gap-1 text-sm">
            <Diamond className="w-4 h-4 text-white" />
            Ready To
          </div>
        </div>

        {/* Main Heading - stacked vertically */}
        <div className="space-y-1 lg:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-wider leading-tight">
            Forge Your
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-wider leading-tight">
            Destiny
          </h1>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-wider text-gray-400 max-w-md lg:max-w-lg leading-relaxed">
          Forge skills, embark on quests, connect with fellow adventurers in a
          world of endless possibilities.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {isSignedIn ? (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#F87171] to-[#7F1D1D] text-white px-6 py-4 text-base font-medium rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:scale-105 hover:shadow-lg"
            >
              <Link href="/camp">Enter the World</Link>
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-6 py-4 text-base font-medium text-white rounded-full bg-gradient-to-r from-[#F87171] to-[#7F1D1D] shadow-md transition-all duration-300 hover:brightness-110 hover:scale-105 hover:shadow-lg">
                Join the Adventure
              </button>
            </SignUpButton>
          )}

          <button
            onClick={scrollToFeatures}
            className="px-6 py-4 text-base font-medium text-white rounded-full border-2 border-gray-600 transition-all duration-300 hover:border-red-500 hover:shadow-md hover:bg-gradient-to-r hover:from-[#F87171] hover:to-[#7F1D1D]"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
