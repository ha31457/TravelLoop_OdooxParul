"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Map as MapIcon,
  Filter,
  Heart,
  Star,
  Coffee,
  Moon,
  Camera,
  Mountain,
  Users,
  Utensils,
  Plus,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const CATEGORIES = [
  { id: "all", label: "For You" },
  { id: "restaurants", label: "Restaurants", icon: Utensils },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "sightseeing", label: "Sightseeing", icon: Camera },
  { id: "adventures", label: "Adventures", icon: Mountain },
  { id: "local", label: "Local Experiences", icon: Users },
];

interface DiscoveryCard {
  id: string;
  category: string;
  title: string;
  location: string;
  rating: string;
  image: string;
  height: string; // Tailoring masonry heights
}

const DISCOVERIES: DiscoveryCard[] = [
  { id: "1", category: "sightseeing", title: "Fushimi Inari Shrine", location: "Kyoto, Japan", rating: "4.9", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop", height: "h-[300px]" },
  { id: "2", category: "restaurants", title: "Kitcho Arashiyama", location: "Kyoto, Japan", rating: "4.8", image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=1000&auto=format&fit=crop", height: "h-[400px]" },
  { id: "3", category: "adventures", title: "Mt. Fuji Sunrise Trek", location: "Honshu, Japan", rating: "5.0", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=1000&auto=format&fit=crop", height: "h-[250px]" },
  { id: "4", category: "local", title: "Traditional Tea Ceremony", location: "Gion, Kyoto", rating: "4.7", image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1000&auto=format&fit=crop", height: "h-[350px]" },
  { id: "5", category: "nightlife", title: "Pontocho Alley Bars", location: "Kyoto, Japan", rating: "4.6", image: "https://images.unsplash.com/photo-1558280689-f4d0bb0cc982?q=80&w=1000&auto=format&fit=crop", height: "h-[450px]" },
  { id: "6", category: "sightseeing", title: "Arashiyama Bamboo Grove", location: "Kyoto, Japan", rating: "4.9", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", height: "h-[280px]" },
  { id: "7", category: "restaurants", title: "Nishiki Market Street Food", location: "Kyoto, Japan", rating: "4.8", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop", height: "h-[320px]" },
  { id: "8", category: "adventures", title: "Nara Deer Park Excursion", location: "Nara, Japan", rating: "4.9", image: "https://images.unsplash.com/photo-1542051812-f453a26d0e65?q=80&w=1000&auto=format&fit=crop", height: "h-[380px]" },
  { id: "9", category: "local", title: "Samurai Sword Lesson", location: "Tokyo, Japan", rating: "4.8", image: "https://images.unsplash.com/photo-1514806254641-f7614e5a9526?q=80&w=1000&auto=format&fit=crop", height: "h-[300px]" },
  { id: "10", category: "nightlife", title: "Golden Gai Izakayas", location: "Shinjuku, Tokyo", rating: "4.7", image: "https://images.unsplash.com/photo-1504626835613-25ee50e2bf98?q=80&w=1000&auto=format&fit=crop", height: "h-[400px]" },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);

  const filteredDiscoveries = DISCOVERIES.filter((d) => {
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg pb-24">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-primary/10 blur-[150px]" />
        <div className="absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand-secondary/10 blur-[120px]" />
      </div>

      {/* Floating Header */}
      <header className="sticky top-0 z-50 pt-4 pb-4 px-6">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-4">
          
          <Link href="/dashboard" className="font-heading text-2xl font-bold flex items-center gap-2 group shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-black transition-transform group-hover:scale-110">
              <Compass className="h-5 w-5" />
            </span>
            <span className="hidden md:block">Discover</span>
          </Link>

          {/* Search Bar */}
          <div className="flex w-full max-w-2xl items-center rounded-full border border-white/10 bg-[#071120]/80 px-4 py-2.5 backdrop-blur-xl transition-all focus-within:border-brand-primary/50 focus-within:shadow-[0_0_20px_rgba(73,198,229,0.2)]">
            <Search className="h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search Kyoto for restaurants, hikes, hidden gems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
            />
            <button className="rounded-full bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
              <Filter className="h-4 w-4 text-white/70" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <button 
              onClick={() => setShowMap(!showMap)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all",
                showMap 
                  ? "bg-brand-primary text-black shadow-[0_0_15px_rgba(73,198,229,0.4)]" 
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
              )}
            >
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{showMap ? "List View" : "Map View"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Categories Chips */}
      <div className="relative z-40 mx-auto max-w-[1600px] px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(73,198,229,0.15)]"
                    : "border-white/10 bg-[#071120]/60 text-white/60 hover:bg-white/5 hover:text-white backdrop-blur-md"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6">
        
        {/* Dynamic Split View if Map is active */}
        <div className={cn("transition-all duration-500 ease-in-out", showMap ? "flex gap-6 h-[75vh]" : "")}>
          
          {/* Pinterest Masonry Grid */}
          <div className={cn(
            "w-full transition-all duration-500",
            showMap ? "w-1/2 overflow-y-auto pr-2 custom-scrollbar" : ""
          )}>
            <div className={cn(
               "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4",
               showMap && "lg:columns-2 xl:columns-2"
            )}>
              <AnimatePresence>
                {filteredDiscoveries.map((card) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={card.id}
                    className={cn("group relative w-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 break-inside-avoid cursor-pointer", card.height)}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Gradients for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/90 via-[#071120]/20 to-transparent transition-opacity duration-300 group-hover:via-[#071120]/40" />

                    {/* Top Right Action */}
                    <button className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-brand-highlight hover:border-brand-highlight hover:text-white transition-all text-white/70 z-10">
                      <Heart className="h-4 w-4" />
                    </button>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="mb-2 flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 w-max backdrop-blur-md border border-white/10">
                         <Star className="h-3 w-3 fill-brand-secondary text-brand-secondary" />
                         <span className="text-[10px] font-bold text-white">{card.rating}</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-white leading-tight drop-shadow-md">{card.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                         <MapIcon className="h-3 w-3" /> {card.location}
                      </p>
                      
                      {/* Add to Trip Button (Appears on Hover) */}
                      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-black opacity-0 transition-opacity duration-300 hover:bg-brand-primary/90 group-hover:opacity-100">
                        <Plus className="h-4 w-4" /> Add to Loop
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredDiscoveries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center w-full">
                <Search className="h-12 w-12 text-white/20 mb-4" />
                <h3 className="font-heading text-2xl font-bold text-white">No experiences found</h3>
                <p className="text-white/50 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Cinematic Map Side Panel */}
          {showMap && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="hidden lg:block w-1/2 rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map view" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-[#071120]/30 mix-blend-multiply" />
              
              {/* Dummy Map Pins */}
              {filteredDiscoveries.slice(0, 4).map((d, i) => (
                <div key={i} className="absolute flex flex-col items-center group cursor-pointer" style={{ top: `${20 + i*15}%`, left: `${30 + i*10}%` }}>
                  <div className="mb-1 opacity-0 transition-opacity group-hover:opacity-100 bg-[#071120] text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap border border-brand-primary">
                    {d.title}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-black shadow-[0_0_15px_rgba(73,198,229,0.5)] transition-transform group-hover:scale-125 border border-[#071120]">
                    <Utensils className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(73, 198, 229, 0.5);
        }
      `}</style>
    </main>
  );
}
