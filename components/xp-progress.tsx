"use client"

import { useState, useEffect } from "react"
import { Star, TrendingUp, Award } from "lucide-react"
import { useProgress } from "@/lib/progress-context"
import badgesData from "@/data/badges.json"

const { xpRules } = badgesData

function getRanks() {
  const step = xpRules.levelEveryXp
  return [
    { name: "Rookie", minXP: 0, maxXP: step },
    { name: "Fan", minXP: step, maxXP: step * 3 },
    { name: "Super Fan", minXP: step * 3, maxXP: step * 7 },
    { name: "Stan", minXP: step * 7, maxXP: step * 15 },
    { name: "Ultimate", minXP: step * 15, maxXP: step * 30 },
  ]
}

export function XPProgress() {
  const { progress } = useProgress()
  const [animatedXP, setAnimatedXP] = useState(0)
  const ranks = getRanks()

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedXP(progress.xp), 300)
    return () => clearTimeout(timer)
  }, [progress.xp])

  const currentRank = ranks.find((r) => progress.xp >= r.minXP && progress.xp < r.maxXP) || ranks[ranks.length - 1]
  const nextRank = ranks[ranks.indexOf(currentRank) + 1]
  const progressInRank = currentRank.maxXP === currentRank.minXP
    ? 100
    : ((progress.xp - currentRank.minXP) / (currentRank.maxXP - currentRank.minXP)) * 100

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-xs font-medium mb-4">
            <TrendingUp className="size-3" />
            <span>Your Progress</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Fan Rank
          </h2>
        </div>

        {/* Main progress card */}
        <div className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8">
          {/* Top row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center">
                <Star className="size-6" style={{ color: "white" }} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Rank</div>
                <div className="text-xl font-bold text-foreground">{currentRank.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total XP</div>
              <div className="text-xl font-bold font-mono text-neon-pink">{progress.xp.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{currentRank.name}</span>
              {nextRank && <span>{nextRank.name}</span>}
            </div>
            <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#6C5CE7] transition-all duration-1000 ease-out"
                style={{ width: `${animatedXP === 0 ? 0 : progressInRank}%` }}
              />
              <div
                className="absolute inset-y-0 rounded-full bg-neon-pink/30 blur-sm transition-all duration-1000 ease-out"
                style={{ width: `${animatedXP === 0 ? 0 : progressInRank}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>{currentRank.minXP.toLocaleString()} XP</span>
              <span>{currentRank.maxXP.toLocaleString()} XP</span>
            </div>
          </div>

          {/* XP to next rank */}
          {nextRank && (
            <div className="text-center mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{(currentRank.maxXP - progress.xp).toLocaleString()} XP</span> to reach{" "}
                <span className="text-neon-violet font-semibold">{nextRank.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Rank milestones */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {ranks.map((rank) => {
            const isCompleted = progress.xp >= rank.maxXP
            const isCurrent = rank.name === currentRank.name

            return (
              <div
                key={rank.name}
                className={`text-center p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "border-neon-pink/50 bg-neon-pink/10"
                    : isCompleted
                    ? "border-border/50 bg-secondary/50"
                    : "border-border/30 bg-card/50"
                }`}
              >
                <Award
                  className={`size-4 mx-auto mb-1 ${
                    isCurrent ? "text-neon-pink" : isCompleted ? "text-neon-violet" : "text-muted-foreground/40"
                  }`}
                />
                <div className={`text-[10px] font-medium ${isCurrent ? "text-foreground" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                  {rank.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
