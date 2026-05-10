"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Mail, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Custom Components ---

const GlassInput = ({
  icon,
  type,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden rounded-xl border bg-white/5 transition-all duration-300",
        focused
          ? "border-brand-primary/50 shadow-[0_0_15px_rgba(73,198,229,0.2)] bg-white/10"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
      )}
    >
      <div
        className={cn(
          "pl-4 pr-3 transition-colors duration-300",
          focused ? "text-brand-primary" : "text-white/40"
        )}
      >
        {icon}
      </div>
      <input
        type={type}
        className="w-full bg-transparent py-4 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </div>
  );
};

const SocialButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]">
    {icon}
    <span>{label}</span>
  </button>
);

// --- Page ---

export default function LoginPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login. Please check your credentials.");
      }

      // Store the token in local storage
      localStorage.setItem("token", data.token || data.Token);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-bg flex items-center justify-center">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
        />
        {/* Dark luxury gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/60 to-transparent md:w-[60%]" />
        
        {/* Animated Floating Gradients */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-brand-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-brand-secondary/10 blur-[150px]"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col justify-between px-6 py-12 md:flex-row md:items-center md:py-0 min-h-screen">
        
        {/* Left Side: Emotional Copy */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden w-1/2 flex-col pr-12 md:flex mb-12 md:mb-0"
        >
          <Link href="/" className="mb-24 flex items-center gap-2 w-max group">
            <Globe className="h-10 w-10 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-3xl font-bold tracking-tight text-white">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>
          
          <h1 className="font-heading text-6xl font-bold leading-tight text-white lg:text-7xl">
            Adventure <br />
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-highlight bg-clip-text text-transparent">
              begins here.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/60 leading-relaxed">
            Log in to reconnect with your groups, review your upcoming itineraries, and continue building the trip of a lifetime.
          </p>
        </motion.div>

        {/* Right Side: Glassmorphism Login Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full md:w-[480px] shrink-0"
        >
          {/* Mobile Logo */}
          <Link href="/" className="mb-12 flex items-center justify-center gap-2 md:hidden group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E2238]/60 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10">
            {/* Card inner glow */}
            <div className="absolute -left-[50%] -top-[50%] h-full w-full animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(73,198,229,0.3)_360deg)] opacity-20 mix-blend-screen" />
            
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="font-heading text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-white/50">Enter your details to access your loops.</p>
              </motion.div>

              <form className="space-y-5" onSubmit={handleLogin}>
                {error && (
                  <motion.div variants={itemVariants} className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                    {error}
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <GlassInput
                    type="email"
                    placeholder="name@example.com"
                    icon={<Mail className="h-5 w-5" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassInput
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex h-4 w-4 items-center justify-center rounded border border-white/20 bg-white/5 transition-colors group-hover:border-brand-primary">
                      <input type="checkbox" className="peer sr-only" />
                      <Check className="h-3 w-3 text-brand-primary opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-white/60 transition-colors group-hover:text-white">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors hover:underline underline-offset-4">
                    Forgot password?
                  </a>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <button 
                    disabled={isLoading}
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary to-[#2C9BB5] py-4 text-sm font-bold text-brand-bg transition-all duration-300 hover:shadow-[0_0_20px_rgba(73,198,229,0.4)] active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? "Signing In..." : "Sign In"}
                      {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </span>
                    {/* Hover glare effect */}
                    {!isLoading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />}
                  </button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="my-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">Or continue with</span>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <SocialButton
                  label="Google"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  }
                />
                <SocialButton
                  label="Apple"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z" />
                    </svg>
                  }
                />
              </motion.div>

              <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-white/50">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors hover:underline underline-offset-4">
                  Create a loop
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
