import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TravelLoop | Aesthetic AI Collaborative Trip Planner",
  description: "Collaboratively plan trips, manage budgets, build itineraries, and discover activities together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#071120] text-[#F7FAFC] font-sans selection:bg-[#49C6E5] selection:text-[#071120]">
        {children}
      </body>
    </html>
  );
}
