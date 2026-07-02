"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { fallbackProjects, fallbackFiles, fallbackProfile, Project, FileItem, Profile } from "@/data/projects";
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

  // Load Data on startup
  useEffect(() => {
    // 1. Load sound preference
    const savedMute = localStorage.getItem("muted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    }

    // 2. Load from localStorage if present
    const localProjects = localStorage.getItem("projects");
    const localFiles = localStorage.getItem("files");
    const localProfile = localStorage.getItem("profile");

    if (localProjects) setProjects(JSON.parse(localProjects));
    if (localFiles) setFiles(JSON.parse(localFiles));
    if (localProfile) setProfile(JSON.parse(localProfile));

    // 3. Load Firebase if configured
    async function loadData() {
      if (isFirebaseConfigured && db) {
        try {
          const projSnap = await getDocs(collection(db, "projects"));
          const projList: Project[] = [];
          projSnap.forEach((doc) => {
            projList.push({ id: doc.id, ...doc.data() } as Project);
          });

          const filesSnap = await getDocs(collection(db, "files"));
          const filesList: FileItem[] = [];
          filesSnap.forEach((doc) => {
            filesList.push({ id: doc.id, ...doc.data() } as FileItem);
          });

          const profSnap = await getDocs(collection(db, "profile"));
          let profData = fallbackProfile;
          profSnap.forEach((doc) => {
            profData = { ...fallbackProfile, ...doc.data() } as Profile;
          });

          if (projList.length > 0) {
            setProjects(projList);
            localStorage.setItem("projects", JSON.stringify(projList));
          }
          if (filesList.length > 0) {
            setFiles(filesList);
            localStorage.setItem("files", JSON.stringify(filesList));
          }
          setProfile(profData);
          localStorage.setItem("profile", JSON.stringify(profData));
        } catch (error) {
          console.warn("Firestore offline fallback active:", error);
        }
      }
    }
    loadData();
  }, []);

  // Synchronize Local Storage when states change
  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const saveFilesToStorage = (updatedFiles: FileItem[]) => {
    setFiles(updatedFiles);
    localStorage.setItem("files", JSON.stringify(updatedFiles));
  };

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

  // Add / Edit Project handlers
  const handleSaveProject = async (project: Project) => {
    if (!isMuted) synth.playSuccess();
    let updated: Project[];

    if (adminModalMode === "editProject") {
      updated = projects.map((p) => (p.id === project.id ? project : p));
      saveProjectsToStorage(updated);

      // Write to Firebase if available
      if (isFirebaseConfigured && db && project.id) {
        try {
          const { id, ...rest } = project;
          // Clean ID prefix if it was created locally
          const docId = project.id.startsWith("proj-") ? project.id : project.id;
          await updateDoc(doc(db, "projects", docId), { ...rest });
        } catch (e) {
          console.warn("Firebase edit failed, saved locally:", e);
        }
      }
    } else {
      updated = [project, ...projects];
      saveProjectsToStorage(updated);

      // Write to Firebase
      if (isFirebaseConfigured && db) {
        try {
          const { id, ...rest } = project;
          await addDoc(collection(db, "projects"), rest);
        } catch (e) {
          console.warn("Firebase create failed, saved locally:", e);
        }
      }
    }
    setAdminModalMode(null);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this project module?")) {
      const updated = projects.filter((p) => p.id !== id);
      saveProjectsToStorage(updated);

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "projects", id));
        } catch (e) {
          console.warn("Firebase delete failed, deleted locally:", e);
        }
      }
    }
  };

  // Add / Delete Presentation handlers
  const handleSaveFile = async (file: FileItem) => {
    if (!isMuted) synth.playSuccess();
    const updated = [file, ...files];
    saveFilesToStorage(updated);

    if (isFirebaseConfigured && db) {
      try {
        const { id, ...rest } = file;
        await addDoc(collection(db, "files"), rest);
      } catch (e) {
        console.warn("Firebase file upload failed, saved locally:", e);
      }
    }
    setAdminModalMode(null);
  };

  const handleDeleteFile = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this document deck?")) {
      const updated = files.filter((f) => f.id !== id);
      saveFilesToStorage(updated);

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "files", id));
        } catch (e) {
          console.warn("Firebase file delete failed, deleted locally:", e);
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
              <span>ADMIN MODE ACTIVE. DIRECT EDIT DATA PERSISTENCE READY.</span>
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
                    placeholder="Enter passcode (e.g. mostafa2026)..."
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
