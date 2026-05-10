"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Receipt,
  Users,
  TrendingUp,
  PieChart,
  Activity,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const OVERVIEW = {
  budget: 5000,
  spent: 3240,
  remaining: 1760,
  currency: "$",
};

const EXPENSES = [
  { id: 1, title: "Hoshinoya Kyoto (3 Nights)", category: "Accommodation", amount: 1200, paidBy: "You", date: "Oct 12", split: "Equal", icon: Wallet, color: "text-brand-primary", bg: "bg-brand-primary/10" },
  { id: 2, title: "Flights - JL001", category: "Transport", amount: 850, paidBy: "Alex K.", date: "Oct 10", split: "Equal", icon: PlaneIcon, color: "text-brand-secondary", bg: "bg-brand-secondary/10" },
  { id: 3, title: "Kitcho Arashiyama Dinner", category: "Food & Dining", amount: 450, paidBy: "Sarah M.", date: "Oct 13", split: "Custom", icon: UtensilsIcon, color: "text-brand-highlight", bg: "bg-brand-highlight/10" },
  { id: 4, title: "Temple Entry Fees", category: "Activities", amount: 45, paidBy: "You", date: "Oct 14", split: "Equal", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const WHO_OWES_WHO = [
  { id: 1, from: "Alex K.", fromAvatar: "20", to: "You", toAvatar: "68", amount: 250 },
  { id: 2, from: "Sarah M.", fromAvatar: "21", to: "You", toAvatar: "68", amount: 120 },
  { id: 3, from: "You", fromAvatar: "68", to: "Emma W.", toAvatar: "22", amount: 45 },
];

const CATEGORY_STATS = [
  { name: "Accommodation", value: 45, color: "bg-brand-primary" },
  { name: "Transport", value: 30, color: "bg-brand-secondary" },
  { name: "Food", value: 15, color: "bg-brand-highlight" },
  { name: "Activities", value: 10, color: "bg-purple-400" },
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-[#0E2238]/40 backdrop-blur-xl", className)}>
    {children}
  </div>
);

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const progressPercentage = (OVERVIEW.spent / OVERVIEW.budget) * 100;

  return (
    <main className="min-h-screen w-full bg-[#071120] font-sans text-brand-text selection:bg-brand-primary selection:text-[#071120] pb-24">
      
      {/* Immersive Glowing Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] h-[600px] w-[800px] rounded-full bg-brand-primary/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[600px] rounded-full bg-brand-secondary/5 blur-[120px]" />
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

          {/* Context Switcher */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {["Overview", "Expenses", "Balances", "Analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                  activeTab === tab.toLowerCase()
                    ? "bg-brand-primary text-[#071120] shadow-[0_0_15px_rgba(73,198,229,0.3)]"
                    : "text-white/60 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <button className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/30 bg-white/5 text-white hover:border-brand-primary hover:text-brand-primary transition-colors">
               <Plus className="h-5 w-5" />
             </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-12">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-2">
              <Activity className="h-4 w-4" /> Finance Analytics
            </div>
            <h1 className="font-heading text-5xl font-bold text-white mb-2">Kyoto Trip Ledger</h1>
            <p className="text-white/60 text-lg">Track expenses, split bills, and manage budgets collaboratively.</p>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <GlassCard className="p-8 relative overflow-hidden group">
            <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full bg-brand-primary/20 blur-[40px] group-hover:bg-brand-primary/30 transition-colors" />
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">Total Spent</h3>
            <div className="flex items-end gap-2">
              <span className="font-heading text-5xl font-bold text-white">{OVERVIEW.currency}{OVERVIEW.spent.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-brand-highlight">
              <ArrowUpRight className="h-4 w-4" /> <span>+$450 since yesterday</span>
            </div>
          </GlassCard>

          <GlassCard className="p-8 relative overflow-hidden group">
             <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full bg-brand-secondary/20 blur-[40px] group-hover:bg-brand-secondary/30 transition-colors" />
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">Remaining Budget</h3>
            <div className="flex items-end gap-2">
              <span className="font-heading text-5xl font-bold text-white">{OVERVIEW.currency}{OVERVIEW.remaining.toLocaleString()}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>{progressPercentage.toFixed(0)}% Utilized</span>
                <span>{OVERVIEW.currency}{OVERVIEW.budget.toLocaleString()} Total</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary" 
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 relative overflow-hidden flex flex-col justify-between">
             <div>
               <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <Users className="h-4 w-4" /> Your Balance
               </h3>
               <div className="flex items-end gap-2">
                 <span className="font-heading text-4xl font-bold text-brand-primary">+ {OVERVIEW.currency}325</span>
               </div>
               <p className="text-xs text-white/50 mt-2">You are owed money by the group.</p>
             </div>
             <button className="w-full mt-4 rounded-xl bg-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors">
               Settle Up
             </button>
          </GlassCard>

        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Area (Charts & Split) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Animated Burn Rate Chart */}
            <GlassCard className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-secondary" /> Daily Burn Rate
                </h2>
                <div className="flex gap-2">
                   <span className="flex items-center gap-1 text-xs text-white/50"><span className="h-2 w-2 rounded-full bg-brand-primary"></span> Spent</span>
                   <span className="flex items-center gap-1 text-xs text-white/50"><span className="h-2 w-2 rounded-full bg-white/20"></span> Projected</span>
                </div>
              </div>
              
              {/* CSS Driven Line Chart Visual Simulation */}
              <div className="relative h-64 w-full flex items-end justify-between px-2 pt-10 pb-6 border-b border-white/10">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                  {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-white/5" />)}
                </div>

                {/* Simulated SVG Graph Line */}
                <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full overflow-visible preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#49C6E5" />
                      <stop offset="100%" stopColor="#FF8A3D" />
                    </linearGradient>
                    <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(73,198,229,0.3)" />
                      <stop offset="100%" stopColor="rgba(73,198,229,0)" />
                    </linearGradient>
                  </defs>
                  
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M 0,80 Q 15,60 25,70 T 50,40 T 75,50 T 100,20" 
                    fill="none" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="3" 
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_8px_rgba(73,198,229,0.5)]"
                  />
                  <motion.path 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    d="M 0,80 Q 15,60 25,70 T 50,40 T 75,50 T 100,20 L 100,100 L 0,100 Z" 
                    fill="url(#fillGrad)" 
                  />
                </svg>
                
                {/* Points & Tooltips */}
                {[
                  { x: "Oct 10", val: 80 }, { x: "Oct 11", val: 70 }, { x: "Oct 12", val: 40 }, 
                  { x: "Oct 13", val: 50 }, { x: "Oct 14", val: 20 }
                ].map((pt, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center group w-full">
                     <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded text-xs border border-brand-primary text-white whitespace-nowrap">
                       ${Math.floor((100 - pt.val) * 12)}
                     </div>
                     <div className={cn("h-3 w-3 rounded-full border-2 border-[#071120] bg-brand-primary shadow-[0_0_10px_rgba(73,198,229,0.8)] transition-transform group-hover:scale-150 cursor-pointer")} style={{ marginBottom: `${pt.val}%` }} />
                     <div className="absolute -bottom-6 text-[10px] text-white/50">{pt.x}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Balances / Who Owes Who */}
            <GlassCard className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-primary" /> Group Balances
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {WHO_OWES_WHO.map((split) => (
                  <div key={split.id} className="relative flex flex-col justify-between rounded-2xl border border-white/5 bg-black/20 p-5">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex flex-col items-center gap-1">
                         <img src={`https://i.pravatar.cc/100?img=${split.fromAvatar}`} className="h-10 w-10 rounded-full border border-white/20" alt={split.from} />
                         <span className="text-[10px] text-white/60 truncate w-12 text-center">{split.from}</span>
                       </div>
                       
                       <div className="flex flex-col items-center px-2">
                         <span className="text-sm font-bold text-white mb-1">${split.amount}</span>
                         <div className="relative h-px w-12 bg-brand-primary/30">
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-4 border-transparent border-l-brand-primary" />
                         </div>
                       </div>

                       <div className="flex flex-col items-center gap-1">
                         <img src={`https://i.pravatar.cc/100?img=${split.toAvatar}`} className="h-10 w-10 rounded-full border border-white/20" alt={split.to} />
                         <span className="text-[10px] text-white/60 truncate w-12 text-center">{split.to}</span>
                       </div>
                    </div>
                    
                    <button className="w-full rounded-lg bg-white/5 py-2 text-xs font-semibold text-white hover:bg-brand-primary hover:text-black transition-colors">
                      Record Payment
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* Right Area (Category Breakdown & Recent Expenses) */}
          <div className="space-y-6">
            
            {/* Category Breakdown */}
            <GlassCard className="p-6">
               <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" /> By Category
                </h2>
              </div>
              
              {/* Fake Donut Chart via Conic Gradient */}
              <div className="flex flex-col items-center justify-center mb-8">
                 <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#49C6E5_0%_45%,_#FF8A3D_45%_75%,_#FF6B6B_75%_90%,_#c084fc_90%_100%)] shadow-[0_0_30px_rgba(73,198,229,0.2)]">
                   <div className="absolute inset-4 rounded-full bg-[#0E2238] flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white">$3.2k</span>
                      <span className="text-[10px] text-white/50 uppercase">Total</span>
                   </div>
                 </div>
              </div>

              <div className="space-y-3">
                 {CATEGORY_STATS.map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className={cn("h-3 w-3 rounded-sm", stat.color)} />
                       <span className="text-sm text-white/70">{stat.name}</span>
                     </div>
                     <span className="text-sm font-bold text-white">{stat.value}%</span>
                   </div>
                 ))}
              </div>
            </GlassCard>

            {/* Recent Expenses List */}
            <GlassCard className="p-6">
               <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-brand-primary" /> Recent Expenses
                </h2>
                <button className="text-xs text-brand-primary hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {EXPENSES.map((expense) => {
                  const Icon = expense.icon;
                  return (
                    <div key={expense.id} className="group flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3 hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", expense.bg, expense.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-none mb-1">{expense.title}</h4>
                          <p className="text-[10px] text-white/50">Paid by {expense.paidBy} • {expense.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-bold text-white">${expense.amount}</span>
                        <span className="text-[10px] text-white/40">{expense.split} split</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </main>
  );
}

// Inline Icons for simplicity
function PlaneIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1 1 2 4 4 2 1-1-1-3 3-3 4 6 1.2-1.2c.4-.2.7-.6.6-1.1Z"/></svg>
}

function UtensilsIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
}
