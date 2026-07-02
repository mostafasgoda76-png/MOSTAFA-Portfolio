"use client";
import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Brain, Cpu, Activity, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { synth } from "@/lib/synth";

interface HeroProps {
  profile: { name: string; role: string; bio: string; avatar?: string };
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export default function Hero({ profile, isMuted, setIsMuted }: HeroProps) {
  const words = [
    "Frontend Website Designer",
    "AI Solutions Integrator",
    "Creative Developer"
  ];

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [typedText, setTypedText] = useState("");

  // Typewriter effect
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000); 
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(words[index].substring(0, subIndex));
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  const handleSoundToggle = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (!nextState) {
      synth.playSuccess();
    }
  };

  const handleInteractiveHover = () => {
    if (!isMuted) synth.playHover();
  };

  const handleSocialClick = () => {
    if (!isMuted) synth.playClick();
  };

  return (
    <section id="home" className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-12 md:py-20 relative z-10">
      
      {/* Left Details Column */}
      <div className="flex-1 space-y-6 text-left max-w-2xl">
        <div className="space-y-3">
          {/* Subtle Tagline */}
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xs md:text-sm font-semibold font-mono tracking-widest text-[#00D9FF] uppercase"
          >
            System Status: Connected
          </motion.h3>

          {/* Name Header with Drop Down & Spring overshoot animation */}
          <motion.h1 
            initial={{ y: -150, opacity: 0, filter: "blur(15px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 65, 
              damping: 11, 
              mass: 1.1,
              duration: 1.5 
            }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white font-sans drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
          >
            {profile.name}
          </motion.h1>

          {/* Subtitle / Typewriter Role */}
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-4xl font-bold font-mono min-h-[44px] flex items-center text-white"
          >
            I'm a 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F00] to-[#FFA000] ml-3 font-sans font-extrabold drop-shadow-[0_0_15px_rgba(255,111,0,0.65)]">
              {typedText}
            </span>
            <span className="w-[3px] h-[24px] md:h-[36px] bg-[#FF6F00] ml-1 animate-pulse shadow-[0_0_10px_rgba(255,111,0,0.8)]" />
          </motion.h2>
        </div>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
          className="text-sm md:text-base text-gray-300 leading-relaxed max-w-lg font-sans"
        >
          Please hold your breath as we dive into a world full of creativity with AI Solutions Engineer {profile.name}.
        </motion.p>

        {/* Social Icons Outlined in Glowing Orange */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={handleInteractiveHover}
            onClick={handleSocialClick}
            className="w-10 h-10 rounded-full border border-[#FF6F00]/20 hover:border-[#FF6F00]/60 hover:bg-[#FF6F00]/5 text-[#FF6F00] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,111,0,0.35)]"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={handleInteractiveHover}
            onClick={handleSocialClick}
            className="w-10 h-10 rounded-full border border-[#FF6F00]/20 hover:border-[#FF6F00]/60 hover:bg-[#FF6F00]/5 text-[#FF6F00] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,111,0,0.35)]"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={handleInteractiveHover}
            onClick={handleSocialClick}
            className="w-10 h-10 rounded-full border border-[#FF6F00]/20 hover:border-[#FF6F00]/60 hover:bg-[#FF6F00]/5 text-[#FF6F00] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,111,0,0.35)]"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={handleInteractiveHover}
            onClick={handleSocialClick}
            className="w-10 h-10 rounded-full border border-[#FF6F00]/20 hover:border-[#FF6F00]/60 hover:bg-[#FF6F00]/5 text-[#FF6F00] hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,111,0,0.35)]"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </motion.div>

        {/* Buttons and Audio Control */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-4 pt-4"
        >
          <a
            href="#projects"
            onMouseEnter={handleInteractiveHover}
            onClick={() => !isMuted && synth.playClick()}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#FF6F00]/20 hover:shadow-[#FF6F00]/50 hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            My Portfolio
          </a>

          <button
            onClick={handleSoundToggle}
            onMouseEnter={handleInteractiveHover}
            className={`flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-full border transition-all duration-300 ${
              isMuted
                ? "bg-transparent text-gray-500 border-white/5 hover:border-[#00D9FF]/30 hover:text-white"
                : "bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/20 hover:bg-[#00D9FF]/20"
            }`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isMuted ? "SOUND: MUTED" : "SOUND: ACTIVE"}
          </button>
        </motion.div>
      </div>

      {/* Right Column: Premium redesigned AI Solution Hub Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex justify-center items-center lg:justify-end shrink-0 perspective-1000"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 6,
            ease: "easeInOut"
          }}
          className="relative w-80 h-[26rem] p-8 rounded-[1.5rem] bg-black/45 border-2 border-[#00D9FF] backdrop-blur-2xl flex flex-col justify-between shadow-[0_0_35px_rgba(0,217,255,0.35),_inset_0_0_20px_rgba(0,217,255,0.15)] overflow-hidden transition-all duration-500 hover:border-[#38BDF8] hover:shadow-[0_0_50px_rgba(0,217,255,0.5),_inset_0_0_25px_rgba(0,217,255,0.25)] group select-none"
        >
          {/* Soft Reflection Sweep Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {/* Cyber scanline overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:100%_6px]" />

          {/* Top Section: Glowing Icon & Title */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-[#00D9FF]/10 border-2 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_25px_rgba(0,217,255,0.3)] animate-pulse">
                <Brain className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-sans text-white tracking-wide">
                AI Solution Hub
              </h3>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00D9FF]/40 to-transparent w-full" />
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                System compiled: YOLOv8 model matrices, Flutter render nodes, custom transit APIs.
              </p>
            </div>
          </div>

          {/* Bottom Section: Cyber Metrics & Hardware Details */}
          <div className="space-y-4 font-mono text-[10px] text-gray-300 relative z-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5"><Cpu size={12} className="text-[#38BDF8]" /> ENGINE</span>
              <span className="text-[#00D9FF] font-bold">V8-CORE_ACTIVE</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5"><Activity size={12} className="text-[#38BDF8]" /> LATENCY</span>
              <span className="text-white">12ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#38BDF8]" /> SECURITY</span>
              <span className="text-emerald-400">SECURE [SSL]</span>
            </div>

            {/* Simulated Live Graph Dots */}
            <div className="pt-2 flex items-center justify-between gap-1.5">
              <span className="text-[9px] text-gray-500">SYSTEM STATS: 60 FPS</span>
              <div className="flex items-end gap-1 h-4">
                <div className="w-1 h-2 bg-[#00D9FF]/40 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-[#00D9FF]/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-4 bg-[#00D9FF] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                <div className="w-1 h-2.5 bg-[#00D9FF]/80 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
