"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  CheckCircle2,
  Circle,
  CloudRain,
  Sun,
  AlertTriangle,
  Briefcase,
  Luggage,
  Backpack,
  Plus,
  Sparkles,
  Users,
  Bell,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

type ItemStatus = "packed" | "unpacked";

interface PackingItem {
  id: string;
  name: string;
  status: ItemStatus;
  assignee?: string; // avatar id
  isShared?: boolean;
}

interface PackingCategory {
  id: string;
  title: string;
  icon: any;
  items: PackingItem[];
}

const INITIAL_CATEGORIES: PackingCategory[] = [
  {
    id: "c1",
    title: "Essentials & Documents",
    icon: Briefcase,
    items: [
      { id: "i1", name: "Passport", status: "unpacked" },
      { id: "i2", name: "JR Pass (Voucher)", status: "packed" },
      { id: "i3", name: "Travel Insurance", status: "unpacked" },
      { id: "i4", name: "Yen Cash", status: "unpacked" },
    ]
  },
  {
    id: "c2",
    title: "Clothing",
    icon: Luggage,
    items: [
      { id: "i5", name: "Lightweight Jackets (2)", status: "packed" },
      { id: "i6", name: "Comfortable Walking Shoes", status: "unpacked" },
      { id: "i7", name: "Socks (8 pairs)", status: "packed" },
      { id: "i8", name: "Raincoat", status: "unpacked" },
    ]
  },
  {
    id: "c3",
    title: "Electronics",
    icon: Backpack,
    items: [
      { id: "i9", name: "Universal Adapter", status: "packed", assignee: "11", isShared: true },
      { id: "i10", name: "Portable Power Bank", status: "unpacked", assignee: "68" },
      { id: "i11", name: "Camera & Extra SD", status: "packed", assignee: "12", isShared: true },
    ]
  }
];

const WEATHER_ALERTS = [
  { icon: CloudRain, text: "70% chance of rain on Day 3. An umbrella is recommended.", color: "text-brand-primary", bg: "bg-brand-primary/10" },
  { icon: Sun, text: "High UV index on Day 5. Don't forget sunscreen.", color: "text-brand-secondary", bg: "bg-brand-secondary/10" },
];

