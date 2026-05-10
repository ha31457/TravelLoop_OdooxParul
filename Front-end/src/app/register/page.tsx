"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  User,
  MapPin,
  Camera,
  Check,
  Palmtree,
  Mountain,
  Utensils,
  Camera as CameraIcon,
  Tent,
  Ship,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types & Data ---

const INTERESTS = [
  { id: "beach", label: "Beach & Relax", icon: Palmtree },
  { id: "mountain", label: "Mountains & Hiking", icon: Mountain },
  { id: "food", label: "Culinary Tours", icon: Utensils },
  { id: "culture", label: "Culture & History", icon: CameraIcon },
  { id: "camping", label: "Camping & Nature", icon: Tent },
  { id: "cruise", label: "Cruises", icon: Ship },
];

const STEPS = [
  {
    id: "account",
    title: "Account Details",
    subtitle: "Let's secure your new journey.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: "profile",
    title: "Your Identity",
    subtitle: "Tell your fellow travelers about yourself.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  },
  {
    id: "interests",
    title: "Travel Vibe",
    subtitle: "What makes you pack your bags?",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  },
];

// --- Custom Components ---

const FloatingLabelInput = ({
  icon,
  label,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; label: string }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div
      className={cn(
        "relative flex w-full items-center overflow-hidden rounded-xl border bg-white/5 transition-all duration-300",
        focused
          ? "border-brand-primary/50 bg-white/10 shadow-[0_0_15px_rgba(73,198,229,0.2)]"
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
      <div className="relative w-full pt-4 pb-2">
        <input
          type={type}
          className="peer w-full bg-transparent pr-4 text-sm text-white outline-none"
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          {...props}
        />
        <label
          className={cn(
            "pointer-events-none absolute left-0 transition-all duration-300 text-white/40",
            focused || hasValue
              ? "top-1 text-[10px] uppercase tracking-wider text-brand-primary"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

const TextAreaInput = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border bg-white/5 transition-all duration-300 p-4",
        focused
          ? "border-brand-primary/50 bg-white/10 shadow-[0_0_15px_rgba(73,198,229,0.2)]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
      )}
    >
      <label
        className={cn(
          "pointer-events-none absolute left-4 transition-all duration-300 text-white/40",
          focused || hasValue
            ? "top-2 text-[10px] uppercase tracking-wider text-brand-primary"
            : "top-4 text-sm"
        )}
      >
        {label}
      </label>
      <textarea
        className="mt-4 w-full resize-none bg-transparent text-sm text-white outline-none min-h-[80px]"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        {...props}
      />
    </div>
  );
};

// --- Page ---

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          FullName: `${firstName} ${lastName}`.trim(), 
          Email: email, 
          Password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register.");
      }

      localStorage.setItem("token", data.token || data.Token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentStep = STEPS[step];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-bg flex">
      
      {/* Left Side: Dynamic Image */}
      <div className="hidden lg:block lg:w-5/12 xl:w-1/2 relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentStep.id}
            src={currentStep.image}
            alt="Travel background"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/20 via-transparent to-brand-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent" />
        
        {/* Floating elements & Logo */}
        <div className="absolute left-12 top-12 z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="h-8 w-8 text-brand-primary transition-transform group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold tracking-tight text-white drop-shadow-md">
              Travel<span className="text-brand-primary">Loop</span>
            </span>
          </Link>
        </div>

        <div className="absolute bottom-16 left-12 z-10 max-w-md">
          <motion.div
            key={`title-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-brand-primary" /> Step {step + 1} of {STEPS.length}
            </div>
            <h1 className="font-heading text-5xl font-bold text-white drop-shadow-lg">
              {currentStep.title}
            </h1>
            <p className="mt-3 text-lg text-white/80 drop-shadow-md">
              {currentStep.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="relative flex w-full flex-col lg:w-7/12 xl:w-1/2 overflow-y-auto overflow-x-hidden">
        
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between p-6 pb-0">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="h-6 w-6 text-brand-primary" />
            <span className="font-heading text-xl font-bold text-white">TravelLoop</span>
          </Link>
          <div className="text-xs font-semibold text-brand-primary">Step {step + 1}/{STEPS.length}</div>
        </div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 lg:left-auto right-0 h-1 bg-white/10 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-highlight"
            initial={{ width: `${(step / STEPS.length) * 100}%` }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex-1 px-6 py-12 md:px-16 md:py-20 flex flex-col justify-center w-full max-w-2xl mx-auto">
          
          <div className="mb-10 lg:hidden">
            <h1 className="font-heading text-4xl font-bold text-white">{currentStep.title}</h1>
            <p className="mt-2 text-white/60">{currentStep.subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* STEP 1: Account */}
              {step === 0 && (
                <div className="space-y-6">
                  <FloatingLabelInput icon={<Mail className="h-5 w-5" />} label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <FloatingLabelInput icon={<Phone className="h-5 w-5" />} label="Phone Number" type="tel" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput icon={<Lock className="h-5 w-5" />} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FloatingLabelInput icon={<Lock className="h-5 w-5" />} label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              )}

              {/* STEP 2: Profile Details */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative group cursor-pointer">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-dashed border-brand-primary/50 bg-white/5 p-1 transition-all duration-300 group-hover:border-brand-primary">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-brand-primary">
                            <Camera className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-xs font-semibold text-white">Upload</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput icon={<User className="h-5 w-5" />} label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <FloatingLabelInput icon={<User className="h-5 w-5" />} label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingLabelInput icon={<MapPin className="h-5 w-5" />} label="City" />
                    <FloatingLabelInput icon={<Globe className="h-5 w-5" />} label="Country" />
                  </div>
                  <TextAreaInput label="Short Bio (Optional)" placeholder="I travel to eat pizza and climb rocks..." />
                </div>
              )}

              {/* STEP 3: Travel Identity */}
              {step === 2 && (
                <div>
                  <p className="mb-6 text-sm text-white/60">Select up to 3 things you absolutely love doing on trips.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={cn(
                            "relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300",
                            isSelected
                              ? "border-brand-primary bg-brand-primary/10 shadow-[0_0_15px_rgba(73,198,229,0.2)]"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                              isSelected ? "bg-brand-primary text-brand-bg" : "bg-white/10 text-white/50"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={cn("font-medium transition-colors", isSelected ? "text-white" : "text-white/70")}>
                            {interest.label}
                          </span>
                          {isSelected && (
                            <Check className="absolute right-4 h-5 w-5 text-brand-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            <button
              onClick={step === STEPS.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading}
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-primary to-[#2C9BB5] px-8 py-3 text-sm font-bold text-brand-bg transition-all duration-300 hover:shadow-[0_0_20px_rgba(73,198,229,0.4)] active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Processing..." : (step === STEPS.length - 1 ? "Complete Profile" : "Continue")}
                {step !== STEPS.length - 1 && !isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </span>
              {!isLoading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-primary hover:text-brand-primary/80 hover:underline underline-offset-4">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
