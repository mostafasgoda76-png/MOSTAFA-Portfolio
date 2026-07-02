"use client";
import React from "react";
import { ExternalLink, Edit2, Trash2, Layers, CheckSquare, Award } from "lucide-react";
import { Project } from "@/data/projects";
import { synth } from "@/lib/synth";

interface ProjectsGridProps {
  projects: Project[];
  isMuted: boolean;
  isAdmin: boolean;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
}

export default function ProjectsGrid({
  projects,
  isMuted,
  isAdmin,
  onEditProject,
  onDeleteProject,
}: ProjectsGridProps) {
  const handleLaunch = (project: Project, e: React.MouseEvent) => {
    // Avoid double-triggering when click is caught on buttons
    if (!isMuted) synth.playSuccess();
    if (project.liveLink !== "#") {
      window.open(project.liveLink, "_blank");
    }
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) synth.playClick();
    if (onEditProject) onEditProject(project);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) synth.playGlitch();
    if (onDeleteProject) onDeleteProject(id);
  };

  const handleHover = () => {
    if (!isMuted) synth.playTick();
  };

  return (
    <section id="projects" className="py-12 md:py-20 border-t border-white/5 space-y-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
            Active <span className="text-[#FF6F00] drop-shadow-[0_0_10px_rgba(255,111,0,0.45)]">Projects Showcase</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono uppercase">
            RTA Dubai AI & Flutter Deployments
          </p>
        </div>
        <span className="text-xs text-gray-500 font-mono border border-white/5 px-3 py-1 rounded-full bg-white/5">
          TOTAL: {projects.length} INSTANCES
        </span>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onMouseEnter={handleHover}
            onClick={(e) => handleLaunch(project, e)}
            className="glass-card overflow-hidden group cursor-pointer flex flex-col justify-between h-[480px] hover:border-[#00D9FF]/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] relative"
          >
            {/* Corner admin buttons if logged in */}
            {isAdmin && (
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <button
                  onClick={(e) => handleEdit(project, e)}
                  className="p-2 rounded-lg bg-black/60 border border-white/10 text-cyan-400 hover:bg-black/90 transition-all"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => handleDelete(project.id || "", e)}
                  className="p-2 rounded-lg bg-black/60 border border-white/10 text-red-400 hover:bg-black/90 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}

            <div>
              {/* Image banner */}
              <div className="h-44 overflow-hidden relative border-b border-white/5 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1317]/95 via-[#0B1317]/40 to-transparent" />
                
                {/* Custom subtitle label */}
                {project.subtitle && (
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[10px] text-gray-300 font-medium truncate font-sans uppercase tracking-wider">
                      {project.subtitle}
                    </p>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#00D9FF] transition-colors font-sans">
                    {project.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono uppercase bg-white/5 text-gray-300 border border-white/10 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* KPIs list & Launch button */}
            <div className="p-5 pt-0 space-y-4 mt-auto">
              {project.kpis && project.kpis.length > 0 && (
                <div className="border-t border-white/5 pt-3 space-y-1.5 font-mono text-[10px] text-gray-400">
                  <div className="flex items-center gap-1.5 text-[#00D9FF] font-bold text-[9px] uppercase tracking-wider">
                    <Award size={11} /> CORE KPI METRICS:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {project.kpis.slice(0, 4).map((kpi, index) => (
                      <div key={index} className="flex items-center gap-1 truncate text-gray-300">
                        <CheckSquare size={8} className="text-cyan-400 shrink-0" />
                        <span className="truncate">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={(e) => handleLaunch(project, e)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white font-bold text-xs tracking-wider shadow-md shadow-[#FF6F00]/20 hover:shadow-[#FF6F00]/40 transition-all duration-300"
              >
                LAUNCH PROJECT
                <ExternalLink size={12} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