const AI_RECOMMENDATIONS = [
  "Slip-on shoes for temple visits (easy removal)",
  "Coin purse for vending machines & shrines",
  "Small hand towel (restrooms often lack paper towels)",
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-[#0E2238]/50 backdrop-blur-xl", className)}>
    {children}
  </div>
);

export default function PackingPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Toggle item status
  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId 
              ? { ...item, status: item.status === "packed" ? "unpacked" : "packed" } 
              : item
          )
        };
      }
      return cat;
    }));
  };

  // Calculate overall progress
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === "packed").length, 0);
  const progressPercent = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <main className="min-h-screen w-full bg-[#071120] font-sans text-brand-text selection:bg-brand-primary selection:text-[#071120] pb-24">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] h-[700px] w-[700px] rounded-full bg-brand-primary/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[150px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/10 bg-[#071120]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold hidden md:block">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-4">
              {["11", "12", "68"].map((avatar, i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${avatar}`} className="h-8 w-8 rounded-full border-2 border-[#071120] object-cover" alt="Collaborator" />
              ))}
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-primary hover:text-black transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-10">
        
        {/* Header & Progress */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-2">
              <CheckCircle2 className="h-4 w-4" /> Packing Assistant
            </div>
            <h1 className="font-heading text-5xl font-bold text-white mb-2">Kyoto Prep</h1>
            <p className="text-white/60 text-lg">Smart checklists synced with your destination & weather.</p>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="text-right mb-2">
               <span className="text-3xl font-bold text-white">{progressPercent}%</span>
               <span className="text-sm text-white/50 ml-2">Packed</span>
             </div>
             <div className="h-2 w-48 rounded-full bg-white/10 overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-purple-400" 
               />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: The Checklists */}
          <div className="lg:col-span-2 space-y-6">
            
            {categories.map((category) => {
              const Icon = category.icon;
              const catProgress = category.items.filter(i => i.status === "packed").length;
              const catTotal = category.items.length;
              
              return (
                <GlassCard key={category.id} className="p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-brand-primary border border-white/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-heading text-xl font-bold text-white">{category.title}</h2>
                    </div>
                    <span className="text-sm font-medium text-white/50">{catProgress}/{catTotal}</span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {category.items.map((item) => {
                        const isPacked = item.status === "packed";
                        return (
                          <motion.div 
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "group flex items-center justify-between rounded-xl p-3 transition-all cursor-pointer",
                              isPacked ? "bg-white/5" : "bg-black/20 hover:bg-black/40"
                            )}
                            onClick={() => toggleItem(category.id, item.id)}
                          >
                            <div className="flex items-center gap-4">
                              {/* Animated Checkbox */}
                              <div className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                                isPacked ? "bg-brand-primary border-brand-primary" : "border-white/30 group-hover:border-brand-primary"
                              )}>
                                <motion.div
                                  initial={false}
                                  animate={{ scale: isPacked ? 1 : 0, opacity: isPacked ? 1 : 0 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-[#071120]" fill="currentColor" />
                                </motion.div>
                              </div>
                              
                              <span className={cn(
                                "text-sm font-medium transition-all duration-300",
                                isPacked ? "text-white/40 line-through" : "text-white"
                              )}>
                                {item.name}
                              </span>
                            </div>
                            
                            {/* Tags & Assignees */}
                            <div className="flex items-center gap-2">
                              {item.isShared && (
                                <span className="rounded-md bg-purple-500/20 px-2 py-1 text-[10px] font-bold text-purple-300 border border-purple-500/20">
                                  Shared Item
                                </span>
                              )}
                              {item.assignee && (
                                <img 
                                  src={`https://i.pravatar.cc/100?img=${item.assignee}`} 
                                  className={cn("h-6 w-6 rounded-full border border-[#071120] transition-opacity", isPacked ? "opacity-50" : "opacity-100")} 
                                  alt="Assignee" 
                                />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <button className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </GlassCard>
              );
            })}
            
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-transparent py-6 text-white/50 hover:border-brand-primary/50 hover:text-brand-primary transition-colors">
              <Plus className="h-5 w-5" /> Add New Category
            </button>
            
          </div>

          {/* Right Column: AI & Logistics */}
          <div className="space-y-6">
            
            {/* Weather Alerts */}
            <GlassCard className="p-6">
              <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-brand-primary" /> Weather Outlook
              </h3>
              <div className="space-y-3">
                {WEATHER_ALERTS.map((alert, i) => {
                  const Icon = alert.icon;
                  return (
                    <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-3">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", alert.bg, alert.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">{alert.text}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* AI Destination Recommendations */}
            <div className="relative overflow-hidden rounded-3xl border border-brand-secondary/30 bg-gradient-to-b from-[#0E2238] to-black/40 p-6 backdrop-blur-xl">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-brand-secondary/10 blur-[30px]" />
              <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Sparkles className="h-5 w-5 text-brand-secondary" /> AI Suggestions
              </h3>
              <p className="text-xs text-white/60 mb-4 relative z-10">Based on your Kyoto itinerary:</p>
              
              <ul className="space-y-3 relative z-10">
                {AI_RECOMMENDATIONS.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 group cursor-pointer">
                    <Plus className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-sm text-white/90 group-hover:text-white">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Luggage Tracker */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Luggage className="h-5 w-5 text-purple-400" /> Luggage Limit
                </h3>
                <MoreHorizontal className="h-5 w-5 text-white/40 cursor-pointer" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Checked Bag (JAL)</span>
                    <span className="font-bold text-white">18kg / 23kg</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-brand-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Carry-on</span>
                    <span className="font-bold text-brand-highlight flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> 8.5kg / 7kg
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-full rounded-full bg-brand-highlight" />
                  </div>
                  <p className="text-[10px] text-brand-highlight mt-1">Carry-on is over the airline limit.</p>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </main>
  );
}
