"use client"

import { useState } from "react"
import { Brain, Music, Gamepad2, CalendarDays, Trophy, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const games = [
  {
    id: 1,
    title: "Find Your Vibe",
    description: "8 questions to discover your SKZ listening personality. Save your result and share it.",
    icon: Brain,
    difficulty: "Chill",
    xp: 50,
    href: "/quiz",
    gradient: "from-[#6C5CE7] to-[#FF2D95]",
  },
  {
    id: 2,
    title: "Lyric Guess",
    description: "Short prompts, four options, one correct answer. Build streaks and earn XP for every hit.",
    icon: Music,
    difficulty: "Medium",
    xp: 10,
    href: "/games/lyric",
    gradient: "from-[#FF2D95] to-[#E50914]",
  },
  {
    id: 3,
    title: "Memory Cards",
    description: "Flip and match icon pairs. Three difficulty levels with timer and move tracking.",
    icon: Gamepad2,
    difficulty: "Varies",
    xp: 30,
    href: "/games/memory",
    gradient: "from-[#E50914] to-[#6C5CE7]",
  },
  {
    id: 4,
    title: "Daily Challenge",
    description: "One quiz question, one lyric round, one mini memory. Complete all three to keep your streak.",
    icon: CalendarDays,
    difficulty: "Daily",
    xp: 70,
    href: "/daily",
    gradient: "from-[#FF2D95] to-[#6C5CE7]",
  },
]

const difficultyColors: Record<string, string> = {
  Chill: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Varies: "bg-neon-violet/20 text-violet-400 border-neon-violet/30",
  Daily: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
}

export function GameCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="activities-section" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-violet/30 bg-neon-violet/10 text-neon-violet text-xs font-medium mb-4">
            <Gamepad2 className="size-3" />
            <span>Activities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Choose Your Mode
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-pretty">
            Play, earn XP, and collect badges. Every activity brings you closer to the next level.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((game) => {
            const Icon = game.icon
            const isHovered = hoveredCard === game.id

            return (
              <Link
                key={game.id}
                href={game.href}
                className="group relative rounded-2xl bg-card border border-border/50 p-6 text-left transition-all duration-300 hover:border-transparent cursor-pointer block"
                onMouseEnter={() => setHoveredCard(game.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  boxShadow: isHovered
                    ? `0 0 30px rgba(255, 45, 149, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                    : "none",
                }}
              >
                {/* Glow border on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${game.id === 1 ? '#6C5CE7' : game.id === 2 ? '#FF2D95' : game.id === 3 ? '#E50914' : '#FF2D95'}22, transparent)`,
                    }}
                  />
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${game.gradient} mb-4`}>
                    <Icon className="size-5" style={{ color: "white" }} />
                  </div>

                  {/* Difficulty badge */}
                  <Badge variant="outline" className={`${difficultyColors[game.difficulty]} text-[10px] mb-3 rounded-lg`}>
                    {game.difficulty}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">{game.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{game.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Trophy className="size-3 text-neon-pink" />
                      <span>+{game.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      <span>Play</span>
                      <ArrowRight className="size-3" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
