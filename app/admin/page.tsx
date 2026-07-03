"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { fallbackProjects, fallbackFiles, Project, FileItem } from "@/data/projects";
import { translateStorageError } from "@/lib/storage-errors";
import { 
  Lock, Unlock, Key, ArrowLeft, Plus, Trash2, Edit2, Globe, 
  FileText, ShieldCheck, Database, RefreshCw, Cpu, Activity, LogOut, Upload, Image as ImageIcon
} from "lucide-react";
import { synth } from "@/lib/synth";
import Background from "@/components/Background";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "files">("projects");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Forms States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Project Form
  const [projTitle, setProjTitle] = useState("");
  const [projSubtitle, setProjSubtitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTags, setProjTags] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projImageFile, setProjImageFile] = useState<File | null>(null);
  const [projImagePreview, setProjImagePreview] = useState<string | null>(null);
  const [projLink, setProjLink] = useState("");
  const [projKpis, setProjKpis] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  // File Form
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [fileUrl, setFileUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [actualFileName, setActualFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data and check if already logged in (NO localStorage for data, strictly Firestore real-time)
  useEffect(() => {
    // Check if session admin is already true
    const sessionAuth = sessionStorage.getItem("admin_authenticated") === "true";
    if (sessionAuth) {
      setIsAdmin(true);
    }

    if (isFirebaseConfigured && db) {
      setIsSyncing(true);
      const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
        const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Project));
        setProjects(list.length > 0 ? list : fallbackProjects);
        setIsSyncing(false);
      }, (error) => {
        console.warn("Firestore projects load error:", error);
        setIsSyncing(false);
      });

      const unsubFiles = onSnapshot(collection(db, "files"), (snap) => {
        const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as FileItem));
        setFiles(list.length > 0 ? list : fallbackFiles);
      }, (error) => {
        console.warn("Firestore files load error:", error);
      });

      return () => {
        unsubProjects();
        unsubFiles();
      };
    } else {
      setProjects(fallbackProjects);
      setFiles(fallbackFiles);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "mostafa2026" || passcode === "rta2026") {
      setIsAdmin(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasscodeError(false);
      synth.playSuccess();
    } else {
      setPasscodeError(true);
      synth.playGlitch();
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("admin_authenticated");
    synth.playClick();
  };

  // Projects Add/Edit Form Handlers
  const handleEditProjectClick = (p: Project) => {
    setEditingProject(p);
    setProjTitle(p.title);
    setProjSubtitle(p.subtitle || "");
    setProjDesc(p.description);
    setProjTags(p.tags.join(", "));
    setProjImage(p.image);
    setProjImageFile(null);
    setProjImagePreview(p.image);
    setProjLink(p.liveLink);
    setProjKpis(p.kpis ? p.kpis.join("\n") : "");
    synth.playClick();
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjTitle("");
    setProjSubtitle("");
    setProjDesc("");
    setProjTags("");
    setProjImage("");
    setProjImageFile(null);
    setProjImagePreview(null);
    setProjLink("");
    setProjKpis("");
  };

  const handleProjImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    synth.playSuccess();
    
    try {
      let finalImageUrl = projImage;

      // Upload project image directly using Client Firebase Storage SDK
      if (projImageFile) {
        if (!isFirebaseConfigured || !storage) {
          alert("تنبيه: Firebase Storage غير مهيأ في الموقع.");
          setIsUploading(false);
          return;
        }
        try {
          const storageRef = ref(storage, `project-images/${Date.now()}-${projImageFile.name}`);
          const snapshot = await uploadBytes(storageRef, projImageFile);
          finalImageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr: any) {
          console.error("Direct project image upload failed:", uploadErr);
          const translated = translateStorageError(uploadErr);
          alert(translated);
          setIsUploading(false);
          return;
        }
      }

      const tagsArr = projTags.split(",").map(t => t.trim()).filter(Boolean);
      const kpisArr = projKpis.split("\n").map(k => k.trim()).filter(Boolean);

      const projectData: Omit<Project, "id"> & { id?: string } = {
        title: projTitle,
        subtitle: projSubtitle,
        description: projDesc,
        tags: tagsArr,
        image: finalImageUrl || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
        liveLink: projLink || "#",
        kpis: kpisArr
      };

      if (isFirebaseConfigured && db) {
        if (editingProject && editingProject.id) {
          // Edit mode
          const docId = editingProject.id;
          await updateDoc(doc(db, "projects", docId), projectData);
        } else {
          // Add mode
          await addDoc(collection(db, "projects"), projectData);
        }
      } else {
        alert("تنبيه: Firebase غير مهيأ بشكل صحيح. يرجى مراجعة متغيرات البيئة.");
      }

      resetProjectForm();
    } catch (saveErr: any) {
      console.error("Firebase project save error:", saveErr);
      alert("حدث خطأ أثناء حفظ المشروع في قاعدة البيانات.\nالخطأ: " + (saveErr.message || saveErr));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project/website module?")) {
      synth.playGlitch();
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "projects", id));
        } catch (e: any) {
          console.error("Firebase delete project error:", e);
          alert("فشل حذف المشروع:\n" + (e.message || e));
        }
      }
    }
  };

  // Files Form Handlers
  const handleActualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActualFile(file);
      setActualFileName(file.name);
      
      // Auto set type from extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") setFileType("pdf");
      else if (ext === "pptx" || ext === "ppt") setFileType("pptx");

      // Auto set size
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      
      // Auto set name if empty
      if (!fileName) {
        setFileName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSaveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    synth.playSuccess();

    try {
      let finalFileUrl = fileUrl;

      // Upload file directly using Client Firebase Storage SDK
      if (actualFile) {
        if (!isFirebaseConfigured || !storage) {
          alert("تنبيه: Firebase Storage غير مهيأ في الموقع.");
          setIsUploading(false);
          return;
        }
        try {
          const storageRef = ref(storage, `uploaded-files/${Date.now()}-${actualFile.name}`);
          const snapshot = await uploadBytes(storageRef, actualFile);
          finalFileUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr: any) {
          console.error("Direct document upload failed:", uploadErr);
          const translated = translateStorageError(uploadErr);
          alert(translated);
          setIsUploading(false);
          return;
        }
      }

      const fileData: Omit<FileItem, "id"> = {
        name: fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`,
        type: fileType,
        url: finalFileUrl || "#",
        size: fileSize || "Unknown Size"
      };

      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, "files"), fileData);
      } else {
        alert("تنبيه: Firebase غير مهيأ بشكل صحيح.");
      }

      setFileName("");
      setFileUrl("");
      setFileSize("");
      setActualFile(null);
      setActualFileName(null);
    } catch (saveErr: any) {
      console.error("Firebase upload file error:", saveErr);
      alert("حدث خطأ أثناء حفظ الملف:\n" + (saveErr.message || saveErr));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm("Are you sure you want to remove this PowerPoint/PDF deck?")) {
      synth.playGlitch();
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "files", id));
        } catch (e: any) {
          console.error("Firebase delete file error:", e);
          alert("فشل حذف الملف:\n" + (e.message || e));
        }
      }
    }
  };

  return (
    <>
      <Background />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen justify-between gap-8 select-none scanlines relative z-10">
        
        {/* Passcode Unlock Gateway */}
        {!isAdmin ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md glass-panel p-8 rounded-[2.5rem] border-[#00D9FF]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.15)] animate-pulse">
                  <Lock size={26} />
                </div>
                <h2 className="text-xl font-bold tracking-wider text-white uppercase font-sans mt-2">
                  System Security Lock
                </h2>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                  ENTER ADMIN ACCESS KEY TO UNLOCK PORTFOLIO OS
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="ENTER PASSCODE..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white text-center focus:outline-none focus:border-[#00D9FF]/50 font-mono tracking-[0.4em] transition-all"
                  />
                  {passcodeError && (
                    <p className="text-[10px] text-red-400 font-mono pt-2 animate-pulse uppercase tracking-wider">
                      ACCESS DENIED. SECURITY AUTHENTICATION KEY MISMATCH.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href="/" 
                    className="flex-1 py-3.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-white tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={12} /> Exit Home
                  </Link>

                  <button
                    type="submit"
                    className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-[#00D9FF] to-[#38BDF8] text-[#021c27] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,217,255,0.35)]"
                  >
                    <Key size={12} /> Verify Security
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Header controls */}
            <header className="glass-panel px-6 py-4 rounded-2xl border-white/5 flex items-center justify-between z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF]">
                  <Unlock size={18} />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
                    PORTFOLIO_OS // CONTROL_CENTER
                  </h1>
                  <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    SYSTEM ONLINE / SYNC COMPLETE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-mono font-bold text-white uppercase transition-all"
                >
                  <ArrowLeft size={12} /> View Website
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D9FF]/15 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/25 text-[10px] font-mono font-bold uppercase transition-all"
                >
                  <LogOut size={12} /> Secure Exit
                </button>
              </div>
            </header>

            {/* Metrics cards */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-[9px] font-mono text-gray-500 tracking-wider uppercase">Active Websites</h3>
                  <p className="text-3xl font-black text-white font-mono mt-1">{projects.length}</p>
                </div>
                <Globe size={24} className="text-[#00D9FF] opacity-40" />
              </div>

              <div className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-[9px] font-mono text-gray-500 tracking-wider uppercase">PPT/PDF Pitch Decks</h3>
                  <p className="text-3xl font-black text-white font-mono mt-1">{files.length}</p>
                </div>
                <FileText size={24} className="text-[#38BDF8] opacity-40" />
              </div>

              <div className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-[9px] font-mono text-gray-500 tracking-wider uppercase">Firebase Engine</h3>
                  <p className="text-2xl font-black text-white font-mono mt-1">ONLINE</p>
                </div>
                <Database size={24} className="text-[#00D9FF] opacity-40" />
              </div>

              <div className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-[9px] font-mono text-gray-500 tracking-wider uppercase">Sync Channel</h3>
                  <p className={`text-md font-bold font-mono mt-2.5 ${isFirebaseConfigured ? "text-emerald-400" : "text-amber-500"}`}>
                    {isFirebaseConfigured ? "CONNECTED" : "OFFLINE FALLBACK"}
                  </p>
                </div>
                {isSyncing || isUploading ? (
                  <RefreshCw size={24} className="text-[#00D9FF] animate-spin" />
                ) : (
                  <ShieldCheck size={24} className="text-[#38BDF8] opacity-40" />
                )}
              </div>
            </section>

            {/* Main Tabs Navigation */}
            <div className="flex border-b border-white/5 gap-4">
              <button
                onClick={() => { setActiveTab("projects"); synth.playClick(); }}
                className={`py-3.5 px-6 font-sans text-xs md:text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "projects"
                    ? "border-[#00D9FF] text-[#00D9FF]"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                Manage Websites & Projects (المواقع المنشأة)
              </button>
              <button
                onClick={() => { setActiveTab("files"); synth.playClick(); }}
                className={`py-3.5 px-6 font-sans text-xs md:text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "files"
                    ? "border-[#00D9FF] text-[#00D9FF]"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                Manage Presentations & Decks (عروض الباوربوينت والـ PDF)
              </button>
            </div>

            {/* Tabs View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form Section */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Plus size={14} className="text-[#00D9FF]" />
                    {activeTab === "projects" 
                      ? (editingProject ? "EDIT WEBSITE MODULE" : "ADD NEW WEBSITE") 
                      : "UPLOAD PRESENTATION DECK"}
                  </h2>
                </div>

                {activeTab === "projects" ? (
                  /* Project Create/Edit Form */
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Website Title *</label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="e.g. Dubai Smart Crowd Analytics..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Subtitle / Key Area</label>
                      <input
                        type="text"
                        value={projSubtitle}
                        onChange={(e) => setProjSubtitle(e.target.value)}
                        placeholder="e.g. Computer Vision Station Flow..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Description *</label>
                      <textarea
                        required
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        placeholder="Describe the website solution, objectives, and technology built..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase">Tags (comma separated) *</label>
                        <input
                          type="text"
                          required
                          value={projTags}
                          onChange={(e) => setProjTags(e.target.value)}
                          placeholder="YOLOv8, Flutter, React"
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase">Live Website URL</label>
                        <input
                          type="text"
                          value={projLink}
                          onChange={(e) => setProjLink(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        />
                      </div>
                    </div>

                    {/* Image Upload field */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Project Image Banner</label>
                      <div 
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/10 hover:border-[#00D9FF]/40 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer bg-black/20 hover:bg-black/30 transition-all duration-300 group"
                      >
                        {projImagePreview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={projImagePreview} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                            <p className="text-[9px] text-[#00D9FF] font-mono">Change Image</p>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={18} className="text-[#00D9FF] opacity-70 group-hover:scale-110 transition-transform" />
                            <p className="text-[9px] text-gray-400 font-mono text-center">
                              <span className="text-[#00D9FF]">Click to upload project photo</span> or paste URL below
                            </p>
                          </>
                        )}
                        <input 
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProjImageChange}
                          className="hidden"
                        />
                      </div>
                      {!projImageFile && (
                        <input
                          type="text"
                          value={projImage}
                          onChange={(e) => setProjImage(e.target.value)}
                          placeholder="Or paste external image URL..."
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Key KPI Metrics (one per line)</label>
                      <textarea
                        value={projKpis}
                        onChange={(e) => setProjKpis(e.target.value)}
                        placeholder="Congestion Reduction: 22%&#10;Latency: 40ms"
                        rows={2}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-mono resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      {editingProject && (
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="flex-1 py-2.5 rounded-xl border border-white/5 text-gray-400 text-xs font-mono font-bold hover:text-white uppercase transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="flex-2 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#38BDF8] disabled:opacity-50 text-[#021c27] font-bold text-xs tracking-wider uppercase transition-all hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] flex items-center justify-center gap-1.5"
                      >
                        {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        {editingProject ? "UPDATE SYSTEM CARD" : "COMPILE WEBSITE DATA"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* File Upload Form */
                  <form onSubmit={handleSaveFile} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Select Deck File (PPTX / PDF)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/10 hover:border-[#00D9FF]/40 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer bg-black/20 hover:bg-black/30 transition-all duration-300 group"
                      >
                        {actualFileName ? (
                          <>
                            <FileText size={24} className="text-[#00D9FF]" />
                            <p className="text-xs text-white font-mono text-center truncate max-w-xs">{actualFileName}</p>
                            <p className="text-[9px] text-gray-400 font-mono">{fileSize}</p>
                          </>
                        ) : (
                          <>
                            <Upload size={24} className="text-[#00D9FF] opacity-70 group-hover:scale-110 transition-transform" />
                            <p className="text-xs text-gray-400 font-mono text-center">
                              <span className="text-[#00D9FF]">Click to upload document</span><br />
                              Accepts PPTX, PPT, or PDF
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

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">Presentation Name *</label>
                      <input
                        type="text"
                        required
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="e.g. RTA_Smart_Crowd_Proposal"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase">Deck Format *</label>
                        <select
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                          className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        >
                          <option value="pdf">PDF Document (PDF)</option>
                          <option value="pptx">PowerPoint Presentation (PPTX)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase">File Weight / Size</label>
                        <input
                          type="text"
                          value={fileSize}
                          onChange={(e) => setFileSize(e.target.value)}
                          placeholder="e.g. 12.4 MB"
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        />
                      </div>
                    </div>

                    {!actualFile && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase">Direct Link to File (Optional if uploading file)</label>
                        <input
                          type="text"
                          value={fileUrl}
                          onChange={(e) => setFileUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/40 font-sans"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#38BDF8] disabled:opacity-50 text-[#021c27] font-bold text-xs tracking-wider uppercase transition-all hover:shadow-[0_0_10px_rgba(0,217,255,0.2)] flex items-center justify-center gap-1.5"
                    >
                      {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      PUBLISH PITCH DECK
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: List & Control Section */}
              <div className="lg:col-span-7 space-y-4">
                
                {activeTab === "projects" ? (
                  /* Websites / Projects List view */
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div key={p.id} className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col md:flex-row justify-between gap-4 hover:border-[#00D9FF]/20 transition-all">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{p.title}</h3>
                            <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                              {p.subtitle || "Static App"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{p.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {p.tags.map((t, idx) => (
                              <span key={idx} className="text-[8px] font-mono text-[#00D9FF] bg-[#00D9FF]/5 border border-[#00D9FF]/10 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="flex md:flex-col justify-end items-center md:items-end gap-3 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProjectClick(p)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/5 transition-all"
                              title="Edit Website"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => p.id && handleDeleteProject(p.id)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                              title="Delete Website"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          
                          {p.liveLink !== "#" && (
                            <a
                              href={p.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] font-mono text-[#38BDF8] hover:underline flex items-center gap-1"
                            >
                              Visit Link <ArrowLeft size={8} className="rotate-180" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Documents / Presentations List view */
                  <div className="space-y-3">
                    {files.map((f) => (
                      <div key={f.id} className="glass-panel p-5 rounded-2xl border-white/5 flex items-center justify-between gap-4 hover:border-[#00D9FF]/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            f.type === "pptx" 
                              ? "bg-[#00D9FF]/5 border-[#00D9FF]/20 text-[#00D9FF]" 
                              : "bg-[#38BDF8]/5 border-[#38BDF8]/20 text-[#38BDF8]"
                          }`}>
                            <FileText size={18} />
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-white font-mono">{f.name}</h3>
                            <div className="flex gap-2 text-[9px] font-mono text-gray-500 mt-1">
                              <span>FORMAT: {f.type.toUpperCase()}</span>
                              <span>•</span>
                              <span>WEIGHT: {f.size || "Unknown"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => f.id && handleDeleteFile(f.id)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                            title="Delete Presentation"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="flex items-center justify-between text-[9px] font-mono text-gray-600 px-2 pt-6 border-t border-white/5">
          <span>PORTFOLIO OS SECURE KERNEL V1.0</span>
          <span>© 2026 MOSTAFA AMIEN ALL SECURED</span>
        </footer>
      </div>
    </>
  );
}
