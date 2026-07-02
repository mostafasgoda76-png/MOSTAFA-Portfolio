"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Smartphone, 
  Code, 
  Server, 
  Cloud, 
  Cpu, 
  Database, 
  BarChart, 
  FileSpreadsheet, 
  Flame, 
  Layers, 
  Users, 
  Star 
} from "lucide-react";
import { INITIAL_SKILLS, SkillCategory } from "@/data/skills";
import { synth } from "@/lib/synth";

interface SkillsProps {
  isMuted: boolean;
}

export default function Skills({ isMuted }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);

  const categories: { name: SkillCategory; stars: number; totalCount: number }[] = [
    { name: "Artificial Intelligence", stars: 5, totalCount: 6 },
    { name: "Flutter", stars: 5, totalCount: 6 },
    { name: "Frontend", stars: 5, totalCount: 6 },
    { name: "Backend", stars: 4, totalCount: 6 },
    { name: "Cloud", stars: 4, totalCount: 4 },
    { name: "Automation", stars: 5, totalCount: 6 },
    { name: "Python", stars: 5, totalCount: 6 },
    { name: "Data Analytics", stars: 5, totalCount: 6 },
    { name: "Power BI", stars: 5, totalCount: 6 },
    { name: "Firebase", stars: 5, totalCount: 6 },
    { name: "UI/UX", stars: 4, totalCount: 6 },
    { name: "Leadership", stars: 5, totalCount: 6 }
  ];

  const getCategoryIcon = (cat: SkillCategory) => {
    switch (cat) {
      case "Artificial Intelligence":
        return <Brain className="w-5 h-5" />;
      case "Flutter":
        return <Smartphone className="w-5 h-5" />;
      case "Frontend":
        return <Code className="w-5 h-5" />;
      case "Backend":
        return <Server className="w-5 h-5" />;
      case "Cloud":
        return <Cloud className="w-5 h-5" />;
      case "Automation":
        return <Cpu className="w-5 h-5" />;
      case "Python":
        return <Database className="w-5 h-5" />;
      case "Data Analytics":
        return <BarChart className="w-5 h-5" />;
      case "Power BI":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "Firebase":
        return <Flame className="w-5 h-5" />;
      case "UI/UX":
        return <Layers className="w-5 h-5" />;
      case "Leadership":
        return <Users className="w-5 h-5" />;
    }
  };

  const getCategoryStyles = (cat: SkillCategory) => {
    switch (cat) {
      case "Artificial Intelligence":
        return "text-[#00D9FF] border-[#00D9FF]/20 bg-[#00D9FF]/5 group-hover:bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,217,255,0.15)]";
      case "Flutter":
        return "text-sky-400 border-sky-500/20 bg-sky-500/5 group-hover:bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]";
      case "Frontend":
        return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5 group-hover:bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]";
      case "Backend":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]";
      case "Cloud":
        return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 group-hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]";
      case "Automation":
        return "text-rose-400 border-rose-500/20 bg-rose-500/5 group-hover:bg-rose-500/10 shadow-[0_0_15px_rgba(251,113,133,0.15)]";
      case "Python":
        return "text-yellow-400 border-yellow-500/20 bg-yellow-500/5 group-hover:bg-yellow-500/10 shadow-[0_0_15px_rgba(250,204,21,0.15)]";
      case "Data Analytics":
        return "text-pink-400 border-pink-500/20 bg-pink-500/5 group-hover:bg-pink-500/10 shadow-[0_0_15px_rgba(244,114,182,0.15)]";
      case "Power BI":
        return "text-amber-500 border-amber-500/20 bg-amber-500/5 group-hover:bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
      case "Firebase":
        return "text-red-400 border-red-500/20 bg-red-500/5 group-hover:bg-red-500/10 shadow-[0_0_15px_rgba(248,113,113,0.15)]";
      case "UI/UX":
        return "text-purple-400 border-purple-500/20 bg-purple-500/5 group-hover:bg-purple-500/10 shadow-[0_0_15px_rgba(192,132,252,0.15)]";
      case "Leadership":
        return "text-blue-400 border-blue-500/20 bg-blue-500/5 group-hover:bg-blue-500/10 shadow-[0_0_15px_rgba(96,165,250,0.15)]";
    }
  };

  const handleCardClick = (cat: SkillCategory) => {
    if (!isMuted) {
      synth.playClick();
    }
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  return (
    <section id="skills" className="py-12 md:py-20 border-t border-white/5 relative z-10">
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-[#00D9FF]">
            CORE CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
            Specialized Tech Stack
          </h2>
          <div className="w-16 h-[2.5px] bg-gradient-to-r from-[#00D9FF] to-[#FF6F00] rounded-full mt-2" />
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((catObj, idx) => {
            const cat = catObj.name;
            const catSkills = INITIAL_SKILLS.filter((s) => s.category === cat);
            const isSelected = activeCategory === cat;
            const customStyles = getCategoryStyles(cat);

            return (
              <motion.div
                key={cat}
                layout
                onClick={() => handleCardClick(cat)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className={`p-6 rounded-2xl cursor-pointer bg-black/35 backdrop-blur-md border transition-all duration-500 flex flex-col justify-between select-none group relative overflow-hidden ${
                  isSelected 
                    ? "border-[#00D9FF] shadow-[0_0_30px_rgba(0,217,255,0.25),_inset_0_0_15px_rgba(0,217,255,0.1)] scale-[1.01] z-20" 
                    : "border-white/5 hover:border-[#00D9FF]/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)]"
                }`}
              >
                {/* Soft reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Top Row: Icon badge & Stars */}
                <div className="flex items-center justify-between mb-5 pointer-events-none">
                  <div className={`p-2.5 rounded-xl border transition-all duration-300 ${customStyles}`}>
                    {getCategoryIcon(cat)}
                  </div>
                  
                  {/* Rating Stars and Count */}
                  <div className="flex flex-col items-end gap-1 font-mono">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, sIdx) => (
                        <Star 
                          key={sIdx} 
                          size={9} 
                          fill={sIdx < catObj.stars ? "currentColor" : "none"} 
                          className={sIdx < catObj.stars ? "text-amber-400" : "text-gray-600"}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] text-gray-500 tracking-wider">
                      {catSkills.length} SKILLS
                    </span>
                  </div>
                </div>

                {/* Middle/Bottom Row: Title & Hint */}
                <div className="space-y-2 pointer-events-none">
                  <h3 className="font-sans font-bold text-sm text-white tracking-wide group-hover:text-[#00D9FF] transition-colors">
                    {cat}
                  </h3>

                  {/* Dropdown Container */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-4 border-t border-white/5 pt-4 mt-4"
                      >
                        {catSkills.length === 0 ? (
                          <div className="text-[10px] text-gray-500 italic">No skills registered.</div>
                        ) : (
                          catSkills.map((subSkill) => (
                            <div key={subSkill.id} className="space-y-1 text-left">
                              <div className="flex justify-between text-[10px] text-gray-200">
                                <span>{subSkill.name}</span>
                                <span className="font-mono text-gray-400 font-bold">{subSkill.level}%</span>
                              </div>
                              {/* Animated Progress Bar */}
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${subSkill.level}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                  className="h-full bg-gradient-to-r from-[#00D9FF] to-[#FF6F00]"
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isSelected && (
                    <p className="text-[9px] text-gray-500 group-hover:text-gray-400 font-mono transition-colors pt-1">
                      Click to expand details
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
