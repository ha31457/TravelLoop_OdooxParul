"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Public paths that do not require authentication
    const publicPaths = ["/", "/login", "/register"];
    
    if (publicPaths.includes(pathname)) {
      setIsAuthorized(true);
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Decode JWT payload without a library
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      // Assume the role is stored in the 'role' claim. Default to 'user' if not found.
      const role = decodedPayload.role || "user"; 

      const isAdminPage = pathname.startsWith("/admin");

      if (role === "admin") {
        // Admin should only access admin pages
        if (!isAdminPage) {
          router.push("/admin");
        } else {
          setIsAuthorized(true);
        }
      } else {
        // Normal user should not access admin pages
        if (isAdminPage) {
          router.push("/dashboard");
        } else {
          setIsAuthorized(true);
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    // Show a premium loading state while verifying authorization
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071120]">
        <div className="flex flex-col items-center gap-4">
           <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-brand-primary" />
           <p className="text-white/50 text-sm font-mono uppercase tracking-widest animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
