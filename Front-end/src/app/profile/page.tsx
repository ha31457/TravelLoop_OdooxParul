"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  MapPin,
  Plane,
  Camera,
  Users,
  Award,
  Globe2,
  Heart,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Edit2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const STATS = [
  { label: "Countries Visited", value: "24", icon: Globe2, color: "text-brand-primary", bg: "bg-brand-primary/10" },
  { label: "Loops Completed", value: "18", icon: Plane, color: "text-brand-secondary", bg: "bg-brand-secondary/10" },
  { label: "Memories Captured", value: "3.2k", icon: Camera, color: "text-brand-highlight", bg: "bg-brand-highlight/10" },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Globetrotter", desc: "Visited 20+ countries", icon: "🌍", unlocked: true },
  { id: 2, title: "Master Planner", desc: "Created 10+ loops", icon: "👑", unlocked: true },
  { id: 3, title: "Mountain Goat", desc: "Completed 5 altitude treks", icon: "🏔️", unlocked: true },
  { id: 4, title: "Deep Diver", desc: "Logged 10 scuba dives", icon: "🐠", unlocked: false },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop", // Kyoto
  "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2070&auto=format&fit=crop", // Amalfi
  "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=2025&auto=format&fit=crop", // Aspen
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop", // Bali
];

const FRIENDS = ["10", "11", "12", "13", "20", "21"];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl", className)}>
    {children}
  </div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="min-h-screen w-full bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg pb-24">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-brand-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-brand-secondary/5 blur-[150px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-heading text-2xl font-bold flex items-center gap-2 group">
          <Globe2 className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
          Travel<span className="text-brand-primary">Loop</span>
        </Link>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </button>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile Overview */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Main Profile Glass Panel */}
          <GlassCard className="relative overflow-hidden">
            <div className="h-32 w-full bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="relative h-24 w-24 rounded-full border-4 border-[#071120] bg-brand-surface overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=68" alt="Alex" className="h-full w-full object-cover" />
                </div>
                <button className="flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-black hover:bg-brand-primary/90 transition-colors">
                  <Edit2 className="h-3 w-3" /> Edit Profile
                </button>
              </div>
              
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Alex Traveler</h1>
                <p className="flex items-center gap-1.5 text-sm text-white/60 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
                </p>
              </div>

              <p className="mt-4 text-sm text-white/80 leading-relaxed">
                Chasing horizons and coffee beans. Always ready for the next adventure, whether it's a snowy peak or a vibrant city street.
              </p>

              {/* Mini Stats Grid */}
              <div className="mt-6 flex gap-4 border-t border-white/10 pt-4">
                 <div className="flex-1 text-center">
                    <span className="block text-xl font-bold text-white">42</span>
                    <span className="text-xs text-white/50 uppercase tracking-wider">Followers</span>
                 </div>
                 <div className="flex-1 text-center border-l border-white/10">
                    <span className="block text-xl font-bold text-white">36</span>
                    <span className="text-xs text-white/50 uppercase tracking-wider">Following</span>
                 </div>
              </div>
            </div>
          </GlassCard>

          {/* Collaborators / Friends List */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-primary" /> Travel Buddies
              </h2>
              <button className="text-xs font-medium text-brand-primary hover:underline">View All</button>
            </div>
            <div className="flex flex-wrap gap-3">
               {FRIENDS.map((f, i) => (
                 <div key={i} className="group cursor-pointer">
                    <img src={`https://i.pravatar.cc/100?img=${f}`} className="h-12 w-12 rounded-full border border-white/10 transition-transform group-hover:-translate-y-1 group-hover:border-brand-primary" alt="Friend" />
                 </div>
               ))}
               <button className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                 <Plus className="h-5 w-5" />
               </button>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Dynamic Content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={idx} className="p-5 overflow-hidden relative group">
                  <div className="absolute right-[-20%] top-[-20%] h-32 w-32 rounded-full opacity-20 blur-[40px] transition-all group-hover:opacity-40" className={cn("absolute right-[-20%] top-[-20%] h-32 w-32 rounded-full opacity-20 blur-[40px] transition-all group-hover:opacity-40", stat.bg)} />
                  <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", stat.bg, stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm font-medium text-white/60">{stat.label}</p>
                </GlassCard>
              );
            })}
          </div>

          {/* Travel Activity Graph (Animated) */}
          <GlassCard className="p-6 pb-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-secondary" /> Travel Activity
              </h2>
              <select className="bg-transparent text-sm text-white/60 outline-none">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            
            {/* Animated Bar Graph */}
            <div className="flex h-40 items-end justify-between gap-2 px-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = [20, 45, 30, 80, 60, 90, 100, 40, 50, 70, 30, 85][i]; // Dummy data %
                return (
                  <div key={month} className="group relative flex w-full flex-col items-center gap-2">
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-[#071120] px-2 py-1 text-xs text-white whitespace-nowrap z-10 border border-white/10">
                      {Math.floor((height / 100) * 15)} trips
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[24px] rounded-t-sm bg-white/5 relative overflow-hidden group-hover:bg-white/10 transition-colors h-full flex items-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                        className={cn("w-full rounded-t-sm bg-gradient-to-t from-brand-primary/50 to-brand-primary")}
                      />
                    </div>
                    <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{month}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Achievements & Badges */}
          <GlassCard className="p-6">
             <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-highlight" /> Badges & Achievements
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all",
                  ach.unlocked ? "border-brand-primary/30 bg-brand-primary/5 hover:border-brand-primary/50" : "border-white/5 bg-white/5 opacity-50 grayscale"
                )}>
                   <span className="text-4xl mb-2 drop-shadow-md">{ach.icon}</span>
                   <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                   <p className="text-[10px] text-white/50 mt-1 leading-tight">{ach.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Immersive Travel Memories Gallery */}
          <GlassCard className="p-6">
             <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-brand-secondary" /> Recent Memories
              </h2>
              <button className="text-xs font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1">
                Open Gallery <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-white/10 cursor-pointer",
                    i === 0 ? "col-span-2 md:col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                  )}
                >
                   <img src={img} alt="Memory" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                     <Heart className="h-6 w-6 text-white drop-shadow-lg" />
                   </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </main>
  );
}
