"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Receipt,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Building,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

const BILLING_SUMMARY = {
  totalSpent: 4250.00,
  taxPaid: 340.50,
  pendingSplit: 250.00,
};

const INVOICES = [
  { id: "INV-2026-042", vendor: "Hoshinoya Kyoto", category: "Accommodation", date: "Oct 12, 2026", amount: 1200.00, status: "paid", tax: 120.00 },
  { id: "INV-2026-043", vendor: "Japan Airlines", category: "Transport", date: "Oct 10, 2026", amount: 850.00, status: "paid", tax: 85.00 },
  { id: "INV-2026-044", vendor: "Kitcho Arashiyama", category: "Dining", date: "Oct 13, 2026", amount: 450.00, status: "pending", tax: 45.00 },
  { id: "INV-2026-045", vendor: "JR Rail Pass (7 Day)", category: "Transport", date: "Oct 01, 2026", amount: 210.00, status: "paid", tax: 21.00 },
];

const CONTRIBUTORS = [
  { name: "Alex T.", role: "Payer", amount: 2450.00, avatar: "68", status: "Settled" },
  { name: "Sarah M.", role: "Contributor", amount: 1200.00, avatar: "21", status: "Settled" },
  { name: "Emma W.", role: "Contributor", amount: 600.00, avatar: "22", status: "Pending" },
];

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-[#0E2238]/40 backdrop-blur-xl shadow-2xl", className)}>
    {children}
  </div>
);

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <main className="min-h-screen w-full bg-[#071120] font-sans text-brand-text selection:bg-brand-primary selection:text-[#071120] pb-24">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-brand-primary/5 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px]" />
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
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors border border-white/10">
               <Download className="h-4 w-4" /> Export CSV
             </button>
             <div className="h-10 w-10 rounded-full border border-white/20 bg-[url('https://i.pravatar.cc/150?img=68')] bg-cover" />
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-12">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
              <Receipt className="h-4 w-4" /> Billing & Invoices
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">Financial Records</h1>
            <p className="text-white/60">Manage your trip expenses, download tax receipts, and track split payments.</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
             {["Invoices", "Tax Breakdown", "Splits"].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab.toLowerCase())}
                 className={cn(
                   "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                   activeTab === tab.toLowerCase()
                     ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                     : "text-white/60 hover:text-white"
                 )}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <GlassCard className="p-6 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/5 blur-[20px] group-hover:bg-brand-primary/10 transition-colors" />
              <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Total Billed</h3>
              <div className="text-4xl font-heading font-bold text-white">${BILLING_SUMMARY.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
           </GlassCard>
           <GlassCard className="p-6 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/5 blur-[20px] group-hover:bg-brand-secondary/10 transition-colors" />
              <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Total Tax (VAT)</h3>
              <div className="text-4xl font-heading font-bold text-white">${BILLING_SUMMARY.taxPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
           </GlassCard>
           <GlassCard className="p-6 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Pending Splits</h3>
                <div className="text-4xl font-heading font-bold text-brand-highlight">${BILLING_SUMMARY.pendingSplit.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary/10 py-2.5 text-sm font-bold text-brand-primary hover:bg-brand-primary/20 transition-colors border border-brand-primary/20">
                <CreditCard className="h-4 w-4" /> Request Payment
              </button>
           </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Table Area */}
          <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden">
               <div className="border-b border-white/10 bg-black/20 p-6 flex items-center justify-between">
                 <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                   <FileText className="h-5 w-5 text-brand-primary" /> Invoice History
                 </h2>
                 <button className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline">
                   Filter <ChevronDown className="h-4 w-4" />
                 </button>
               </div>

               {/* Elegant Table */}
               <div className="w-full overflow-x-auto custom-scrollbar">
                 <table className="w-full text-left text-sm text-white/80">
                   <thead className="bg-white/5 text-xs uppercase text-white/50">
                     <tr>
                       <th className="px-6 py-4 font-medium">Invoice / Vendor</th>
                       <th className="px-6 py-4 font-medium">Date</th>
                       <th className="px-6 py-4 font-medium">Amount</th>
                       <th className="px-6 py-4 font-medium">Status</th>
                       <th className="px-6 py-4 text-right font-medium">Receipt</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {INVOICES.map((inv) => (
                       <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 border border-white/10">
                               <Building className="h-4 w-4 text-white/50" />
                             </div>
                             <div>
                               <div className="font-bold text-white mb-0.5">{inv.vendor}</div>
                               <div className="text-[10px] text-white/50">{inv.id} • {inv.category}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-white/60">{inv.date}</td>
                         <td className="px-6 py-4 whitespace-nowrap font-medium text-white">${inv.amount.toFixed(2)}</td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           {inv.status === "paid" ? (
                             <span className="flex w-max items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-400 border border-green-500/20">
                               <CheckCircle2 className="h-3 w-3" /> Paid
                             </span>
                           ) : (
                             <span className="flex w-max items-center gap-1.5 rounded-full bg-brand-highlight/10 px-2.5 py-1 text-xs font-bold text-brand-highlight border border-brand-highlight/20">
                               <Clock className="h-3 w-3" /> Pending
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-brand-primary hover:text-[#071120] transition-colors">
                             <Download className="h-4 w-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </GlassCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Contributors Breakdown */}
            <GlassCard className="p-6">
               <h2 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Globe className="h-5 w-5 text-purple-400" /> Contributor Details
               </h2>
               <div className="space-y-4">
                 {CONTRIBUTORS.map((c, i) => (
                   <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3">
                      <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/100?img=${c.avatar}`} className="h-10 w-10 rounded-full border border-white/20" alt={c.name} />
                        <div>
                          <p className="text-sm font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-white/50">{c.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">${c.amount.toFixed(2)}</p>
                        <p className={cn("text-[10px] font-bold mt-0.5", c.status === "Settled" ? "text-green-400" : "text-brand-highlight")}>
                          {c.status}
                        </p>
                      </div>
                   </div>
                 ))}
               </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6 bg-gradient-to-br from-[#0E2238]/80 to-[#071120]/80">
               <h2 className="font-heading text-lg font-bold text-white mb-4">Need Help?</h2>
               <p className="text-sm text-white/60 mb-6">If you spot a discrepancy in a split or need to dispute an invoice, contact support.</p>
               
               <button className="flex w-full items-center justify-between rounded-xl bg-white text-[#071120] px-4 py-3 text-sm font-bold hover:bg-white/90 transition-colors group">
                 Open Dispute
                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </button>
            </GlassCard>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}
