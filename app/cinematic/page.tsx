"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, ArrowLeft, ChevronRight, RotateCcw, Monitor, ShieldCheck, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { synth } from "@/lib/synth";

export default function CinematicStudio() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentScene, setCurrentScene] = useState(1);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Timing constants for the 7 scenes
  const scenes = [
    { number: 1, name: "System Boot", range: [0, 3] },
    { number: 2, name: "Hero Dashboard", range: [3, 8] },
    { number: 3, name: "Projects Grid", range: [8, 18] },
    { number: 4, name: "Project Focus", range: [18, 22] },
    { number: 5, name: "File Manager", range: [22, 28] },
    { number: 6, name: "Skills Ticker", range: [28, 32] },
    { number: 7, name: "Outro Credits", range: [32, 38] },
  ];

  // Map absolute time (0-38s) to the scene number
  useEffect(() => {
    let activeScene = 1;
    if (currentTime < 3) activeScene = 1;
    else if (currentTime < 8) activeScene = 2;
    else if (currentTime < 18) activeScene = 3;
    else if (currentTime < 22) activeScene = 4;
    else if (currentTime < 28) activeScene = 5;
    else if (currentTime < 32) activeScene = 6;
    else activeScene = 7;

    if (activeScene !== currentScene) {
      setCurrentScene(activeScene);
      // Play procedural synth sound synced to scene load
      if (!isMuted) {
        switch (activeScene) {
          case 1:
            synth.playBoot();
            break;
          case 2:
            synth.playSuccess();
            break;
          case 3:
            synth.playTick();
            break;
          case 4:
            synth.playSuccess();
            break;
          case 5:
            synth.playGlitch();
            break;
          case 6:
            synth.playTick();
            break;
          case 7:
            synth.playBoot();
            break;
        }
      }
    }
  }, [currentTime, currentScene, isMuted]);

  // Audio boot sound on first interact/mount
  useEffect(() => {
    if (!isMuted) {
      synth.playBoot();
    }
  }, []);

  // Frame tick animation loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = Date.now();
      const tick = () => {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prevTime) => {
          const nextTime = prevTime + delta;
          if (nextTime >= 38) {
            // Loop or stop
            return 0; 
          }
          return nextTime;
        });
        animationRef.current = requestAnimationFrame(tick);
      };
      animationRef.current = requestAnimationFrame(tick);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isMuted) synth.playClick();
  };

  const handleReset = () => {
    setCurrentTime(0);
    if (!isMuted) {
      synth.playGlitch();
      synth.playBoot();
    }
  };

  const handleSceneJump = (sceneNum: number) => {
    const matchedScene = scenes.find((s) => s.number === sceneNum);
    if (matchedScene) {
      setCurrentTime(matchedScene.range[0]);
      if (!isMuted) synth.playClick();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  // Convert time to nice string
  const formatTime = (timeInSecs: number) => {
    const sec = Math.floor(timeInSecs);
    const ms = Math.floor((timeInSecs % 1) * 100).toString().padStart(2, "0");
    return `${sec.toString().padStart(2, "0")}:${ms}`;
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative scanlines">
      {/* Background Matrix Ambient Grid */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={() => !isMuted && synth.playClick()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 font-mono text-xs"
          >
            <ArrowLeft size={14} /> EXIT TO OS
          </a>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            // CINEMATIC RENDER PIPELINE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <span className="text-xs text-gray-500 font-mono hidden md:inline">
            RESOLUTION: 1080 x 1920 (9:16)
          </span>
        </div>
      </div>

      {/* Center Layout: Sidebar + Phone + Specs */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-8 z-10">
        {/* Left Side: Interactive Scene Jumper Controls */}
        <div className="w-full lg:w-72 space-y-4 shrink-0 order-2 lg:order-1">
          <div className="glass-panel p-5 rounded-2xl border-white/5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Film size={12} className="text-cyan-400" />
              Timeline Scenes
            </h3>
            <div className="space-y-1.5">
              {scenes.map((s) => {
                const isActive = currentScene === s.number;
                return (
                  <button
                    key={s.number}
                    onClick={() => handleSceneJump(s.number)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs transition-all duration-300 ${
                      isActive
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold"
                        : "bg-transparent border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{s.number}. {s.name}</span>
                    <span className="text-[10px] text-gray-500">{s.range[0]}s - {s.range[1]}s</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Mobile Device View Mockup (9:16) */}
        <div className="relative shrink-0 order-1 lg:order-2">
          {/* Neon shadow box */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-[48px] blur-2xl pointer-events-none" />

          {/* Device Frame */}
          <div className="w-[320px] aspect-[9/16] rounded-[42px] border-[6px] border-white/10 bg-[#070A12] shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 select-none">
            {/* Dynamic Island Camera */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full border border-white/5 z-40 flex items-center justify-end px-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
            </div>

            {/* Animation Scene Render Engine */}
            <div className="flex-1 relative overflow-hidden rounded-[28px] bg-[#070A12] border border-white/5">
              <AnimatePresence mode="wait">
                {/* SCENE 1: SYSTEM BOOT (0s - 3s) */}
                {currentScene === 1 && (
                  <motion.div
                    key="scene-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black p-4 text-center font-mono text-[10px]"
                  >
                    <div className="absolute inset-0 grid-bg opacity-20" />
                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="space-y-4 z-10 px-4"
                    >
                      <p className="text-cyan-400 font-bold glow-text-cyan tracking-wider">
                        INITIALIZING PORTFOLIO SYSTEM...
                      </p>
                      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5 mx-auto">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "linear" }}
                          className="h-full bg-cyan-400"
                        />
                      </div>
                      <p className="text-gray-500 uppercase tracking-widest text-[8px]">
                        TLS SECURE CONNECTION // ACTIVE
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* SCENE 2: HERO DASHBOARD (3s - 8s) */}
                {currentScene === 2 && (
                  <motion.div
                    key="scene-2"
                    initial={{ opacity: 0, filter: "blur(20px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col justify-between p-6 bg-[#070A12]"
                  >
                    <div className="absolute inset-0 grid-bg opacity-10" />
                    <div className="space-y-4 pt-10 text-center">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center"
                      >
                        <Monitor size={28} className="text-cyan-400 animate-pulse" />
                      </motion.div>
                      <div className="space-y-1.5">
                        <h2 className="text-xs font-mono font-bold text-white tracking-widest">MOSTAFA AMIEN</h2>
                        <div className="h-[1px] bg-white/10 w-16 mx-auto" />
                        <p className="text-[10px] text-[#00D9FF] font-mono font-bold uppercase leading-relaxed max-w-[200px] mx-auto">
                          AI Solutions Engineer & Flutter Developer
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pb-6">
                      <button className="w-full py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 font-mono text-[10px] font-bold tracking-widest uppercase">
                        VIEW PROJECTS
                      </button>
                      <button className="w-full py-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-300 font-mono text-[10px] tracking-widest uppercase">
                        DOWNLOAD CV
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 3: PROJECTS GRID (8s - 18s) */}
                {currentScene === 3 && (
                  <motion.div
                    key="scene-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4 bg-[#070A12] flex flex-col gap-3 pt-10"
                  >
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1">
                      // SYSTEM MODULES
                    </div>

                    <div className="space-y-3 overflow-hidden">
                      {[1, 2, 3].map((idx) => (
                        <motion.div
                          key={idx}
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.15, type: "spring" }}
                          className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold font-mono text-white">
                              {idx === 1 && "RTA Crowd Management AI"}
                              {idx === 2 && "Autonomous Fleet Dispatcher"}
                              {idx === 3 && "Dubai Tour Guide AI"}
                            </h4>
                            <span className="text-[8px] font-mono bg-[#00D9FF]/10 text-[#00D9FF] px-1.5 py-0.5 rounded border border-[#00D9FF]/20">
                              MODULE {idx}
                            </span>
                          </div>
                          <p className="text-[8px] text-gray-400 leading-relaxed line-clamp-2">
                            {idx === 1 && "Edge computer vision passenger density tracking platform built for RTA Metro."}
                            {idx === 2 && "Machine learning demand forecasting fleet manager and routing solver."}
                            {idx === 3 && "Generative AI travel companion app built natively in Flutter."}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SCENE 4: PROJECT FOCUS (18s - 22s) */}
                {currentScene === 4 && (
                  <motion.div
                    key="scene-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#070A12] p-4 flex flex-col justify-between pt-10"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="border border-cyan-500/30 rounded-xl bg-cyan-500/5 p-4 space-y-4 h-full flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-cyan-400 uppercase font-bold">PROJECT MODULE 01 // SELECTED</span>
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <h3 className="text-xs font-mono font-bold text-white uppercase border-b border-white/5 pb-1">
                          RTA Smart Crowd Management
                        </h3>
                        <p className="text-[9px] text-gray-400 leading-relaxed">
                          Edge computer vision Passenger Density Tracking platform built for Dubai metro stations to monitor crowd density and forecast train dispatch clearances.
                        </p>
                      </div>

                      <div className="bg-black/60 rounded-lg p-2.5 font-mono text-[8px] text-gray-400 space-y-1">
                        <p className="text-green-400 font-bold">$ node agent.js</p>
                        <p className="animate-pulse">Loading weights: 100%</p>
                        <p className="text-cyan-400">Agent response generated.</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* SCENE 5: FILE MANAGER (22s - 28s) */}
                {currentScene === 5 && (
                  <motion.div
                    key="scene-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4 bg-[#070A12] flex flex-col justify-between pt-10"
                  >
                    <div className="space-y-3">
                      <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1">
                        // SECURE FILE STORAGE
                      </div>

                      <div className="space-y-2">
                        {[1, 2, 3].map((idx) => (
                          <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.15 }}
                            className="p-2.5 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between"
                          >
                            <span className="text-[8px] font-mono text-white truncate max-w-[150px]">
                              {idx === 1 && "RTA_Smart_Crowd_Pitch.pptx"}
                              {idx === 2 && "AI_Technical_Spec.pdf"}
                              {idx === 3 && "Mostafa_Amien_CV_2026.pdf"}
                            </span>
                            <span className="text-[7px] font-mono text-[#00D9FF] uppercase">
                              {idx === 1 && "DOWNLOADED"}
                              {idx === 2 && "PDF • 4.8MB"}
                              {idx === 3 && "PDF • 1.8MB"}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Simulation Bar */}
                    <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400">
                        <span>SYNCHRONIZING DOCUMENT DB</span>
                        <span className="animate-pulse">45%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 6: SKILLS TICKER (28s - 32s) */}
                {currentScene === 6 && (
                  <motion.div
                    key="scene-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4 bg-[#070A12] flex flex-col justify-between pt-10"
                  >
                    <div className="space-y-4 text-center mt-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center animate-spin [animation-duration:10s]">
                        <RotateCcw size={20} className="text-cyan-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                          INDEXING CORE COMPETENCY
                        </h4>
                        <p className="text-[8px] text-gray-500 font-mono">FLOW RATE: ACTIVE</p>
                      </div>
                    </div>

                    {/* Horizontal Ticker Simulator */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6 relative">
                      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#070A12] to-transparent z-10" />
                      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#070A12] to-transparent z-10" />
                      <div className="flex gap-4 animate-marquee text-[9px] font-mono font-bold text-cyan-400">
                        <span>UI/UX</span>
                        <span>•</span>
                        <span>REACT.JS</span>
                        <span>•</span>
                        <span>NEXT.JS</span>
                        <span>•</span>
                        <span>AI MIDDLEWARE</span>
                        <span>•</span>
                        <span>FIGMA</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 7: OUTRO CREDITS (32s - 38s) */}
                {currentScene === 7 && (
                  <motion.div
                    key="scene-7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black p-4 text-center font-mono"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="space-y-3 px-4"
                    >
                      <p className="text-white text-xs font-bold tracking-widest glow-text-blue uppercase">
                        DESIGNED & BUILT WITH PRECISION
                      </p>
                      <div className="h-[1px] bg-white/15 w-24 mx-auto" />
                      <p className="text-[#00D9FF] text-[8px] tracking-widest uppercase">
                        OPERATOR PROFILE: MOSTAFA AMIEN
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Stats & Interactive Specifications */}
        <div className="w-full lg:w-80 space-y-4 shrink-0 order-3">
          <div className="glass-panel p-5 rounded-2xl border-white/5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck size={12} className="text-green-400" />
              RENDER ENGINE STATUS
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">CURRENT TIME:</span>
                <span className="text-white font-bold">{formatTime(currentTime)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TOTAL LENGTH:</span>
                <span className="text-gray-400">38.00s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ACTIVE SCENE:</span>
                <span className="text-cyan-400 font-bold uppercase">{currentScene} // 7</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                SCENE ACTIONS:
              </span>
              <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                {currentScene === 1 && "System boot sequence. Matrix grid fades in with cyber loading indicators."}
                {currentScene === 2 && "Profile widget and titles slide down with a cinematic lens blur-to-sharp animation."}
                {currentScene === 3 && "Staggered slides displaying project modules with glow shadows."}
                {currentScene === 4 && "macOS layoutId zoom focusing project details & mock runtime shell logs."}
                {currentScene === 5 && "Slide-in documentation list, simulating background Firestore sync."}
                {currentScene === 6 && "Horizontal infinite skills ticker showing core frontend competencies."}
                {currentScene === 7 && "Outro fade-out credits, displaying system operator signatures."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col md:flex-row items-center gap-4 z-10">
        {/* Play Pause Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all shadow-lg shadow-cyan-500/10"
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex items-center gap-4">
          <span className="text-[10px] font-mono text-gray-500">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={38}
            step={0.05}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono text-gray-500">38:00</span>
        </div>
      </div>
    </div>
  );
}
