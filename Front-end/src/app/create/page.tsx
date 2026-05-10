"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  MapPin,
  ChevronRight,
  ArrowLeft,
  UserPlus,
  Compass,
  Coffee,
  Mountain,
  Check,
  Palmtree,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Dummy Data ---

const DESTINATION_SUGGESTIONS = [
  { id: "kyoto", name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
  { id: "amalfi", name: "Amalfi Coast", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2070&auto=format&fit=crop" },
  { id: "bali", name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop" },
];

const TRAVEL_STYLES = [
  { id: "relax", label: "Relaxation", icon: Palmtree, desc: "Beaches, spas, and slow mornings." },
  { id: "adventure", label: "Adventure", icon: Mountain, desc: "Hiking, adrenaline, and outdoors." },
  { id: "culture", label: "Culture", icon: Compass, desc: "Museums, history, and local life." },
  { id: "food", label: "Culinary", icon: Coffee, desc: "Street food, fine dining, and wine." },
  { id: "nightlife", label: "Nightlife", icon: Moon, desc: "Clubs, bars, and late nights." },
];

const BUDGETS = [
  { id: "budget", label: "Backpacker", icon: "🪙", desc: "Hostels, street food, buses." },
  { id: "moderate", label: "Moderate", icon: "💵", desc: "Boutique hotels, nice dinners." },
  { id: "luxury", label: "Luxury", icon: "💎", desc: "5-star resorts, private tours." },
];

// --- Components ---

const SectionCard = ({
  title,
  icon,
  children,
  isActive,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <motion.div
    layout
    onClick={onClick}
    className={cn(
      "rounded-3xl border transition-all duration-500 overflow-hidden",
      isActive
        ? "border-brand-primary/40 bg-brand-surface/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md cursor-default"
        : "border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 opacity-70 hover:opacity-100"
    )}
  >
    <div className="flex items-center gap-4 p-6">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full transition-colors", isActive ? "bg-brand-primary/20 text-brand-primary" : "bg-white/10 text-white/50")}>
        {icon}
      </div>
      <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
      {!isActive && <ChevronRight className="ml-auto h-5 w-5 text-white/40" />}
    </div>
    
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 pb-8"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function CreateTripPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop");
  
  const [dates, setDates] = useState("Select dates");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("moderate");
  const [styles, setStyles] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDestinationSelect = (dest: typeof DESTINATION_SUGGESTIONS[0]) => {
    setDestination(dest.name);
    setBgImage(dest.image);
    setActiveStep(2);
  };

  const toggleStyle = (id: string) => {
    setStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const router = useRouter();

  const generateMagic = async () => {
    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem("token");
      const tripDto = {
        Name: `Trip to ${destination || "Unknown"}`,
        Description: `A ${budget} trip focused on ${styles.length > 0 ? styles.join(", ") : "general exploration"}. Built with Magic Builder.`,
        CoverPhotoUrl: bgImage,
        StartDate: "2026-10-12",
        EndDate: "2026-10-24",
        TotalBudget: budget === "luxury" ? 10000 : budget === "moderate" ? 3000 : 1000,
        CurrencyCode: "USD"
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tripDto)
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create trip.");
      }

      // Simulate AI Generation delay to preserve the cool UI effect
      setTimeout(() => {
        router.push("/trips");
      }, 4000);
    } catch (error) {
      console.error(error);
      alert("Failed to craft magic itinerary. Please check your connection.");
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-bg">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/80 via-brand-bg to-brand-bg" />
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-primary/10 blur-[150px]" />
      </div>

      {/* Navbar Minimal */}
      <nav className="relative z-10 mx-auto flex h-24 max-w-4xl items-center justify-between px-6">
        <Link href="/dashboard" className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
          <ArrowLeft className="h-5 w-5 text-white transition-transform group-hover:-translate-x-1" />
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          <span className="font-heading font-bold text-white tracking-wide uppercase text-sm">Magic Builder</span>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </nav>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-40">
        
        {/* Header */}
        <div className="mb-12 mt-8 text-center">
          <h1 className="font-heading text-5xl font-bold text-white md:text-6xl drop-shadow-lg">
            Plan something <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">magical.</span>
          </h1>
          <p className="mt-4 text-lg text-white/60">Let our AI craft the perfect collaborative journey.</p>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          
          {/* STEP 1: Destination */}
          <SectionCard
            title="Where are we going?"
            icon={<MapPin className="h-6 w-6" />}
            isActive={activeStep === 1}
            onClick={() => setActiveStep(1)}
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-primary" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search a city, country, or vibe..."
                className="w-full rounded-2xl border border-white/20 bg-black/40 py-6 pl-16 pr-6 text-xl text-white placeholder-white/30 outline-none transition-all focus:border-brand-primary focus:bg-black/60 focus:shadow-[0_0_20px_rgba(73,198,229,0.3)]"
              />
            </div>

            <div className="mt-8">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">AI Suggestions based on your past trips</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DESTINATION_SUGGESTIONS.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => handleDestinationSelect(dest)}
                    className="group relative h-32 cursor-pointer overflow-hidden rounded-xl border border-white/10"
                  >
                    <img src={dest.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white font-bold">{dest.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* STEP 2: Dates & Travelers */}
          <SectionCard
            title="When & Who?"
            icon={<Calendar className="h-6 w-6" />}
            isActive={activeStep === 2}
            onClick={() => destination ? setActiveStep(2) : null}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Fake Date Picker */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-white/20 cursor-pointer">
                <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Travel Dates</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <Calendar className="h-5 w-5 text-white/80" />
                  </div>
                  <span className="text-lg font-medium text-white">Oct 12 - Oct 24, 2026</span>
                </div>
              </div>

              {/* Traveler Count */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Travelers</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                      <Users className="h-5 w-5 text-white/80" />
                    </div>
                    <span className="text-lg font-medium text-white">{travelers} People</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">-</button>
                    <button onClick={() => setTravelers(travelers + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite Collaborators */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">Invite Friends</h4>
                  <p className="text-sm text-white/50">Plan together in real-time.</p>
                </div>
                <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                  <UserPlus className="h-4 w-4" /> Invite
                </button>
              </div>
              <div className="flex gap-3">
                 <div className="flex flex-col items-center gap-2">
                   <div className="h-12 w-12 rounded-full border-2 border-brand-primary overflow-hidden">
                     <img src="https://i.pravatar.cc/100?img=68" alt="You" />
                   </div>
                   <span className="text-xs text-white/60">You</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 cursor-pointer group">
                   <div className="h-12 w-12 rounded-full border border-dashed border-white/30 flex items-center justify-center bg-white/5 group-hover:border-brand-primary transition-colors">
                     <PlusIcon />
                   </div>
                   <span className="text-xs text-white/40 group-hover:text-white/80">Add</span>
                 </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
               <button onClick={() => setActiveStep(3)} className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:bg-gray-200">
                 Continue
               </button>
            </div>
          </SectionCard>

          {/* STEP 3: Vibe & Budget */}
          <SectionCard
            title="The Vibe & Budget"
            icon={<Wallet className="h-6 w-6" />}
            isActive={activeStep === 3}
            onClick={() => destination ? setActiveStep(3) : null}
          >
            {/* Travel Style */}
            <div className="mb-8">
              <label className="text-xs uppercase tracking-wider text-white/50 mb-4 block">What are you looking for? (Select multiple)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAVEL_STYLES.map((style) => {
                  const isSelected = styles.includes(style.id);
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={cn(
                        "relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300",
                        isSelected
                          ? "border-brand-primary bg-brand-primary/10"
                          : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", isSelected ? "bg-brand-primary text-black" : "bg-white/10 text-white/50")}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className={cn("font-medium", isSelected ? "text-brand-primary" : "text-white")}>{style.label}</h4>
                        <p className="text-xs text-white/40 mt-0.5">{style.desc}</p>
                      </div>
                      {isSelected && <Check className="absolute right-4 h-5 w-5 text-brand-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 mb-4 block">Expected Budget</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={cn(
                      "flex flex-col items-center text-center gap-2 rounded-xl border p-4 transition-all",
                      budget === b.id
                        ? "border-brand-secondary bg-brand-secondary/10"
                        : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <h4 className={cn("font-semibold", budget === b.id ? "text-brand-secondary" : "text-white")}>{b.label}</h4>
                    <p className="text-xs text-white/40">{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {activeStep === 3 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#071120]/80 p-6 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Trip to <span className="text-brand-primary">{destination || "..."}</span></p>
                <p className="text-xs text-white/50">{travelers} Travelers • {budget} budget • {styles.length} styles</p>
              </div>
              <button
                onClick={generateMagic}
                disabled={isGenerating}
                className="group relative flex h-14 w-64 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary font-bold text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-80 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Generating Magic...</span>
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Generate Itinerary
                  </span>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Loading Overlay */}
      <AnimatePresence>
         {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg/95 backdrop-blur-2xl"
            >
               <motion.div 
                 animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="relative mb-8 h-32 w-32"
               >
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-primary/30 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border-4 border-dashed border-brand-secondary/40 animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles className="h-10 w-10 text-white animate-pulse" />
                  </div>
               </motion.div>
               
               <h2 className="font-heading text-3xl font-bold text-white mb-2">Crafting your perfect trip...</h2>
               <div className="flex flex-col items-center text-brand-primary h-6 overflow-hidden">
                  <motion.div
                    animate={{ y: [0, -24, -48, -72] }}
                    transition={{ duration: 4, times: [0, 0.33, 0.66, 1] }}
                    className="flex flex-col items-center gap-2"
                  >
                     <span>Analyzing weather patterns in {destination}...</span>
                     <span>Finding the best culinary spots...</span>
                     <span>Aligning {travelers} traveler preferences...</span>
                     <span>Finalizing magic itinerary...</span>
                  </motion.div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

    </main>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}
