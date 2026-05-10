"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Globe,
  Search,
  Bell,
  Settings,
  MapPin,
  Calendar,
  Users,
  Compass,
  Heart,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Map,
  Activity,
  Plus,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const FILTERS = ["All", "Upcoming", "Past", "Saved", "Trending", "Beach", "Mountains", "City", "Nature"];

const DESTINATIONS = [
  { id: 1, name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop", trips: 124 },
  { id: 2, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", trips: 89 },
  { id: 3, name: "Banff, Canada", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", trips: 210 },
  { id: 4, name: "Swiss Alps", image: "https://images.unsplash.com/photo-1531366936337-77ba9a69bbeb?q=80&w=2070&auto=format&fit=crop", trips: 156 },
  { id: 5, name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop", trips: 342 },
];

const COLLAB_TRIPS = [
  {
    id: 1,
    title: "Summer Eurotrip 🚄",
    date: "Jul 12 - Aug 05",
    location: "Europe",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
    progress: 75,
    members: ["10", "11", "12", "13"],
  },
  {
    id: 2,
    title: "Ski Weekend ❄️",
    date: "Dec 15 - Dec 18",
    location: "Aspen, CO",
    image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=2025&auto=format&fit=crop",
    progress: 30,
    members: ["14", "15"],
  },
];

const ACTIVITY_FEED = [
  { id: 1, user: "Sarah M.", action: "voted on", target: "Hotel Amalfi", time: "2h ago", avatar: "20" },
  { id: 2, user: "Alex K.", action: "added a destination", target: "Tokyo Tower", time: "4h ago", avatar: "21" },
  { id: 3, user: "Emma W.", action: "commented on", target: "Kyoto Itinerary", time: "1d ago", avatar: "22" },
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg", className)}>
    {children}
  </div>
);

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <main className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg pb-24">
      
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#071120]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="hidden font-heading text-2xl font-bold md:block">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>

          {/* Floating Search */}
          <div className="mx-4 flex w-full max-w-xl items-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 transition-all focus-within:border-brand-primary/50 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(73,198,229,0.2)]">
            <Search className="h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search destinations, friends, or loops..."
              className="ml-3 w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
            />
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-[10px] font-medium text-white/60">
              ⌘K
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
              <Bell className="h-5 w-5 text-white/70" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-highlight" />
            </button>
            <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-transparent transition-colors hover:border-brand-primary">
              <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Parallax Section */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm backdrop-blur-md mb-6"
          >
            <Sparkles className="h-4 w-4 text-brand-secondary" />
            <span>AI powered travel intelligence</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-5xl font-bold tracking-tight text-white md:text-7xl max-w-4xl"
          >
            Where are we going next, <span className="text-brand-primary">Alex?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-white/70 max-w-2xl"
          >
            You have 2 upcoming loops. 14 new activities have been suggested by your friends.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 relative z-10 -mt-10 space-y-12">
        
        {/* Quick Filters */}
        <div className="flex w-full items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeFilter === filter
                  ? "bg-brand-primary text-brand-bg shadow-[0_0_15px_rgba(73,198,229,0.3)]"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Active Collaborative Trips */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                  <Map className="h-6 w-6 text-brand-primary" /> Active Loops
                </h2>
                <button className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {COLLAB_TRIPS.map((trip) => (
                  <GlassCard key={trip.id} className="group overflow-hidden transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={trip.image} alt={trip.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
                      <button className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-brand-primary hover:text-brand-bg transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-heading text-xl font-bold text-white">{trip.title}</h3>
                        <p className="flex items-center gap-1 text-sm text-white/80">
                          <MapPin className="h-3 w-3" /> {trip.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <p className="flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="h-4 w-4" /> {trip.date}
                        </p>
                        {/* Avatar Stack */}
                        <div className="flex -space-x-3">
                          {trip.members.map((m, i) => (
                            <img key={i} src={`https://i.pravatar.cc/100?img=${m}`} className="h-8 w-8 rounded-full border-2 border-[#0A1628] object-cover" alt="Member" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-white/50">
                          <span>Planning Progress</span>
                          <span>{trip.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-brand-primary rounded-full" style={{ width: `${trip.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
                
                {/* Create New Loop Card */}
                <button className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 transition-all duration-300 hover:border-brand-primary/50 hover:bg-white/10 group">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">Create New Loop</h3>
                  <p className="text-sm text-white/50 mt-1">Start planning your next adventure</p>
                </button>
              </div>
            </section>

            {/* AI Recommendations */}
            <section className="relative overflow-hidden rounded-3xl border border-brand-secondary/30 bg-gradient-to-br from-[#0E2238] to-[#1A1625] p-8">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-secondary/20 blur-[80px]" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-brand-secondary mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">AI Discovery</span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-white mb-3">Hidden gems in Japan</h2>
                  <p className="text-white/60 max-w-md text-sm leading-relaxed">
                    Based on your "Summer Eurotrip" preferences, we found 5 secluded hot springs in Hokkaido that match your vibe. Perfect for a December getaway.
                  </p>
                  <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand-bg transition-transform hover:scale-105 active:scale-95">
                    Explore Magic Plan
                  </button>
                </div>
                
                {/* Visual Stack */}
                <div className="relative h-48 w-full md:w-64 shrink-0">
                   <img src="https://images.unsplash.com/photo-1542051812-f453a26d0e65?q=80&w=2070&auto=format&fit=crop" className="absolute right-0 top-0 h-40 w-48 rounded-xl object-cover shadow-2xl rotate-6 border border-white/20" alt="Japan" />
                   <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" className="absolute left-0 bottom-0 h-40 w-48 rounded-xl object-cover shadow-2xl -rotate-6 border border-white/20" alt="Japan 2" />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* Friend Activity Feed */}
            <GlassCard className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brand-highlight" /> Activity Feed
                </h2>
              </div>
              <div className="space-y-5">
                {ACTIVITY_FEED.map((feed) => (
                  <div key={feed.id} className="flex gap-4">
                    <img src={`https://i.pravatar.cc/100?img=${feed.avatar}`} className="h-10 w-10 rounded-full border border-white/10" alt={feed.user} />
                    <div>
                      <p className="text-sm text-white/80">
                        <span className="font-semibold text-white">{feed.user}</span> {feed.action} <span className="font-medium text-brand-primary">{feed.target}</span>
                      </p>
                      <p className="text-xs text-white/40 mt-1">{feed.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-xl bg-white/5 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                View All Activity
              </button>
            </GlassCard>

            {/* Trending Destinations Vertical List */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-brand-primary" /> Trending Now
              </h2>
              {DESTINATIONS.slice(0, 3).map((dest, idx) => (
                <div key={dest.id} className="group relative flex h-24 w-full cursor-pointer items-center overflow-hidden rounded-xl border border-white/10">
                  <img src={dest.image} className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60" alt={dest.name} />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/90 to-transparent" />
                  <div className="relative z-10 px-4 flex w-full items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-primary">#{idx + 1}</span>
                      <h4 className="font-heading font-bold text-white text-lg">{dest.name}</h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-white/60">{dest.trips} trips</span>
                      <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Horizontal Destinations Carousel */}
        <section className="pt-8 pb-12 border-t border-white/10">
           <div className="mb-8 flex items-center justify-between">
             <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
               <Compass className="h-6 w-6 text-brand-secondary" /> Recommended Places
             </h2>
             <div className="flex gap-2">
               <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                 <ArrowLeft className="h-5 w-5" />
               </button>
               <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                 <ChevronRight className="h-5 w-5" />
               </button>
             </div>
           </div>

           <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
             {DESTINATIONS.map((dest) => (
               <div key={dest.id} className="relative h-72 w-64 shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl group">
                 <img src={dest.image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dest.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                 <div className="absolute bottom-6 left-6">
                   <h3 className="font-heading text-xl font-bold text-white mb-1">{dest.name}</h3>
                   <div className="flex items-center gap-1 text-xs text-white/70">
                     <Users className="h-3 w-3" /> {dest.trips} planners online
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </section>

      </div>
    </main>
  );
}
