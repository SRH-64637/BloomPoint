import React from "react";
import GameNavbar from "@/components/ui/gameNavbar";

const header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20 ">
      <h1 className="font-bold text-0.5xl lg:text-xl hover:text-green-300 transition-colors duration-200">
        BloomPoint
      </h1>
      
    </header>
  );
};

export default header;
