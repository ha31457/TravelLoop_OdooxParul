"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  MoreHorizontal,
  Play,
  TrendingUp,
  Compass,
  Plus,
  Search,
  Users,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Dummy Data ---

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  location: string;
  image: string;
  type: "image" | "video";
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  height: string; // For Masonry
}

const POSTS: Post[] = [
  {
    id: "1",
    user: { name: "Elena Rivers", username: "@elenatravels", avatar: "68" },
    location: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop",
    type: "image",
    caption: "Waking up to this view is something I'll never get used to. The pastel houses clinging to the cliffs are just magical. 🍋🌊 #Amalfi #ItalyTravel",
    likes: 1240,
    comments: 86,
    isLiked: false,
    isSaved: true,
    height: "h-[500px]",
  },
  {
    id: "2",
    user: { name: "Marcus Chen", username: "@marcus_explores", avatar: "11" },
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    type: "video",
    caption: "Lost in the bamboo forest. The sound of the wind through the stalks is incredibly peaceful. 🎋",
    likes: 3420,
    comments: 124,
    isLiked: true,
    isSaved: false,
    height: "h-[600px]",
  },
  {
    id: "3",
    user: { name: "Sarah Miller", username: "@sarahm", avatar: "44" },
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?q=80&w=1000&auto=format&fit=crop",
    type: "image",
    caption: "Chasing sunsets in Oia. The colors here don't even look real. 🌅✨",
    likes: 890,
    comments: 42,
    isLiked: false,
    isSaved: false,
    height: "h-[400px]",
  },
  {
    id: "4",
    user: { name: "David Kim", username: "@dkim_travel", avatar: "55" },
    location: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1531366936337-77cf5e08bc05?q=80&w=1000&auto=format&fit=crop",
    type: "image",
    caption: "First tracks on fresh powder. Nothing beats the Alps in January. ⛷️❄️",
    likes: 2100,
    comments: 156,
    isLiked: true,
    isSaved: true,
    height: "h-[550px]",
  },
  {
    id: "5",
    user: { name: "Jessica Alba", username: "@jess_wanders", avatar: "23" },
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    type: "image",
    caption: "Found this hidden waterfall after a 2 hour hike. Totally worth the mosquito bites! 🌿💦",
    likes: 4520,
    comments: 312,
    isLiked: false,
    isSaved: false,
    height: "h-[480px]",
  },
  {
    id: "6",
    user: { name: "Tom Hardy", username: "@tom_adventures", avatar: "15" },
    location: "Petra, Jordan",
    image: "https://images.unsplash.com/photo-1579606032822-19e34c98f828?q=80&w=1000&auto=format&fit=crop",
    type: "video",
    caption: "Walking through the Siq and seeing the Treasury reveal itself is a top tier travel moment. 🏜️",
    likes: 5600,
    comments: 410,
    isLiked: false,
    isSaved: false,
    height: "h-[650px]",
  },
];

const TRENDING = [
  { name: "Tokyo, Japan", loops: "12.4k" },
  { name: "Banff, Canada", loops: "8.2k" },
  { name: "Lisbon, Portugal", loops: "7.1k" },
  { name: "Patagonia, Chile", loops: "4.5k" },
];

// --- Components ---

