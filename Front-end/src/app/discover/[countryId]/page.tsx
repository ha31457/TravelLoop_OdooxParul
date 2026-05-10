"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowLeft, Loader2, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CityDto {
  id: string;
  name: string;
  region?: string;
  description?: string;
  costIndex?: number;
}

export default function CountrySearchPage({ params }: { params: { countryId: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<CityDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setHasSearched(true);
      
      const token = localStorage.getItem("token");
      
      const queryParams = new URLSearchParams({
        SearchTerm: searchTerm,
        CountryId: params.countryId,
        Page: "1",
        PageSize: "20"
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Location/cities/search?${queryParams.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to search cities.");
      }

      setCities(json.data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand-secondary/10 blur-[120px]" />
      </div>

      <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/discover" className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
           <ArrowLeft className="h-5 w-5 text-white transition-transform group-hover:-translate-x-1" />
        </Link>
      </nav>

      <div className={cn(
        "relative z-10 mx-auto w-full max-w-3xl px-6 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        hasSearched ? "mt-12" : "mt-[20vh] items-center"
      )}>
        
        {!hasSearched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <Compass className="h-16 w-16 text-brand-primary mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">Find Your City</h1>
            <p className="text-white/60 text-lg">Search for specific cities, regions, or hidden gems to explore.</p>
          </motion.div>
        )}

        <form onSubmit={handleSearch} className="w-full relative">
          <div className="flex w-full items-center rounded-full border border-white/20 bg-[#071120]/80 px-6 py-4 backdrop-blur-xl transition-all focus-within:border-brand-primary focus-within:shadow-[0_0_30px_rgba(73,198,229,0.3)] shadow-2xl">
            <Search className="h-6 w-6 text-brand-primary" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-4 w-full bg-transparent text-lg text-white placeholder-white/40 outline-none"
            />
            <button 
              type="submit" 
              className="ml-4 rounded-full bg-brand-primary px-6 py-2 font-bold text-black hover:bg-brand-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 w-full rounded-xl bg-red-500/10 p-4 text-center text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}
      </div>

      <AnimatePresence>
        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
                <p className="mt-4 text-white/50">Searching the globe...</p>
              </div>
            ) : cities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={city.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/20 text-brand-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      {city.costIndex && (
                        <div className="flex gap-1 text-brand-secondary text-xs">
                          {Array.from({ length: city.costIndex }).map((_, i) => (
                            <span key={i}>$</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">{city.name}</h3>
                    {city.region && (
                      <p className="text-sm text-white/50 uppercase tracking-wider mb-4">{city.region}</p>
                    )}
                    {city.description && (
                      <p className="text-sm text-white/70 line-clamp-2">{city.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MapPin className="h-16 w-16 text-white/20 mb-4" />
                <h3 className="font-heading text-2xl font-bold text-white">No cities found</h3>
                <p className="text-white/50 mt-2">Try adjusting your search term.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
