"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Save, PlusCircle, Upload, Image as ImageIcon, FileText } from "lucide-react";
import { Project, FileItem } from "@/data/projects";

interface AdminModalProps {
  mode: "addProject" | "editProject" | "addFile" | null;
  onClose: () => void;
  onSaveProject: (project: Project, imageFile?: File) => void;
  onSaveFile: (file: FileItem, actualFile?: File) => void;
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
  const [projImageFile, setProjImageFile] = useState<File | null>(null);
  const [projImagePreview, setProjImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // File Form State
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("pptx");
  const [fileSize, setFileSize] = useState("");
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [actualFileName, setActualFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setProjImageFile(null);
      setProjImagePreview(null);
    } else {
      // Clear fields
      setProjTitle("");
      setProjSubtitle("");
      setProjDescription("");
      setProjTags("");
      setProjKpis("");
      setProjLiveLink("");
      setProjImage("https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80");
      setProjImageFile(null);
      setProjImagePreview(null);

      setFileName("");
      setFileType("pptx");
      setFileSize("5.4 MB");
      setActualFile(null);
      setActualFileName(null);
    }
  }, [mode, editingProject]);

  if (!mode) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActualFile(file);
      setActualFileName(file.name);
      // Auto-detect type from extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") setFileType("pdf");
      else if (ext === "pptx" || ext === "ppt") setFileType("pptx");
      // Auto-set name if empty
      if (!fileName) {
        setFileName(file.name.replace(/\.[^/.]+$/, ""));
      }
      // Auto-set size
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

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

      onSaveProject(projectData, projImageFile || undefined);
    } else if (mode === "addFile") {
      const fileData: FileItem = {
        id: `file-${Date.now()}`,
        name: fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`,
        url: "#",
        type: fileType,
        size: fileSize || "1.0 MB",
      };

      onSaveFile(fileData, actualFile || undefined);
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
                <label className="text-[10px] font-mono text-gray-400 uppercase">Description</label>
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

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Project Image</label>
                
                {/* Upload Button */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-[#00D9FF]/40 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 bg-black/20 hover:bg-black/30 group"
                >
                  {projImagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={projImagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      <p className="text-[10px] text-[#00D9FF] font-mono">Click to change image</p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[#00D9FF]/10 flex items-center justify-center group-hover:bg-[#00D9FF]/20 transition-all">
                        <ImageIcon size={18} className="text-[#00D9FF]" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">
                        <span className="text-[#00D9FF]">Click to upload image</span> or use URL below
                      </p>
                    </>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>

                {/* OR fallback URL */}
                {!projImageFile && (
                  <input
                    type="text"
                    value={projImage}
                    onChange={(e) => setProjImage(e.target.value)}
                    placeholder="Or paste image URL here..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50 font-sans"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              {/* File Upload Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase">Upload File (PowerPoint / PDF)</label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-[#00D9FF]/40 rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 bg-black/20 hover:bg-black/30 group"
                >
                  {actualFileName ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center">
                        <FileText size={22} className="text-[#00D9FF]" />
                      </div>
                      <p className="text-xs text-white font-mono">{actualFileName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {fileSize} • Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center group-hover:bg-[#00D9FF]/20 transition-all">
                        <Upload size={22} className="text-[#00D9FF]" />
                      </div>
                      <p className="text-xs text-gray-400 font-mono text-center">
                        <span className="text-[#00D9FF] font-bold">Click to upload</span><br />
                        PowerPoint (.pptx) or PDF (.pdf)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pptx,.ppt,.pdf"
                    onChange={handleActualFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* File Name */}
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