const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative mb-6 w-full overflow-hidden rounded-3xl bg-[#0E2238]/40 border border-white/10 backdrop-blur-md break-inside-avoid shadow-lg"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <img src={`https://i.pravatar.cc/150?img=${post.user.avatar}`} alt={post.user.name} className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-sm" />
          <div>
            <p className="text-sm font-bold text-white drop-shadow-md leading-tight">{post.user.name}</p>
            <p className="text-[10px] text-white/80 drop-shadow-md flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {post.location}
            </p>
          </div>
        </div>
        <button className="text-white/80 hover:text-white transition-colors">
          <MoreHorizontal className="h-5 w-5 drop-shadow-md" />
        </button>
      </div>

      {/* Media Content */}
      <div className={cn("relative w-full overflow-hidden", post.height)}>
        <img 
          src={post.image} 
          alt="Post" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110" 
        />
        
        {post.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg cursor-pointer hover:bg-brand-primary hover:text-black hover:border-brand-primary transition-all">
              <Play className="h-6 w-6 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Bottom Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Interaction Bar & Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        
        {/* Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="group/btn flex items-center gap-1.5 transition-colors">
              <Heart className={cn("h-6 w-6 transition-transform group-active/btn:scale-75", liked ? "fill-brand-highlight text-brand-highlight" : "text-white hover:text-white/80")} />
              <span className="text-xs font-bold text-white">{likesCount.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors">
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-bold">{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className="text-white hover:text-white/80 transition-colors">
            <Bookmark className={cn("h-6 w-6", saved && "fill-white text-white")} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm text-white/90 line-clamp-2">
            <span className="font-bold mr-2 text-white">{post.user.username}</span>
            {post.caption}
          </p>
          <button className="text-xs text-brand-primary hover:underline">View all comments</button>
        </div>
      </div>
    </motion.div>
  );
};

export default function SocialFeedPage() {
  return (
    <main className="min-h-screen w-full bg-[#071120] font-sans text-brand-text selection:bg-brand-primary selection:text-[#071120] relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#071120]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold hidden md:block">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex w-full max-w-md items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md focus-within:border-brand-primary/50">
            <Search className="h-4 w-4 text-white/40" />
            <input type="text" placeholder="Search destinations, creators, loops..." className="ml-3 w-full bg-transparent text-sm text-white placeholder-white/40 outline-none" />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-primary hover:text-black transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-brand-primary bg-[url('https://i.pravatar.cc/150?img=68')] bg-cover cursor-pointer" />
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-6 pt-8 pb-32 flex gap-8">
        
        {/* Left/Main Column: Masonry Feed */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            {POSTS.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </div>

        {/* Right Column: Sidebar (Desktop Only) */}
        <div className="hidden lg:flex w-1/3 xl:w-1/4 flex-col gap-6 sticky top-28 h-max">
          
          {/* User Profile Snippet */}
          <div className="rounded-3xl border border-white/10 bg-[#0E2238]/40 p-6 backdrop-blur-xl">
             <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-full border-2 border-brand-primary bg-[url('https://i.pravatar.cc/150?img=68')] bg-cover" />
               <div>
                 <h3 className="font-bold text-white text-lg leading-tight">Alex Traveler</h3>
                 <p className="text-sm text-white/50">@alextravels</p>
               </div>
             </div>
             <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-center">
                <div>
                  <span className="block font-bold text-white">42</span>
                  <span className="text-[10px] uppercase text-white/50">Posts</span>
                </div>
                <div>
                  <span className="block font-bold text-white">12.4k</span>
                  <span className="text-[10px] uppercase text-white/50">Followers</span>
                </div>
                <div>
                  <span className="block font-bold text-white">18</span>
                  <span className="text-[10px] uppercase text-white/50">Loops</span>
                </div>
             </div>
          </div>

          {/* Trending Destinations */}
          <div className="rounded-3xl border border-white/10 bg-[#0E2238]/40 p-6 backdrop-blur-xl">
            <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-secondary" /> Trending Loops
            </h3>
            <div className="space-y-4">
              {TRENDING.map((dest, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/50 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors">
                       <Compass className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-white text-sm">{dest.name}</h4>
                       <p className="text-xs text-white/50">{dest.loops} loops created</p>
                     </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-brand-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Creators */}
          <div className="rounded-3xl border border-white/10 bg-[#0E2238]/40 p-6 backdrop-blur-xl">
            <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" /> Suggested Creators
            </h3>
            <div className="space-y-4">
               {[
                 { name: "Mia Wong", user: "@mia_explores", img: "28" },
                 { name: "Leo Santos", user: "@leo_shots", img: "33" }
               ].map((c, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <img src={`https://i.pravatar.cc/100?img=${c.img}`} className="h-10 w-10 rounded-full border border-white/20" alt={c.name} />
                     <div>
                       <h4 className="font-bold text-white text-sm leading-tight">{c.name}</h4>
                       <p className="text-xs text-white/50">{c.user}</p>
                     </div>
                   </div>
                   <button className="text-xs font-bold text-brand-primary hover:text-white transition-colors">Follow</button>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-[#071120] shadow-[0_0_30px_rgba(73,198,229,0.5)] transition-shadow hover:shadow-[0_0_40px_rgba(255,138,61,0.6)]"
      >
        <Plus className="h-8 w-8" />
      </motion.button>
    </main>
  );
}
