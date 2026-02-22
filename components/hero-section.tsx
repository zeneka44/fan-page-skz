"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Zap, Play, ChevronDown } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToContent = () => {
    document.getElementById("activities-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradients */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #FF2D95 0%, transparent 50%),
                       radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, #6C5CE7 0%, transparent 50%),
                       radial-gradient(circle at 50% 50%, #E50914 0%, transparent 60%)`,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#EAEAEF 1px, transparent 1px), linear-gradient(90deg, #EAEAEF 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating accent elements */}
      <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-neon-pink animate-float opacity-60" />
      <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-neon-violet animate-float opacity-40" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-1/4 w-1 h-1 rounded-full bg-neon-red animate-float opacity-50" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-sm font-medium mb-8">
          <Zap className="size-3.5" />
          <span>Made as a gift</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 text-balance">
          <span className="block">SKZ</span>
          <span
            className="block bg-gradient-to-r from-neon-pink via-neon-red to-neon-violet bg-clip-text text-transparent animate-shimmer"
          >
            Fun Lab
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed text-pretty">
          Quizzes, mini-games, and badges. Find your vibe, earn XP, and have fun.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/play">
            <Button
              size="lg"
              className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl px-8 h-12 text-base font-semibold animate-pulse-glow"
            >
              <Zap className="size-4" />
              Start Playing
            </Button>
          </Link>
          <Link href="/quiz">
            <Button
              variant="outline"
              size="lg"
              className="border-border/60 text-foreground hover:bg-secondary hover:text-foreground rounded-xl px-8 h-12 text-base"
            >
              <Play className="size-4" />
              Take the Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-neon-pink transition-colors cursor-pointer"
        aria-label="Scroll to content"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </button>
    </section>
  )
}
