"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Calendar,
  Clock,
  MapPin,
  Plane,
  Bed,
  Coffee,
  MessageSquare,
  MoreHorizontal,
  GripVertical,
  Plus,
  CloudSun,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Camera,
  Utensils,
  Mountain
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const WEATHER = [
  { day: "Mon", temp: "22°", icon: <CloudSun className="h-5 w-5 text-yellow-400" /> },
  { day: "Tue", temp: "24°", icon: <CloudSun className="h-5 w-5 text-yellow-400" /> },
  { day: "Wed", temp: "19°", icon: <CloudSun className="h-5 w-5 text-gray-400" /> },
];

const COLLABORATORS = ["10", "11", "12"];

const ITINERARY_DATA = [
  {
    id: "day-1",
    date: "Oct 12, 2026",
    title: "Day 1: Arrival & Exploration",
    isOpen: true,
    items: [
      {
        id: "item-1",
        type: "transport",
        time: "10:00 AM",
        title: "Flight JL001 to Kyoto",
        subtitle: "Terminal 2, Gate 14",
        icon: Plane,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
      },
      {
        id: "item-2",
        type: "hotel",
        time: "02:00 PM",
        title: "Check-in: Hoshinoya Kyoto",
        subtitle: "Arashiyama Riverside",
        icon: Bed,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        border: "border-brand-primary/20",
      },
      {
        id: "item-3",
        type: "activity",
        time: "04:30 PM",
        title: "Walk through Bamboo Grove",
        subtitle: "Photography & light trekking",
        icon: Camera,
        color: "text-brand-secondary",
        bg: "bg-brand-secondary/10",
        border: "border-brand-secondary/20",
        comments: 2,
      },
      {
        id: "item-4",
        type: "food",
        time: "07:30 PM",
        title: "Dinner at Kitcho Arashiyama",
        subtitle: "Kaiseki traditional meal",
        icon: Utensils,
        color: "text-brand-highlight",
        bg: "bg-brand-highlight/10",
        border: "border-brand-highlight/20",
      },
    ]
  },
  {
    id: "day-2",
    date: "Oct 13, 2026",
    title: "Day 2: Temples & Shrines",
    isOpen: true,
    items: [
      {
        id: "item-5",
        type: "activity",
        time: "09:00 AM",
        title: "Fushimi Inari Shrine",
        subtitle: "Beat the crowds, 2hr hike",
        icon: Mountain,
        color: "text-brand-secondary",
        bg: "bg-brand-secondary/10",
        border: "border-brand-secondary/20",
      },
      {
        id: "item-6",
        type: "food",
        time: "12:30 PM",
        title: "Nishiki Market Tour",
        subtitle: "Street food sampling",
        icon: Coffee,
        color: "text-brand-highlight",
        bg: "bg-brand-highlight/10",
        border: "border-brand-highlight/20",
        comments: 5,
      },
    ]
  }
];

// --- Components ---

