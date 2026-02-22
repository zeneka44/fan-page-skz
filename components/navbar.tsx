"use client"

import { useState, useEffect } from "react"
import { Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Play", href: "/play" },
  { label: "Collection", href: "/collection" },
  { label: "Gift", href: "/gift" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { progress } = useProgress()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center">
            <Zap className="size-4" style={{ color: "white" }} />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            SKZ<span className="text-neon-pink"> Fun Lab</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-neon-pink font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* XP pill */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30">
            <Zap className="size-3 text-neon-pink" />
            <span className="text-xs font-mono font-semibold text-neon-pink">
              {progress.xp} XP
            </span>
            <span className="text-[10px] text-muted-foreground">
              Lv.{progress.level}
            </span>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm py-2 transition-colors ${
                  pathname === link.href
                    ? "text-neon-pink font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 w-fit">
              <Zap className="size-3 text-neon-pink" />
              <span className="text-xs font-mono font-semibold text-neon-pink">
                {progress.xp} XP
              </span>
              <span className="text-[10px] text-muted-foreground">
                Lv.{progress.level}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
