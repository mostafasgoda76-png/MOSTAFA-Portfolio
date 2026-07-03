"use client";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import { fallbackProjects, fallbackFiles, fallbackProfile, Project, FileItem, Profile } from "@/data/projects";
import { translateStorageError } from "@/lib/storage-errors";
import Background from "@/components/Background";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsGrid from "@/components/ProjectsGrid";
import FileManager from "@/components/FileManager";
import AdminModal from "@/components/AdminModal";
import SkillsBar from "@/components/SkillsBar";
import LoadingScreen from "@/components/LoadingScreen";
import Skills from "@/components/Skills";
import { Headphones, Lock, Unlock, LogOut, Plus, RefreshCw, X, Key, ShieldCheck } from "lucide-react";
import { synth } from "@/lib/synth";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [files, setFiles] = useState<FileItem[]>(fallbackFiles);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);

  // Admin and Password Prompts
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Admin Modal Manager
  const [adminModalMode, setAdminModalMode] = useState<"addProject" | "editProject" | "addFile" | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Load Data on startup — Firebase real-time listeners (NO localStorage for data)
  useEffect(() => {
    // Sound preference only — legitimate localStorage use
    const savedMute = localStorage.getItem("muted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    }

    // Real-time Firestore listeners
    if (isFirebaseConfigured && db) {
      const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
        const list: Project[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
        setProjects(list.length > 0 ? list : fallbackProjects);
        setLoading(false);
      }, (error) => {
        console.warn("Firestore projects listener error:", error);
        setLoading(false);
      });

      const unsubFiles = onSnapshot(collection(db, "files"), (snap) => {
        const list: FileItem[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FileItem));
        setFiles(list.length > 0 ? list : fallbackFiles);
      }, (error) => {
        console.warn("Firestore files listener error:", error);
      });

      const unsubProfile = onSnapshot(collection(db, "profile"), (snap) => {
        if (!snap.empty) {
          setProfile({ ...fallbackProfile, ...snap.docs[0].data() } as Profile);
        }
      }, (error) => {
        console.warn("Firestore profile listener error:", error);
      });

      // Cleanup listeners on unmount
      return () => {
        unsubProjects();
        unsubFiles();
        unsubProfile();
      };
    } else {
      // No Firebase configured — use fallback data
      setLoading(false);
    }
  }, []);

  // Lock / Unlock admin
  const handleAdminToggle = () => {
    if (!isMuted) synth.playClick();
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasscodePrompt(true);
      setPasscode("");
      setPasscodeError(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "mostafa2026" || passcode === "rta2026") {
      setIsAdmin(true);
      setShowPasscodePrompt(false);
      setPasscodeError(false);
      if (!isMuted) synth.playSuccess();
    } else {
      setPasscodeError(true);
      if (!isMuted) synth.playGlitch();
    }
  };

  // Add / Edit Project handlers — Firebase ONLY (onSnapshot auto-updates UI)
  const handleSaveProject = async (project: Project, imageFile?: File) => {
    if (!isMuted) synth.playSuccess();

    let imageUrl = project.image;

    // Upload image file directly to Firebase Storage using official SDK
    if (imageFile && isFirebaseConfigured && storage) {
      try {
        const storageRef = ref(storage, `project-images/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (e: any) {
        console.error("Direct GCS Image upload failed:", e);
        const translatedErr = translateStorageError(e);
        alert(translatedErr);
        return;
      }
    }

    const projectData = { ...project, image: imageUrl };

    if (isFirebaseConfigured && db) {
      try {
        if (adminModalMode === "editProject" && project.id) {
          const { id, ...rest } = projectData;
          await updateDoc(doc(db, "projects", project.id), { ...rest });
        } else {
          const { id, ...rest } = projectData;
          await addDoc(collection(db, "projects"), rest);
        }
      } catch (e: any) {
        console.error("Firebase project save failed:", e);
        alert("فشل حفظ بيانات المشروع في قاعدة البيانات: " + (e.message || e));
      }
    }

    setAdminModalMode(null);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this project module?")) {
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "projects", id));
        } catch (e: any) {
          console.error("Firebase delete failed:", e);
          alert("فشل حذف المشروع: " + (e.message || e));
        }
      }
    }
  };

  // Add / Delete Presentation handlers — Firebase ONLY
  const handleSaveFile = async (file: FileItem, actualFile?: File) => {
    if (!isMuted) synth.playSuccess();

    let fileUrl = file.url;
    let fileSize = file.size;

    // Upload actual file directly to Firebase Storage using official SDK
    if (actualFile && isFirebaseConfigured && storage) {
      try {
        const storageRef = ref(storage, `uploaded-files/${Date.now()}-${actualFile.name}`);
        const snapshot = await uploadBytes(storageRef, actualFile);
        fileUrl = await getDownloadURL(snapshot.ref);
        fileSize = `${(actualFile.size / (1024 * 1024)).toFixed(1)} MB`;
      } catch (e: any) {
        console.error("Direct GCS File upload failed:", e);
        const translatedErr = translateStorageError(e);
        alert(translatedErr);
        return;
      }
    }

    const fileData = { ...file, url: fileUrl, size: fileSize };

    if (isFirebaseConfigured && db) {
      try {
        const { id, ...rest } = fileData;
        await addDoc(collection(db, "files"), rest);
      } catch (e: any) {
        console.error("Firebase file save failed:", e);
        alert("فشل حفظ مستند العرض في قاعدة البيانات: " + (e.message || e));
      }
    }

    setAdminModalMode(null);
  };

  const handleDeleteFile = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this document deck?")) {
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "files", id));
        } catch (e: any) {
          console.error("Firebase file delete failed:", e);
          alert("فشل حذف المستند: " + (e.message || e));
        }
      }
    }
  };

  const handleEditProjectClick = (project: Project) => {
    setEditingProject(project);
    setAdminModalMode("editProject");
  };

  return (
    <>
      <LoadingScreen onComplete={() => setLoading(false)} />

      {!loading && (
        <>
          <Background />

          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen justify-between gap-6 select-none scanlines">
        
        {/* Navigation Bar matching photo design */}
        <header className="glass-panel px-6 py-4 rounded-2xl border-white/5 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] animate-pulse">
              <Headphones size={20} />
            </div>
            <span className="text-md font-bold tracking-widest text-white font-sans uppercase">
              {profile.name}
            </span>
          </div>

          {/* Nav Menu */}
          <nav className="flex items-center gap-4 md:gap-8 font-sans text-xs md:text-sm font-semibold">
            <a
              href="#home"
              onClick={() => !isMuted && synth.playClick()}
              className="text-gray-400 hover:text-[#00D9FF] transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => !isMuted && synth.playClick()}
              className="text-gray-400 hover:text-[#00D9FF] transition-colors"
            >
              About
            </a>
            <a
              href="#skills"
              onClick={() => !isMuted && synth.playClick()}
              className="text-gray-400 hover:text-[#00D9FF] transition-colors"
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={() => !isMuted && synth.playClick()}
              className="text-gray-400 hover:text-[#00D9FF] transition-colors"
            >
              Projects
            </a>
            <a
              href="#slides"
              onClick={() => !isMuted && synth.playClick()}
              className="text-gray-400 hover:text-[#00D9FF] transition-colors"
            >
              Gallery
            </a>
            
            {/* Admin toggle action key */}
            <button
              onClick={handleAdminToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold transition-all duration-300 ${
                isAdmin
                  ? "bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 hover:bg-transparent"
                  : "bg-transparent text-gray-400 border-white/5 hover:border-[#00D9FF]/30 hover:text-white"
              }`}
            >
              {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
              {isAdmin ? "ADMIN: ON" : "ADMIN"}
            </button>
          </nav>
        </header>

        {/* Admin Tools Header (Visible when logged in) */}
        {isAdmin && (
          <div className="glass-panel px-6 py-3 rounded-2xl border-[#00D9FF]/20 bg-[#00D9FF]/5 flex items-center justify-between gap-4 animate-fade-in z-30">
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <ShieldCheck size={14} className="text-[#00D9FF]" />
              <span>ADMIN MODE ACTIVE. FIREBASE REAL-TIME SYNC ENABLED.</span>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setAdminModalMode("addProject")}
                className="flex items-center gap-1 text-[10px] font-mono font-bold bg-[#00D9FF] hover:bg-[#38BDF8] text-[#021c27] px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={10} /> ADD PROJECT
              </button>
              <button
                onClick={() => setAdminModalMode("addFile")}
                className="flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={10} /> UPLOAD DECK
              </button>
              <button
                onClick={() => setIsAdmin(false)}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogOut size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Main Sections */}
        <main className="flex-1 space-y-6">
          <Hero profile={profile} isMuted={isMuted} setIsMuted={setIsMuted} />
          
          <About profile={profile} isMuted={isMuted} />
          
          <Skills isMuted={isMuted} />

          <ProjectsGrid
            projects={projects}
            isMuted={isMuted}
            isAdmin={isAdmin}
            onEditProject={handleEditProjectClick}
            onDeleteProject={handleDeleteProject}
          />

          <FileManager
            files={files}
            isMuted={isMuted}
            isAdmin={isAdmin}
            onDeleteFile={handleDeleteFile}
          />
        </main>

        {/* Footer Marquee ticker & copyright */}
        <footer className="space-y-6">
          <SkillsBar isMuted={isMuted} />
          
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 px-2">
            <span>DESIGN & ARCHITECTURE INSPIRED BY NEON PORTFOLIO SHOWCASE</span>
            <span>© 2026 MOSTAFA AMIEN ALL SECURED</span>
          </div>
        </footer>

        {/* Secret Passcode Prompt Modal */}
        {showPasscodePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setShowPasscodePrompt(false)} />
            
            <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border-white/10 shadow-2xl relative z-10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={14} className="text-[#00D9FF]" /> Enter Admin Passcode
                </h3>
                <button
                  onClick={() => setShowPasscodePrompt(false)}
                  className="p-1 rounded-lg border border-white/5 text-gray-500 hover:text-white hover:bg-white/5"
                >
                  <X size={12} />
                </button>
              </div>

              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white text-center focus:outline-none focus:border-[#00D9FF]/50 font-mono tracking-widest"
                  />
                  {passcodeError && (
                    <p className="text-[10px] text-red-400 font-mono text-center pt-1 animate-pulse">
                      ACCESS DENIED. INCORRECT SECURITY ACCESS KEY.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#00D9FF] hover:bg-[#38BDF8] text-[#021c27] font-bold text-xs tracking-wider transition-all duration-300"
                >
                  VERIFY ACCESS
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Global Admin Modal (Add/Edit) */}
        <AdminModal
          mode={adminModalMode}
          onClose={() => {
            setAdminModalMode(null);
            setEditingProject(null);
          }}
          onSaveProject={handleSaveProject}
          onSaveFile={handleSaveFile}
          editingProject={editingProject}
          />

        </div>
      </>
    )}
  </>
);
}
