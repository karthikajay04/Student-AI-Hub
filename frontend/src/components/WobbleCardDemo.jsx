"use client";

import React from "react";
import { WobbleCard } from "../components/wobble-card";
import { AnimatedTestimonialsDemo } from "./AnimatedTestimonialsDemo";

export function WobbleCardDemo() {
  return (
    <div className="bg-black w-full h-full pb-10 pt-30">
      <div className="  grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          {/* V-- I REMOVED "max-w-xs" FROM THIS LINE --V */}
          <div className="">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              About!
            </h2>
            <p className="mt-4 text-left   text-base/5 text-neutral-200">
              {/* I also put your text on one line so it flows properly */}
              Student AI Hub was built to end the chaos of switching between
              dozens of apps. We bring all your essential tools—AI summarizers,
              code debuggers, and planners—into one smart workspace. Our mission
              is to help you learn faster, code smarter, and achieve your goals
              with less friction.
            </p>
          </div>
          
        </WobbleCard>
        <WobbleCard containerClassName="col-span-1 min-h-[300px]">
          <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Tech Used
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Our platform is built on the PERN stack  using Tailwind CSS for the UI and third-party AI APIs like Google's Gemini for its core features.
          </p>
        </WobbleCard>
        
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <AnimatedTestimonialsDemo/>
          
          
        </WobbleCard>
      </div>
    </div>
  );
}
