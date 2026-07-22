"use client";

/**
 * Top navigation bar with glassmorphism styling.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { History, ScanFace, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/upload", label: "Analyze", icon: Upload },
  { href: "/history", label: "History", icon: History },
];

/**
 * Render the primary application navigation.
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#070A16]/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
            <ScanFace className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white">
              FaceHarmony <span className="text-violet-300">AI</span>
            </p>
            <p className="text-xs text-slate-400">Educational geometry analysis</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition",
                  active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
