"use client";
import React from "react";
import { synth } from "@/lib/synth";

interface AboutProps {
  profile: { name: string; role: string; bio: string; avatar?: string };
  isMuted: boolean;
}

export default function About({ profile, isMuted }: AboutProps) {
  const handleHover = () => {
    if (!isMuted) synth.playHover();
  };

  const handleClick = () => {
    if (!isMuted) synth.playClick();
  };

  return (
    <section id="about" className="py-12 md:py-20 border-t border-white/5 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Circular Glowing Avatar Column */}
        <div className="flex-1 flex justify-center shrink-0">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center shrink-0">
            {/* Glowing circle blur */}
            <div className="absolute inset-4 bg-[#00D9FF]/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Circular Avatar */}
            <div className="absolute inset-0 avatar-glow-circle overflow-hidden bg-[#142026]/20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar || "/avatar.png"}
                alt={profile.name}
                className="w-[85%] h-[85%] object-contain pointer-events-none mt-2 animate-pulse [animation-duration:8s]"
              />
            </div>
          </div>
        </div>

        {/* Right About Text Column */}
        <div className="flex-1 space-y-5 text-left">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              About <span className="text-[#FF6F00] drop-shadow-[0_0_10px_rgba(255,111,0,0.45)]">Me</span>
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-[#00D9FF] font-sans">
              Frontend Web Developer, Website Designer & AI Integration Specialist
            </h3>
          </div>

          <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed font-sans">
            <p>
              I am a professional Frontend Web Developer & Website Designer specializing in creating world-class web applications, responsive layouts, and interactive user experiences. My expertise spans modern JavaScript frameworks, full-stack web development, and crafting premium, pixel-perfect designs that are visually stunning, fast, and highly accessible across all devices.
            </p>
            <p>
              Additionally, I specialize in advanced Artificial Intelligence integrations, bridging the gap between state-of-the-art AI pipelines and elegant web frontends. By leveraging modern frameworks, serverless architectures, and intelligent API linkages, I construct high-performance digital products designed to engage users and scale effortlessly.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="#projects"
              onMouseEnter={handleHover}
              onClick={handleClick}
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#FF6F00]/10 hover:shadow-[#FF6F00]/30 hover:scale-[1.02] transition-all duration-300"
            >
              Read More
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
