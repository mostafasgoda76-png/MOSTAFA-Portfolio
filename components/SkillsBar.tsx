"use client";
import React from "react";
import { Cpu, Terminal } from "lucide-react";
import { synth } from "@/lib/synth";

interface SkillsBarProps {
  isMuted: boolean;
}

const skills = [
  "UI/UX DESIGN",
  "REACT.JS",
  "NEXT.JS APPS",
  "AI PIPELINE INTEGRATION",
  "LANGCHAIN / LANGGRAPH",
  "FIRESTORE CMS",
  "FIGMA PROTOTYPING",
  "TAILWIND CSS",
  "FRAMER MOTION",
  "WEB AUDIO API",
  "API MIDDLEWARE",
  "VECTOR DATABASES",
];

export default function SkillsBar({ isMuted }: SkillsBarProps) {
  const handleHover = () => {
    if (!isMuted) synth.playTick();
  };

  // Duplicate the array to ensure continuous scrolling
  const scrollSkills = [...skills, ...skills, ...skills];

  return (
    <div className="glass-panel rounded-2xl p-4 overflow-hidden border-white/5 hover:border-cyan-500/10 transition-all duration-500 relative">
      {/* Decorative scanner line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      
      <div className="flex items-center gap-4">
        {/* Left fixed indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 font-mono text-[10px] uppercase font-bold shrink-0 z-10 backdrop-blur-md">
          <Cpu size={12} className="animate-spin [animation-duration:10s]" />
          TECH TICKER:
        </div>

        {/* Marquee Track */}
        <div className="overflow-hidden w-full relative select-none">
          {/* Faders */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0B0F1A] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0B0F1A] to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee py-1">
            {scrollSkills.map((skill, index) => (
              <span
                key={index}
                onMouseEnter={handleHover}
                className="mx-6 text-[10px] font-mono font-bold tracking-widest text-gray-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-3 cursor-default"
              >
                <span>{skill}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
