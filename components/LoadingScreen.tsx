"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ShieldAlert, Sparkles, Wifi } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM BOOT...");
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Elegant non-linear loading speed simulation
    let current = 0;
    const interval = setInterval(() => {
      // Add random progress increments to feel dynamic and realistic
      const increment = Math.floor(Math.random() * 8) + 2; 
      current = Math.min(current + increment, 100);
      setProgress(current);

      // Dynamic status updates based on progress threshold
      if (current < 25) {
        setStatusText("BOOTSTRAPPING HARDWARE INTERFACE...");
      } else if (current < 50) {
        setStatusText("ESTABLISHING FIREBASE CLOUD DATABASE LINK...");
      } else if (current < 75) {
        setStatusText("COMPILING NEON GLASSMORPHIC INTERFACES...");
      } else if (current < 95) {
        setStatusText("OPTIMIZING 60FPS GRAPHICS RENDERING...");
      } else {
        setStatusText("PORTFOLIO OS SECURITY READY. SECURE LOGIN UNLOCKED.");
      }

      if (current === 100) {
        clearInterval(interval);
        // Delay slight moment for user to see 100% completion
        setTimeout(() => {
          setShow(false);
          setTimeout(onComplete, 600); // Trigger completion after exit transition
        }, 800);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#021c27] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Glow Circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

          {/* MacOS/SaaS Style Loading Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#071026]/20 border border-[#00D9FF]/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(0,217,255,0.02)] relative z-10 flex flex-col items-center text-center space-y-6"
          >
            {/* Top Indicator bar */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00D9FF] font-bold">
                <Cpu size={12} className="animate-spin" />
                <span>CORE_V16_BOOT</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-[9px] font-mono">
                <Wifi size={10} className="text-emerald-400" />
                <span>SECURE</span>
              </div>
            </div>

            {/* Core Counter */}
            <div className="relative py-4">
              <motion.div 
                key={progress}
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl md:text-8xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_25px_rgba(0,217,255,0.2)]"
              >
                {progress.toString().padStart(3, "0")}
                <span className="text-3xl font-light text-[#00D9FF]">%</span>
              </motion.div>
            </div>

            {/* Simulated Cyber Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-1.5 bg-black/40 rounded-full border border-white/5 overflow-hidden p-[2px]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00D9FF] to-[#38BDF8] rounded-full shadow-[0_0_10px_rgba(0,217,255,0.5)]"
                  style={{ width: `${progress}%` }}
                  layoutId="progressBar"
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>

              {/* Status Text Log */}
              <div className="h-6 flex items-center justify-center">
                <motion.span 
                  key={statusText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[9px] md:text-[10px] font-mono text-gray-400 tracking-widest uppercase"
                >
                  {statusText}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Footer loading signature */}
          <div className="absolute bottom-10 flex items-center gap-2 text-[9px] font-mono text-gray-600 tracking-wider">
            <ShieldAlert size={10} />
            <span>MOSTAFA AMIEN PORTFOLIO SECURITY KERNEL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
