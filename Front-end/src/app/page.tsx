"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Users,
  Wallet,
  Compass,
  ArrowRight,
  Globe,
  Sparkles,
  Play,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Components ---

const GlassCard = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg",
      "transition-all duration-300 hover:bg-white/10 hover:border-brand-primary/50",
      "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const GlowingButton = ({
  children,
  className,
  variant = "primary",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 active:scale-95 px-8 py-4";
  const variants = {
    primary:
      "bg-gradient-to-r from-brand-primary to-[#2C9BB5] text-brand-bg hover:shadow-[0_0_20px_rgba(73,198,229,0.5)]",
    secondary:
      "bg-gradient-to-r from-brand-secondary to-brand-highlight text-white hover:shadow-[0_0_20px_rgba(255,138,61,0.5)]",
    outline:
      "border border-white/20 bg-transparent text-white hover:bg-white/5 backdrop-blur-md",
  };

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

// --- Page ---

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-bg font-sans text-brand-text">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-brand-primary/20 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-brand-secondary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[800px] rounded-full bg-brand-highlight/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-brand-bg/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-brand-primary" />
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Destinations", "Community", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white/70 hover:text-white">Log in</button>
            <GlowingButton variant="primary" className="px-5 py-2.5 text-sm">
              Start Planning
            </GlowingButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto mt-32 max-w-7xl px-6 pt-20 lg:pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-6 flex w-max items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm text-brand-primary backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Collaborative Planning</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Plan trips that feel{" "}
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-highlight bg-clip-text text-transparent">
              alive.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg text-white/60 md:text-xl"
          >
            Collaborate in real-time with friends, generate AI itineraries, split budgets seamlessly, and discover the world together in one beautifully crafted platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <GlowingButton className="group w-full sm:w-auto">
              Start Your First Loop
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </GlowingButton>
            <GlowingButton variant="outline" className="w-full sm:w-auto">
              <Play className="mr-2 h-4 w-4" /> Watch Demo
            </GlowingButton>
          </motion.div>
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative mt-20"
        >
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-brand-primary/20 to-transparent blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-brand-surface/80 p-2 backdrop-blur-xl md:p-4 shadow-2xl">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] bg-[#0A1628] relative">
               {/* Dummy Dashboard UI Placeholder */}
               <div className="absolute inset-0 flex flex-col p-6 md:p-8">
                  {/* Top bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <h3 className="font-heading text-2xl font-bold">Summer in Kyoto 🌸</h3>
                      <p className="text-sm text-white/50 mt-1">Oct 12 - Oct 24 • 4 Travelers</p>
                    </div>
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0A1628] bg-brand-surface flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Content area */}
                  <div className="mt-6 flex flex-1 gap-6">
                    <div className="w-1/3 flex flex-col gap-4">
                      <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-4">
                        <h4 className="font-medium text-white/80 mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-primary"/> Day 1: Arrival</h4>
                        <div className="space-y-3">
                           <div className="h-16 rounded-lg bg-white/5 p-3 flex items-center gap-3 border-l-2 border-brand-primary">
                             <div className="h-10 w-10 rounded-md bg-white/10" />
                             <div>
                               <div className="h-3 w-24 bg-white/20 rounded mb-2" />
                               <div className="h-2 w-16 bg-white/10 rounded" />
                             </div>
                           </div>
                           <div className="h-16 rounded-lg bg-white/5 p-3 flex items-center gap-3">
                             <div className="h-10 w-10 rounded-md bg-white/10" />
                             <div>
                               <div className="h-3 w-32 bg-white/20 rounded mb-2" />
                               <div className="h-2 w-20 bg-white/10 rounded" />
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/3 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                        <img 
                          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" 
                          alt="Kyoto Map" 
                          className="h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="h-12 w-12 rounded-full bg-brand-highlight/20 flex items-center justify-center animate-pulse">
                              <div className="h-4 w-4 rounded-full bg-brand-highlight" />
                           </div>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-white/5 bg-brand-surface py-32" id="features">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-5xl">
              Everything you need, <br />
              <span className="text-white/50">nothing you don't.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-8 w-8 text-brand-primary" />,
                title: "Multiplayer Planning",
                desc: "Live cursors, real-time syncing, and collaborative voting on itineraries.",
              },
              {
                icon: <Wallet className="h-8 w-8 text-brand-secondary" />,
                title: "Smart Budgeting",
                desc: "Split expenses, track costs, and settle up automatically with your group.",
              },
              {
                icon: <Compass className="h-8 w-8 text-brand-highlight" />,
                title: "AI Discoveries",
                desc: "Personalized hidden gems and local recommendations tailored to your vibe.",
              },
            ].map((feature, idx) => (
              <GlassCard
                key={idx}
                className="group relative overflow-hidden"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative z-10 mb-6 inline-flex rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  {feature.icon}
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Bento Grid Section */}
      <section className="py-32 px-6">
         <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
               {/* Large Hero Card */}
               <GlassCard className="md:col-span-2 md:row-span-2 flex flex-col justify-end relative overflow-hidden group p-0">
                  <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Travel Landscape" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
                  <div className="relative z-10 p-8 mt-auto">
                     <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-brand-primary/20 text-brand-primary backdrop-blur-md">Destinations</span>
                     <h3 className="text-3xl font-heading font-bold mb-2">Discover the Unseen</h3>
                     <p className="text-white/70 max-w-sm">Curated experiences from local experts, pushed straight to your itinerary.</p>
                  </div>
               </GlassCard>

               {/* Smaller stat card */}
               <GlassCard className="md:col-span-1 md:row-span-1 flex flex-col items-center justify-center text-center">
                 <div className="text-5xl font-heading font-bold text-brand-secondary mb-2">1M+</div>
                 <div className="text-white/60 text-sm">Trips Planned</div>
               </GlassCard>

               {/* Map integration card */}
               <GlassCard className="md:col-span-1 md:row-span-1 relative overflow-hidden p-0 group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                     <Map className="h-8 w-8 text-brand-highlight mb-auto" />
                     <div>
                       <h4 className="font-semibold text-lg">Interactive Maps</h4>
                       <p className="text-xs text-white/50 mt-1">Pin drops and routing built-in.</p>
                     </div>
                  </div>
               </GlassCard>

               {/* AI Feature Card */}
               <GlassCard className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-brand-surface to-brand-bg flex items-center">
                  <div className="flex-1 pr-8">
                     <h4 className="text-2xl font-heading font-bold mb-3 flex items-center gap-2"><Sparkles className="h-6 w-6 text-brand-primary"/> Magic Auto-Fill</h4>
                     <p className="text-white/60 text-sm">Paste a TikTok link or blog post, and we'll instantly extract the locations into your daily plan.</p>
                  </div>
               </GlassCard>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[150px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 font-heading text-5xl font-bold tracking-tight md:text-6xl">
            Ready to change how you travel?
          </h2>
          <p className="mb-10 text-xl text-white/60">
            Join thousands of travelers who have upgraded their planning experience.
          </p>
          <GlowingButton className="px-10 py-5 text-lg">
            Create Your First Trip — It's Free
          </GlowingButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-brand-bg py-12 text-center text-sm text-white/40">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-white/20" />
            <span className="font-heading text-xl font-bold text-white/40">
              TravelLoop
            </span>
          </div>
          <p>© 2026 TravelLoop Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
