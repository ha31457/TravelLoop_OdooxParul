"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  Trash2,
  Edit2,
  X
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
  rawStartDate?: string;
  rawEndDate?: string;
  description?: string;
  totalBudget?: number;
}

const INITIAL_TRIPS: Trip[] = [];

const FILTERS = ["All", "Ongoing", "Upcoming", "Completed", "Favorites"];

// --- Components ---

const TripCard = ({ trip, onDelete, onEdit }: { trip: Trip; onDelete: (id: string) => void; onEdit: (trip: Trip) => void }) => {
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
            <div className="flex flex-col gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(trip);
                }}
                title="Edit Trip"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/80 backdrop-blur-md border border-brand-primary/50 hover:bg-brand-primary hover:text-black transition-colors text-black"
              >
                 <Edit2 className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to delete this trip?")) {
                    onDelete(trip.id);
                  }
                }}
                title="Delete Trip"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/60 backdrop-blur-md border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors text-white"
              >
                 <Trash2 className="h-4 w-4" />
              </button>
            </div>
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
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    coverPhotoUrl: "",
    startDate: "",
    endDate: "",
    totalBudget: 0,
    currencyCode: "USD"
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Trip?page=1&pageSize=20`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await response.json();
        
        if (!response.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch trips.");
        }

        const mappedTrips: Trip[] = json.data.items.map((t: any) => ({
          id: t.id,
          title: t.name,
          location: "Location Data Unavailable", // Could map from API if added
          image: t.coverPhotoUrl || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
          date: `${new Date(t.startDate).toLocaleDateString()} - ${new Date(t.endDate).toLocaleDateString()}`,
          status: (t.status || "upcoming").toLowerCase() as TripStatus,
          isFavorite: false, // Could be mapped if API supports
          countdown: t.status === "completed" ? "Ended" : (t.status === "ongoing" ? "Active Now" : "Upcoming"),
          budgetStatus: "On Track", // Simulated
          budgetColor: "text-brand-primary",
          progress: t.status === "completed" ? 100 : (t.status === "ongoing" ? 50 : 0),
          collaborators: ["68", "11"], // Simulated
          rawStartDate: t.startDate,
          rawEndDate: t.endDate,
          description: t.description || "",
          totalBudget: t.totalBudget || 0,
        }));

        setTrips(mappedTrips);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Trip/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Some APIs might return 204 No Content for DELETE without JSON body
      if (res.status === 204) {
         setTrips((prev) => prev.filter((t) => t.id !== id));
         return;
      }

      const json = await res.json();
      if (!res.ok || (json.hasOwnProperty('success') && !json.success)) {
        throw new Error(json.message || "Failed to delete trip.");
      }
      
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      // Automatically hide error after 3 seconds
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleEditClick = (trip: Trip) => {
    setEditingTrip(trip);
    setEditForm({
      name: trip.title,
      description: trip.description || "",
      coverPhotoUrl: trip.image,
      startDate: trip.rawStartDate || "",
      endDate: trip.rawEndDate || "",
      totalBudget: trip.totalBudget || 0,
      currencyCode: "USD"
    });
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem("token");
      const dto = {
        Name: editForm.name,
        Description: editForm.description,
        CoverPhotoUrl: editForm.coverPhotoUrl,
        StartDate: editForm.startDate,
        EndDate: editForm.endDate,
        TotalBudget: editForm.totalBudget,
        CurrencyCode: editForm.currencyCode
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Trip/${editingTrip.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(dto)
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update trip.");
      }

      setTrips(prev => prev.map(t => {
        if(t.id === editingTrip.id) {
          return {
             ...t,
             title: dto.Name,
             image: dto.CoverPhotoUrl || t.image,
             date: `${new Date(dto.StartDate).toLocaleDateString()} - ${new Date(dto.EndDate).toLocaleDateString()}`,
             rawStartDate: dto.StartDate,
             rawEndDate: dto.EndDate,
             description: dto.Description,
             totalBudget: dto.TotalBudget
          };
        }
        return t;
      }));
      setEditingTrip(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
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

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        {/* Trips Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {isLoading ? (
               <div className="col-span-full flex justify-center py-20">
                 <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-brand-primary" />
               </div>
            ) : (
              filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} onEdit={handleEditClick} />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!isLoading && filteredTrips.length === 0 && (
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTrip && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0E2238] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 className="font-heading text-2xl font-bold text-white">Edit Trip</h2>
                <button onClick={() => setEditingTrip(null)} className="rounded-full bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTrip} className="p-6 space-y-4">
                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block">Trip Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Start Date</label>
                    <input type="date" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary [&::-webkit-calendar-picker-indicator]:invert" required />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">End Date</label>
                    <input type="date" value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary [&::-webkit-calendar-picker-indicator]:invert" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Budget</label>
                    <input type="number" value={editForm.totalBudget} onChange={e => setEditForm({...editForm, totalBudget: Number(e.target.value)})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/50 mb-1 block">Currency</label>
                    <input type="text" value={editForm.currencyCode} onChange={e => setEditForm({...editForm, currencyCode: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary" maxLength={3} />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-white/50 mb-1 block">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-brand-primary resize-none h-24" />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingTrip(null)} className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/5">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUpdating} className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-black hover:bg-brand-primary/90 disabled:opacity-50 flex items-center gap-2">
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
