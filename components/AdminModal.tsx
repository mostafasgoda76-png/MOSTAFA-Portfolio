"use client";
import React, { useState, useEffect } from "react";
import { X, Save, PlusCircle } from "lucide-react";
import { Project, FileItem } from "@/data/projects";

interface AdminModalProps {
  mode: "addProject" | "editProject" | "addFile" | null;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
  onSaveFile: (file: FileItem) => void;
  editingProject: Project | null;
}

export default function AdminModal({
  mode,
  onClose,
  onSaveProject,
  onSaveFile,
  editingProject,
}: AdminModalProps) {
  // Project Form State
  const [projTitle, setProjTitle] = useState("");
  const [projSubtitle, setProjSubtitle] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projTags, setProjTags] = useState("");
  const [projKpis, setProjKpis] = useState("");
  const [projLiveLink, setProjLiveLink] = useState("");
  const [projImage, setProjImage] = useState("");

  // File Form State
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("pptx");
  const [fileSize, setFileSize] = useState("");

  // Hydrate fields if editing
  useEffect(() => {
    if (mode === "editProject" && editingProject) {
      setProjTitle(editingProject.title || "");
      setProjSubtitle(editingProject.subtitle || "");
      setProjDescription(editingProject.description || "");
      setProjTags(editingProject.tags ? editingProject.tags.join(", ") : "");
      setProjKpis(editingProject.kpis ? editingProject.kpis.join(", ") : "");
      setProjLiveLink(editingProject.liveLink || "");
      setProjImage(editingProject.image || "");
    } else {
      // Clear fields
      setProjTitle("");
      setProjSubtitle("");
      setProjDescription("");
      setProjTags("");
      setProjKpis("");
      setProjLiveLink("");
      setProjImage("https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80");

      setFileName("");
      setFileType("pptx");
      setFileSize("5.4 MB");
    }
  }, [mode, editingProject]);

  if (!mode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "addProject" || mode === "editProject") {
      const parsedTags = projTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const parsedKpis = projKpis
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const projectData: Project = {
        id: mode === "editProject" && editingProject ? editingProject.id : `proj-${Date.now()}`,
        title: projTitle,
        subtitle: projSubtitle,
        description: projDescription,
        tags: parsedTags.length > 0 ? parsedTags : ["AI", "RTA"],
        image: projImage || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
        liveLink: projLiveLink || "#",
        kpis: parsedKpis,
        createdAt: mode === "editProject" && editingProject ? editingProject.createdAt : new Date(),
      };

      onSaveProject(projectData);
    } else if (mode === "addFile") {
      const fileData: FileItem = {
        id: `file-${Date.now()}`,
        name: fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`,
        url: "#",
        type: fileType,
        size: fileSize || "1.0 MB",
      };

      onSaveFile(fileData);
    }
    onClose();
  };

  const isProjectMode = mode === "addProject" || mode === "editProject";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-lg glass-panel rounded-2xl border-white/10 shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/20">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <PlusCircle size={16} className="text-[#00D9FF]" />
            {mode === "addProject" && "Add New Project Module"}
            {mode === "editProject" && "Modify Project Module"}
            {mode === "addFile" && "Upload Slide Deck Document"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {isProjectMode ? (
            <>
              {/* Project Fields */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Project Title</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. RTA Crowd Analytics Platform"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Subtitle / Department</label>
                <input
                  type="text"
                  value={projSubtitle}
                  onChange={(e) => setProjSubtitle(e.target.value)}
                  placeholder="e.g. Real-time commuter density analytics"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Description Description</label>
                <textarea
                  required
                  rows={4}
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Summarize transit values and innovation details..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Tags (Comma Sep)</label>
                  <input
                    type="text"
                    value={projTags}
                    onChange={(e) => setProjTags(e.target.value)}
                    placeholder="AI, Computer Vision, RTA"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">KPIs (Comma Sep)</label>
                  <input
                    type="text"
                    value={projKpis}
                    onChange={(e) => setProjKpis(e.target.value)}
                    placeholder="Congestion: 22%, Latency: 42ms"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Live Web Link</label>
                  <input
                    type="text"
                    value={projLiveLink}
                    onChange={(e) => setProjLiveLink(e.target.value)}
                    placeholder="https://crowd-analytics.rta.ae"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Card Image Banner URL</label>
                  <input
                    type="text"
                    value={projImage}
                    onChange={(e) => setProjImage(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* File Fields */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">File / Presentation Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Dubai_Smart_Transit_Pitch"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Document Extension</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  >
                    <option value="pptx">PPTX (PowerPoint)</option>
                    <option value="pdf">PDF (Document)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Estimated Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 8.4 MB"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 bg-black/10 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-mono font-bold rounded-lg bg-[#00D9FF] hover:bg-[#38BDF8] text-white shadow-md shadow-[#00D9FF]/20 transition-all duration-300"
            >
              <Save size={12} />
              SAVE ENTRY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
