"use client";
import React, { useState } from "react";
import { FileText, Download, Check, Loader2, HardDrive, Search, Trash2 } from "lucide-react";
import { FileItem } from "@/data/projects";
import { synth } from "@/lib/synth";

interface FileManagerProps {
  files: FileItem[];
  isMuted: boolean;
  isAdmin: boolean;
  onDeleteFile?: (id: string) => void;
}

export default function FileManager({
  files,
  isMuted,
  isAdmin,
  onDeleteFile,
}: FileManagerProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (file: FileItem) => {
    if (downloadingId || downloadedIds.includes(file.id || "")) return;
    
    setDownloadingId(file.id || null);
    setDownloadProgress(0);
    if (!isMuted) synth.playGlitch();

    // Simulated download percentage bar loader
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setDownloadedIds((prevList) => [...prevList, file.id || ""]);
          if (!isMuted) synth.playSuccess();
          
          if (file.url !== "#") {
            window.open(file.url, "_blank");
          }
          return 100;
        }
        if (!isMuted && prev % 20 === 0) {
          synth.playTick();
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) synth.playGlitch();
    if (onDeleteFile) onDeleteFile(id);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="slides" className="py-12 md:py-20 border-t border-white/5 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
            Executive <span className="text-[#FF6F00] drop-shadow-[0_0_10px_rgba(255,111,0,0.45)]">Slides & Pitch Decks</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono uppercase">
            PowerPoint (PPTX) & Technical PDF specifications
          </p>
        </div>
        <span className="text-xs text-gray-500 font-mono border border-white/5 px-3 py-1 rounded-full bg-white/5">
          {files.length} ARCHIVES
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Search & Capacity Card */}
        <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
            <HardDrive size={16} className="text-[#00D9FF]" />
            CLOUD DECK STORAGE
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>ALLOCATED VOLUME:</span>
              <span className="text-white font-semibold">27.2 MB / 100 MB</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#00D9FF]" style={{ width: "27.2%" }} />
            </div>
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search index database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]/30 transition-all font-mono"
            />
          </div>

          {/* Downloading Progress Banner */}
          {downloadingId && (
            <div className="p-4 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#00D9FF] font-bold">
                <span>BUFFERING ATTACHMENT...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00D9FF] transition-all duration-100" style={{ width: `${downloadProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: List of Presentation Decks */}
        <div className="lg:col-span-2 space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="glass-panel p-12 text-center text-xs text-gray-500 font-mono rounded-2xl border-white/5">
              NO MATCHING DOCUMENT FILES SECURED.
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isDownloading = downloadingId === file.id;
              const isDownloaded = downloadedIds.includes(file.id || "");
              const isPPTX = file.type === "pptx";

              return (
                <div
                  key={file.id}
                  onMouseEnter={() => !isMuted && synth.playTick()}
                  className="glass-panel p-4 rounded-xl border-white/5 flex items-center justify-between gap-4 hover:border-[#00D9FF]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2.5 rounded-lg border shrink-0 text-white font-bold text-xs font-mono transition-transform duration-300 group-hover:scale-105 ${
                      isPPTX 
                        ? "bg-[#00D9FF]/10 border-[#00D9FF]/25 text-[#00D9FF]" 
                        : "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                    }`}>
                      {isPPTX ? "PPT" : "PDF"}
                    </div>
                    
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold font-sans text-white truncate max-w-[200px] sm:max-w-[400px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono uppercase">
                        {file.type} • {file.size || "1.0 MB"} • ATTACHED PRESENTATION
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(file.id || "", e)}
                        className="p-2 rounded-lg bg-black/60 border border-white/10 text-red-400 hover:bg-black/90 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDownload(file)}
                      disabled={!!downloadingId && !isDownloading}
                      className={`p-2.5 rounded-lg border transition-all duration-300 ${
                        isDownloaded
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : isDownloading
                          ? "bg-[#00D9FF]/10 border-[#00D9FF]/20 text-[#00D9FF]"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {isDownloaded ? (
                        <Check size={14} />
                      ) : isDownloading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} className="group-hover:translate-y-[1px] transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </section>
  );
}
