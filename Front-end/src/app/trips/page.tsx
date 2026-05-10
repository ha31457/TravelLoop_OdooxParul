"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  MapPin,
  Calendar,
  MoreHorizontal,
  Heart,
  Wallet,
  Clock,
  Plus,
  ArrowRight,
  Plane,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

type TripStatus = "ongoing" | "upcoming" | "completed";

interface Trip {
  id: string;
  title: string;
  location: string;
  image: string;
  date: string;
  status: TripStatus;
  isFavorite: boolean;
  countdown: string;
  budgetStatus: "On Track" | "Over Budget" | "Under Budget";
  budgetColor: string;
  progress: number;
  collaborators: string[];
}

const TRIPS: Trip[] = [
  {
    id: "t1",
    title: "Summer Eurotrip",
    location: "Europe (Multiple)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
    date: "Jul 12 - Aug 05, 2026",
    status: "upcoming",
    isFavorite: true,
    countdown: "In 62 Days",
    budgetStatus: "On Track",
    budgetColor: "text-brand-primary",
    progress: 85,
    collaborators: ["10", "11", "12", "13"],
  },
  {
    id: "t2",
    title: "Kyoto Sakura Season",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    date: "Current Trip",
    status: "ongoing",
    isFavorite: true,
    countdown: "Active Now",
    budgetStatus: "Under Budget",
    budgetColor: "text-brand-secondary",
    progress: 40,
    collaborators: ["20", "21"],
  },
  {
    id: "t3",
    title: "Ski Weekend",
    location: "Aspen, CO",
    image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=2025&auto=format&fit=crop",
    date: "Dec 15 - Dec 18, 2026",
    status: "upcoming",
    isFavorite: false,
    countdown: "In 7 Months",
    budgetStatus: "Over Budget",
    budgetColor: "text-brand-highlight",
    progress: 15,
    collaborators: ["30", "31", "32"],
  },
  {
    id: "t4",
    title: "Bali Retreat",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
    date: "Jan 10 - Jan 24, 2025",
    status: "completed",
    isFavorite: true,
    countdown: "Ended",
    budgetStatus: "On Track",
    budgetColor: "text-brand-primary",
    progress: 100,
    collaborators: ["10", "40"],
  },
  {
    id: "t5",
    title: "New York City Push",
    location: "NYC, New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    date: "Mar 05 - Mar 10, 2025",
    status: "completed",
    isFavorite: false,
    countdown: "Ended",
    budgetStatus: "Over Budget",
    budgetColor: "text-brand-highlight",
    progress: 100,
    collaborators: ["11", "20"],
  },
];

const FILTERS = ["All", "Ongoing", "Upcoming", "Completed", "Favorites"];

// --- Components ---

const TripCard = ({ trip }: { trip: Trip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={trip.image}
        alt={trip.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-[#071120]/40 to-transparent transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071120]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Elements */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <div className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md border",
          trip.status === "ongoing" ? "bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary" :
          trip.status === "upcoming" ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary" :
          "bg-white/10 border-white/20 text-white/70"
        )}>
          {trip.status === "ongoing" && <Plane className="h-3 w-3" />}
          {trip.status === "upcoming" && <Clock className="h-3 w-3" />}
          {trip.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
          <span>{trip.countdown}</span>
        </div>
        
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
          <Heart className={cn("h-4 w-4 transition-colors", trip.isFavorite ? "fill-brand-highlight text-brand-highlight" : "text-white/70")} />
        </button>
      </div>

      {/* Hover Quick Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-5 z-10 flex flex-col gap-2"
          >
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-brand-primary hover:text-black transition-colors text-white">
               <MoreHorizontal className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
        <div className="mb-1">
           <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60">
             <MapPin className="h-3 w-3" /> {trip.location}
           </span>
           <h2 className="mt-1 font-heading text-3xl font-bold text-white drop-shadow-lg leading-tight group-hover:text-brand-primary transition-colors">{trip.title}</h2>
        </div>
        
        <p className="flex items-center gap-2 text-sm text-white/70 mb-5">
          <Calendar className="h-4 w-4" /> {trip.date}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 mb-4">
          <div>
             <p className="text-xs text-white/40 mb-1">Budget Status</p>
             <p className={cn("text-sm font-bold flex items-center gap-1", trip.budgetColor)}>
               <Wallet className="h-3.5 w-3.5" /> {trip.budgetStatus}
             </p>
          </div>
          <div>
             <p className="text-xs text-white/40 mb-1">Collaborators</p>
             <div className="flex -space-x-2">
                {trip.collaborators.map((c, i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${c}`} className="h-6 w-6 rounded-full border border-[#071120] object-cover" alt="Collaborator" />
                ))}
             </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
           <div className="flex justify-between text-xs font-semibold text-white/60">
             <span>{trip.status === "completed" ? "Trip Completed" : "Planning Progress"}</span>
             <span>{trip.progress}%</span>
           </div>
           <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
             <div 
               className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                 trip.status === "completed" ? "bg-white/40" : "bg-gradient-to-r from-brand-primary to-brand-secondary"
               )} 
               style={{ width: `${trip.progress}%` }} 
             />
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MyTripsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTrips = TRIPS.filter(trip => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Favorites") return trip.isFavorite;
    return trip.status === activeFilter.toLowerCase();
  });

  return (
    <main className="min-h-screen w-full bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg pb-24">
      
      {/* Header & Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#071120]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>

          <Link href="/create" className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
            <Plus className="h-4 w-4" /> New Trip
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-6 pt-12">
        
        {/* Page Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-5xl font-bold text-white mb-2">Your Journeys</h1>
            <p className="text-white/60 text-lg">Manage your past adventures and upcoming loops.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-max">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-xl px-5 py-2 text-sm font-medium transition-all duration-300",
                  activeFilter === filter
                    ? "bg-[#071120] text-brand-primary shadow-sm border border-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
             <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6">
                <Plane className="h-10 w-10 text-brand-primary/50" />
             </div>
             <h3 className="font-heading text-2xl font-bold text-white">No trips found</h3>
             <p className="text-white/50 mt-2 max-w-sm">You don't have any trips matching this filter. Start planning your next adventure!</p>
             <Link href="/create" className="mt-8 flex items-center gap-2 font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
               Create a new loop <ArrowRight className="h-4 w-4" />
             </Link>
          </motion.div>
        )}

      </div>
    </main>
  );
}
