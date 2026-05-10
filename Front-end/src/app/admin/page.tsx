"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  TrendingUp,
  Activity,
  Server,
  MapPin,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const KPIS = [
  { label: "Active Users", value: "142.4K", trend: "+12.5%", isUp: true, icon: Users, color: "text-brand-primary" },
  { label: "Active Loops", value: "84.2K", trend: "+8.2%", isUp: true, icon: Globe, color: "text-purple-400" },
  { label: "Monthly Revenue", value: "$428.5K", trend: "+15.3%", isUp: true, icon: DollarSign, color: "text-brand-secondary" },
  { label: "API Latency", value: "42ms", trend: "-2.4%", isUp: false, icon: Zap, color: "text-brand-highlight" },
];

const DESTINATIONS = [
  { name: "Kyoto, Japan", count: "12,450", percentage: 85, color: "bg-brand-primary" },
  { name: "Amalfi Coast, Italy", count: "9,230", percentage: 65, color: "bg-brand-secondary" },
  { name: "Bali, Indonesia", count: "8,100", percentage: 55, color: "bg-brand-highlight" },
  { name: "Swiss Alps", count: "6,800", percentage: 45, color: "bg-purple-400" },
];

const SYSTEM_HEALTH = [
  { service: "Main Database", status: "Operational", uptime: "99.99%" },
  { service: "AI Recommendation Engine", status: "Operational", uptime: "99.95%" },
  { service: "Image CDN", status: "Degraded", uptime: "98.20%" },
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/5 bg-[#050B14]/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative", className)}>
    {children}
  </div>
);

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("30D");

  return (
    <main className="min-h-screen w-full bg-[#03070E] font-sans text-brand-text selection:bg-brand-primary selection:text-[#03070E] pb-24">
      
      {/* Deep Cyber Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-brand-primary/5 blur-[150px]" />
        <div className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full bg-brand-secondary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] h-[700px] w-[700px] rounded-full bg-purple-500/5 blur-[150px]" />
      </div>

      {/* Admin Nav */}
      <nav className="relative z-10 border-b border-white/5 bg-[#050B14]/50 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-primary text-black">
                <Globe className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-widest text-white uppercase">
                Trave<span className="text-brand-primary">Loop</span>
              </span>
            </Link>
            
            <div className="hidden md:flex gap-6 text-sm font-medium text-white/50">
              <span className="text-white">Overview</span>
              <span className="hover:text-white cursor-pointer transition-colors">Audience</span>
              <span className="hover:text-white cursor-pointer transition-colors">Financials</span>
              <span className="hover:text-white cursor-pointer transition-colors">System</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-brand-primary">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
               </span>
               SYSTEM ONLINE
             </div>
             <img src={`https://i.pravatar.cc/100?img=68`} className="h-8 w-8 rounded border border-white/20" alt="Admin" />
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-10">
        
        {/* Header & Time Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white tracking-tight mb-1">Command Center</h1>
            <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Global Telemetry & Analytics</p>
          </div>
          
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
            {["24H", "7D", "30D", "YTD"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-bold transition-all",
                  timeRange === t
                    ? "bg-brand-primary text-black"
                    : "text-white/60 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {KPIS.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <GlassCard key={idx} className="p-6 group">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[20px]" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-white/50 uppercase tracking-widest">{kpi.label}</span>
                  <Icon className={cn("h-4 w-4", kpi.color)} />
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-heading text-3xl font-bold text-white">{kpi.value}</span>
                  <div className={cn("flex items-center gap-1 text-xs font-bold", kpi.isUp ? "text-brand-primary" : "text-brand-highlight")}>
                    {kpi.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.trend}
                  </div>
                </div>
                {/* Mini Sparkline Simulation */}
                <div className="mt-4 h-8 w-full border-b border-white/5 relative overflow-hidden">
                   <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                        d={kpi.isUp ? "M0,80 Q25,70 50,40 T100,10" : "M0,20 Q25,30 50,60 T100,90"}
                        fill="none" 
                        stroke={kpi.isUp ? "#49C6E5" : "#FF8A3D"} 
                        strokeWidth="4" 
                        vectorEffect="non-scaling-stroke"
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                   </svg>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Main Growth Chart */}
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-8">
               <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-brand-primary" /> Platform Growth
               </h2>
               <MoreHorizontal className="h-5 w-5 text-white/30 cursor-pointer hover:text-white" />
            </div>
            
            <div className="relative h-72 w-full flex items-end justify-between px-2 pt-10 pb-6 border-b border-white/5">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                {[1,2,3,4,5].map(i => <div key={i} className="w-full border-t border-white/5 border-dashed" />)}
              </div>
              
              <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full overflow-visible preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 100">
                 <defs>
                   <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="rgba(73,198,229,0.5)" />
                     <stop offset="100%" stopColor="rgba(73,198,229,0)" />
                   </linearGradient>
                 </defs>
                 <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    d="M 0,90 C 20,80 30,50 50,40 S 80,30 100,10" 
                    fill="none" 
                    stroke="#49C6E5" 
                    strokeWidth="3" 
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_10px_rgba(73,198,229,0.8)]"
                 />
                 <motion.path 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    d="M 0,90 C 20,80 30,50 50,40 S 80,30 100,10 L 100,100 L 0,100 Z" 
                    fill="url(#growthGrad)" 
                 />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-3 font-mono">
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
            </div>
          </GlassCard>

          {/* Destination Heatmap (Simulated) */}
          <GlassCard className="p-6 flex flex-col">
            <h2 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Globe className="h-5 w-5 text-brand-secondary" /> Active Heatmap
            </h2>
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#0A1628] border border-white/5 min-h-[250px]">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity grayscale" />
               <div className="absolute inset-0 bg-[#0A1628]/60 mix-blend-multiply" />
               
               {/* Glowing Dots */}
               <div className="absolute top-[40%] left-[75%] h-3 w-3 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(73,198,229,1)]">
                 <div className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-50" />
               </div>
               <div className="absolute top-[30%] left-[50%] h-2 w-2 rounded-full bg-brand-secondary shadow-[0_0_10px_rgba(255,138,61,1)]">
                 <div className="absolute inset-0 rounded-full bg-brand-secondary animate-ping opacity-50" />
               </div>
               <div className="absolute top-[45%] left-[20%] h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,1)]" />
               
               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                 <p className="text-[10px] font-mono text-brand-primary uppercase tracking-wider">High Density: APAC</p>
               </div>
            </div>
          </GlassCard>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Destinations */}
          <GlassCard className="p-6">
             <h2 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
               <MapPin className="h-5 w-5 text-white" /> Trending Hubs
            </h2>
            <div className="space-y-5">
              {DESTINATIONS.map((dest, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{dest.name}</span>
                    <span className="text-xs text-white/50">{dest.count} loops</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${dest.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full transition-colors", dest.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* System Health */}
          <GlassCard className="p-6">
             <h2 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Server className="h-5 w-5 text-white" /> System Health
            </h2>
            <div className="space-y-3">
              {SYSTEM_HEALTH.map((sys, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className={cn(
                       "h-2 w-2 rounded-full",
                       sys.status === "Operational" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-brand-highlight shadow-[0_0_8px_rgba(255,107,107,0.6)] animate-pulse"
                     )} />
                     <span className="text-sm font-medium text-white">{sys.service}</span>
                  </div>
                  <div className="text-right">
                    <span className={cn("block text-xs font-bold", sys.status === "Operational" ? "text-green-400" : "text-brand-highlight")}>{sys.status}</span>
                    <span className="text-[10px] text-white/40 font-mono">Uptime: {sys.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-dashed border-white/20 py-3 text-xs font-bold text-white/50 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest">
              View Full Logs
            </button>
          </GlassCard>

        </div>
      </div>
    </main>
  );
}
