"use client"

import { Shield, Lock, Sparkles, Zap, Timer, Calendar, CalendarCheck, CalendarHeart, Compass } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import badgesData from "@/data/badges.json"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  sparkles: Sparkles,
  zap: Zap,
  timer: Timer,
  calendar: Calendar,
  "calendar-check": CalendarCheck,
  "calendar-heart": CalendarHeart,
  compass: Compass,
}

const gradients = [
  "from-[#FF2D95] to-[#E50914]",
  "from-[#6C5CE7] to-[#FF2D95]",
  "from-[#E50914] to-[#FF2D95]",
  "from-[#FF2D95] to-[#6C5CE7]",
  "from-[#6C5CE7] to-[#E50914]",
  "from-[#E50914] to-[#6C5CE7]",
  "from-[#FF2D95] to-[#E50914]",
]

export function AchievementBadges() {
  const { progress } = useProgress()
  const [selectedBadge, setSelectedBadge] = useState<(typeof badgesData.badges)[0] | null>(null)
  const unlockedCount = progress.badges.length

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-4">
            <Shield className="size-3" />
            <span>Achievements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Your Badges
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-pretty">
            Collect badges by playing games, building streaks, and exploring every mode.
          </p>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {badgesData.badges.map((badge, i) => {
            const Icon = iconMap[badge.icon] || Sparkles
            const unlocked = progress.badges.includes(badge.id)
            const gradient = gradients[i % gradients.length]

            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`group relative rounded-2xl border p-5 text-center transition-all duration-300 cursor-pointer ${
                  unlocked
                    ? "bg-card border-border/50 hover:border-neon-pink/40"
                    : "bg-card/30 border-border/20 opacity-50"
                }`}
              >
                <div
                  className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
                    unlocked ? `bg-gradient-to-br ${gradient}` : "bg-secondary"
                  }`}
                >
                  {unlocked ? (
                    <Icon className="size-6" style={{ color: "white" }} />
                  ) : (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-1">{badge.title}</h3>
              </button>
            )
          })}
        </div>

        {/* Progress text */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{unlockedCount}</span> of{" "}
            <span className="text-foreground font-semibold">{badgesData.badges.length}</span> badges unlocked
          </p>
        </div>
      </div>

      {/* Badge detail modal */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="bg-card border-border/50 rounded-2xl max-w-sm">
          {selectedBadge && (() => {
            const Icon = iconMap[selectedBadge.icon] || Sparkles
            const unlocked = progress.badges.includes(selectedBadge.id)
            const idx = badgesData.badges.findIndex((b) => b.id === selectedBadge.id)
            const gradient = gradients[idx % gradients.length]

            return (
              <>
                <DialogHeader className="items-center text-center">
                  <div
                    className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-2 ${
                      unlocked ? `bg-gradient-to-br ${gradient}` : "bg-secondary"
                    }`}
                  >
                    {unlocked ? (
                      <Icon className="size-10" style={{ color: "white" }} />
                    ) : (
                      <Lock className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <DialogTitle className="text-xl font-bold text-foreground">{selectedBadge.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center text-muted-foreground text-sm leading-relaxed">
                  {selectedBadge.description}
                </DialogDescription>
                {!unlocked && (
                  <div className="text-center pt-3 border-t border-border/50">
                    <p className="text-xs text-neon-pink font-medium">Keep playing to unlock this badge</p>
                  </div>
                )}
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </section>
  )
}
