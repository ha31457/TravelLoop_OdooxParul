"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  FileText,
  Bookmark,
  ShieldAlert,
  DownloadCloud,
  Coffee,
  Map,
  BookOpen,
  Plus,
  MoreHorizontal,
  AlignLeft,
  Italic,
  Bold,
  List,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const NOTE_CATEGORIES = [
  { id: "general", label: "General Trip Notes", icon: FileText, count: 3 },
  { id: "food", label: "Food & Restaurants", icon: Coffee, count: 12 },
  { id: "tips", label: "Local Tips & Customs", icon: BookOpen, count: 5 },
  { id: "emergency", label: "Emergency Info", icon: ShieldAlert, count: 2 },
  { id: "saved", label: "Saved Recommendations", icon: Bookmark, count: 8 },
];

const DOWNLOADS = [
  { name: "Kyoto Subway Map", size: "2.4 MB", type: "PDF" },
  { name: "Basic Japanese Phrases", size: "1.1 MB", type: "PDF" },
  { name: "Itinerary Offline Copy", size: "5.6 MB", type: "DOCX" },
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-white/10 bg-[#071120]/60 backdrop-blur-xl", className)}>
    {children}
  </div>
);

export default function NotesPage() {
  const [activeNote, setActiveNote] = useState("food");

  return (
    <main className="min-h-screen w-full bg-[#050B14] font-sans text-brand-text selection:bg-brand-primary selection:text-[#050B14]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050B14]/80 px-4 md:px-6 py-4 backdrop-blur-xl flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Globe className="h-6 w-6 text-brand-primary transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold hidden sm:block">
            Travel<span className="text-brand-primary">Loop</span>
          </span>
        </Link>
        
        {/* Collaboration Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
             <div className="flex -space-x-2">
               {["11", "68"].map((avatar, i) => (
                 <img key={i} src={`https://i.pravatar.cc/100?img=${avatar}`} className="h-6 w-6 rounded-full border-2 border-[#050B14] object-cover" alt="Collaborator" />
               ))}
             </div>
             <span className="text-xs text-white/60 font-medium">Alex is editing...</span>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-[#050B14] hover:bg-brand-primary/90 transition-colors">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1600px] flex h-[calc(100vh-73px)]">
        
        {/* Left Sidebar: Folders/Categories */}
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#071120]/40 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Notebooks</h2>
          
          <div className="space-y-1 mb-8">
            {NOTE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeNote === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveNote(cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive ? "bg-white/10 text-white font-medium" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-brand-primary" : "")} />
                    {cat.label}
                  </div>
                  {cat.count > 0 && (
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{cat.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Resources</h2>
          <div className="space-y-3">
             {DOWNLOADS.map((doc, i) => (
               <div key={i} className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-xs font-medium text-white line-clamp-1">{doc.name}</p>
                   <p className="text-[10px] text-white/40 mt-0.5">{doc.type} • {doc.size}</p>
                 </div>
                 <DownloadCloud className="h-4 w-4 text-white/30 group-hover:text-brand-primary transition-colors" />
               </div>
             ))}
          </div>
          
          <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-xs font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
             <Plus className="h-4 w-4" /> New Notebook
          </button>
        </aside>

        {/* Main Editor Area (Notion-style) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* Editor Formatting Toolbar (Floating) */}
          <div className="sticky top-6 z-20 mx-auto w-max flex items-center gap-1 rounded-full border border-white/10 bg-[#071120]/80 p-1.5 backdrop-blur-xl shadow-2xl">
            <button className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><Bold className="h-4 w-4" /></button>
            <button className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><Italic className="h-4 w-4" /></button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><AlignLeft className="h-4 w-4" /></button>
            <button className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><List className="h-4 w-4" /></button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary hover:bg-brand-primary/20">
              <Sparkles className="h-3 w-3" /> Ask AI
            </button>
          </div>

          <div className="mx-auto max-w-3xl px-8 py-12 pb-32">
            
            {/* Header Content */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 group">
              {/* Cover Image Placeholder */}
              <div className="mb-8 h-48 w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1558280689-f4d0bb0cc982?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <button className="absolute bottom-4 right-4 rounded-lg bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                  Change Cover
                </button>
              </div>

              <div className="text-6xl mb-4">🍜</div>
              <input 
                type="text" 
                defaultValue="Must-Try Kyoto Eats" 
                className="w-full bg-transparent font-heading text-4xl md:text-5xl font-bold text-white outline-none placeholder:text-white/20"
                placeholder="Page Title..."
              />
            </motion.div>

            {/* Simulated Rich Text Content */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-6 text-white/80 leading-relaxed font-serif text-lg">
              
              <p>
                Kyoto is arguably the culinary heart of Japan. While Tokyo has volume, Kyoto has <span className="italic text-white">kaiseki</span>—the traditional multi-course dinner that is basically an art form. Here is a compiled list of places we definitely need to hit up.
              </p>

              {/* Callout Box */}
              <div className="flex gap-4 rounded-2xl border border-brand-secondary/30 bg-brand-secondary/5 p-5">
                <Coffee className="h-6 w-6 shrink-0 text-brand-secondary" />
                <div>
                  <h4 className="font-bold text-white text-base font-sans">Morning Coffee Run</h4>
                  <p className="text-sm text-white/70 font-sans mt-1">
                    % Arabica in Arashiyama is famous, but the line gets insane. Let's try to go right when they open at 8 AM, or skip it for Walden Woods.
                  </p>
                </div>
              </div>

              <h2 className="font-heading text-2xl font-bold text-white mt-8 mb-4">Dinner Reservations</h2>
              
              <ul className="space-y-4 list-none pl-0 font-sans text-base">
                <li className="flex gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand-primary/20 border border-brand-primary/50">
                    <span className="h-2 w-2 rounded-full bg-brand-primary" />
                  </div>
                  <div>
                    <strong className="text-white">Kitcho Arashiyama</strong>
                    <p className="text-sm text-white/60">Reserved for Oct 13th at 7:30 PM. Needs smart casual dress code.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/30" />
                  <div>
                    <strong className="text-white">Menbaka Fire Ramen</strong>
                    <p className="text-sm text-white/60">No reservations. We should line up 30 mins before opening.</p>
                  </div>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-bold text-white mt-10 mb-4">Street Food to Find</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                {["Matcha Soft Serve", "Takoyaki (Octopus Balls)", "Yuba (Tofu Skin)", "Mitarashi Dango"].map((food, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors">
                     <span className="text-xl">🍢</span>
                     <span className="text-sm font-medium text-white">{food}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-white/40 italic text-sm font-sans flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                 </span>
                 Alex is typing...
              </p>

            </motion.div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}
