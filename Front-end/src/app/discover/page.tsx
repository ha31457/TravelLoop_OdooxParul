"use client";

import React, { useState, useEffect } from "react";
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
  Compass,
  Globe
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

interface CountryDto {
  id: string;
  name: string;
  isoCode: string;
  region?: string;
}

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);

  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Location/countries`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.success) {
          setCountries(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.region && c.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              placeholder="Search countries by name or region..."
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
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-20">
                     <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-brand-primary" />
                  </div>
                ) : filteredCountries.map((country, idx) => {
                  // Generating some mock variation in heights for masonry look
                  const heights = ["h-[250px]", "h-[300px]", "h-[350px]", "h-[400px]"];
                  const hClass = heights[idx % heights.length];
                  // Simulated random beautiful fallback images for countries since the API doesn't return one
                  const mockImages = [
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1504626835613-25ee50e2bf98?q=80&w=1000&auto=format&fit=crop"
                  ];
                  const img = mockImages[idx % mockImages.length];

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      key={country.id}
                      className={cn("group relative w-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 break-inside-avoid cursor-pointer", hClass)}
                    >
                      <Link href={`/discover/${country.id}`} className="absolute inset-0 z-20" />
                      
                      <img
                        src={img}
                        alt={country.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/90 via-[#071120]/20 to-transparent transition-opacity duration-300 group-hover:via-[#071120]/40" />

                      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="mb-2 flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 w-max backdrop-blur-md border border-white/10">
                           <Globe className="h-3 w-3 text-brand-secondary" />
                           <span className="text-[10px] font-bold text-white">{country.isoCode}</span>
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-white leading-tight drop-shadow-md">{country.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                           <MapIcon className="h-3 w-3" /> {country.region || "Global"}
                        </p>
                        
                        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-black opacity-0 transition-opacity duration-300 hover:bg-brand-primary/90 group-hover:opacity-100">
                          <Compass className="h-4 w-4" /> Explore Cities
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {!isLoading && filteredCountries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center w-full">
                <Search className="h-12 w-12 text-white/20 mb-4" />
                <h3 className="font-heading text-2xl font-bold text-white">No countries found</h3>
                <p className="text-white/50 mt-2">Try adjusting your search.</p>
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
              {filteredCountries.slice(0, 4).map((c, i) => (
                <div key={i} className="absolute flex flex-col items-center group cursor-pointer" style={{ top: `${20 + i*15}%`, left: `${30 + i*10}%` }}>
                  <div className="mb-1 opacity-0 transition-opacity group-hover:opacity-100 bg-[#071120] text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap border border-brand-primary">
                    {c.name}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-black shadow-[0_0_15px_rgba(73,198,229,0.5)] transition-transform group-hover:scale-125 border border-[#071120]">
                    <Globe className="h-4 w-4" />
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