export default function ItineraryPage() {
  const [days, setDays] = useState(ITINERARY_DATA);

  const toggleDay = (id: string) => {
    setDays(days.map(d => d.id === id ? { ...d, isOpen: !d.isOpen } : d));
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-brand-bg font-sans text-brand-text selection:bg-brand-primary selection:text-brand-bg">
      
      {/* Left Pane: Itinerary Builder */}
      <div className="relative flex h-full w-full flex-col lg:w-3/5 xl:w-2/3 border-r border-white/10 bg-[#071120]/95">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-white/5 px-8 py-6 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-1">
              <Sparkles className="h-4 w-4" /> Magical Trip to
            </div>
            <h1 className="font-heading text-3xl font-bold text-white">Kyoto, Japan</h1>
            <p className="text-sm text-white/50 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Oct 12 - Oct 24 • 12 Days
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {COLLABORATORS.map((m, i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${m}`} className="h-8 w-8 rounded-full border-2 border-[#071120] object-cover" alt="Collaborator" />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#071120] bg-white/10 text-xs font-bold hover:bg-brand-primary transition-colors cursor-pointer">
                +
              </div>
            </div>
            <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105">
              Share
            </button>
          </div>
        </header>

        {/* Timeline Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          
          {days.map((day, dayIndex) => (
            <div key={day.id} className="mb-10">
              
              {/* Day Header */}
              <div 
                className="group flex cursor-pointer items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 border border-white/5 hover:border-white/10"
                onClick={() => toggleDay(day.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary">
                    <span className="text-xs font-bold uppercase">{day.date.split(' ')[0]}</span>
                    <span className="text-lg font-black leading-none">{day.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white">{day.title}</h2>
                    <p className="text-sm text-white/50">{day.items.length} activities planned</p>
                  </div>
                </div>
                <button className="text-white/40 group-hover:text-white transition-colors">
                  {day.isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                </button>
              </div>

              {/* Day Timeline Items */}
              <AnimatePresence>
                {day.isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pl-6 overflow-hidden"
                  >
                    <div className="relative border-l-2 border-white/10 ml-6 space-y-8 pb-4">
                      {day.items.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.div 
                            key={item.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative flex items-start gap-6 group"
                          >
                            {/* Timeline Dot & Icon */}
                            <div className={cn("absolute -left-[21px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#071120]", item.bg, item.color)}>
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Item Content Card */}
                            <div className={cn("ml-10 w-full rounded-2xl border bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:-translate-y-1 shadow-lg", item.border)}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40">
                                    <Clock className="h-3.5 w-3.5" /> {item.time}
                                  </div>
                                  <div className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", item.bg, item.color)}>
                                    {item.type}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-white/40 hover:text-white"><MessageSquare className="h-4 w-4" /></button>
                                  <button className="text-white/40 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button>
                                  <button className="cursor-grab text-white/40 hover:text-white active:cursor-grabbing"><GripVertical className="h-4 w-4" /></button>
                                </div>
                              </div>
                              
                              <h3 className="mt-2 font-heading text-lg font-bold text-white">{item.title}</h3>
                              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/60">
                                <MapPin className="h-3.5 w-3.5" /> {item.subtitle}
                              </p>

                              {item.comments && (
                                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/5 p-2 border border-white/5">
                                  <div className="flex -space-x-1">
                                    <img src={`https://i.pravatar.cc/100?img=11`} className="h-5 w-5 rounded-full border border-black" alt="C" />
                                    <img src={`https://i.pravatar.cc/100?img=12`} className="h-5 w-5 rounded-full border border-black" alt="C" />
                                  </div>
                                  <span className="text-xs text-white/50">{item.comments} comments on this block</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Add Activity Button */}
                      <div className="relative flex items-center gap-6 ml-10 mt-8">
                         <div className="absolute -left-[51px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#071120] bg-white/5 text-white/40">
                           <Plus className="h-5 w-5" />
                         </div>
                         <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-transparent py-4 text-sm font-medium text-white/50 hover:border-brand-primary/50 hover:text-brand-primary transition-colors">
                           <Plus className="h-4 w-4" /> Add Activity
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>
      </div>

      {/* Right Pane: Interactive Map & Tools */}
      <div className="hidden h-full flex-col lg:flex lg:w-2/5 xl:w-1/3 bg-black relative">
        
        {/* Cinematic Map Layer */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map view" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071120]/80 via-transparent to-[#071120]" />
          
          {/* Fake Map Pins */}
          <div className="absolute top-[30%] left-[40%] flex flex-col items-center group cursor-pointer animate-bounce">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary shadow-[0_0_15px_rgba(73,198,229,0.5)]">
              <Bed className="h-4 w-4 text-black" />
            </div>
          </div>
          <div className="absolute top-[45%] left-[60%] flex flex-col items-center group cursor-pointer">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary shadow-[0_0_15px_rgba(255,138,61,0.5)] transition-transform group-hover:scale-125">
              <Camera className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Floating Widgets Layer */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          
          {/* Top: Weather & Actions */}
          <div className="flex gap-4">
            <div className="flex flex-1 items-center justify-between rounded-2xl border border-white/10 bg-[#071120]/80 p-4 backdrop-blur-xl shadow-2xl">
              <div>
                <p className="text-xs font-bold uppercase text-brand-primary mb-1">Kyoto Weather</p>
                <div className="flex items-center gap-3">
                  <CloudSun className="h-8 w-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">22°C</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                {WEATHER.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                    <span className="w-6">{w.day}</span>
                    {w.icon}
                    <span>{w.temp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: AI Suggestions */}
          <div className="rounded-3xl border border-brand-primary/30 bg-gradient-to-b from-[#071120]/90 to-[#0A1628]/95 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              <h3 className="font-heading text-lg font-bold text-white">Magic Suggestions</h3>
            </div>
            
            <div className="space-y-4">
              <div className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-brand-primary/50">
                <h4 className="font-bold text-white text-sm">Add Matcha Tea Ceremony</h4>
                <p className="text-xs text-white/60 mt-1 line-clamp-2">You have a free 2-hour window on Day 2 near Gion. This highly rated experience fits perfectly.</p>
                <button className="mt-3 text-xs font-bold text-brand-primary group-hover:underline">+ Add to Day 2</button>
              </div>
              <div className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-brand-secondary/50">
                <h4 className="font-bold text-white text-sm">Dinner Conflict Warning</h4>
                <p className="text-xs text-white/60 mt-1">Kitcho Arashiyama requires 3 weeks advance booking. Shall I find alternatives?</p>
                <button className="mt-3 text-xs font-bold text-brand-secondary group-hover:underline">View Alternatives</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
