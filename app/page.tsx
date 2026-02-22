import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { GameCards } from "@/components/game-cards"
import { XPProgress } from "@/components/xp-progress"
import { AchievementBadges } from "@/components/achievement-badges"
import { Zap } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <GameCards />

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div id="progress">
        <XPProgress />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div id="badges">
        <AchievementBadges />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center">
              <Zap className="size-3" style={{ color: "white" }} />
            </div>
            <span className="text-sm font-bold text-foreground">
              SKZ<span className="text-neon-pink"> Fun Lab</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Fan-made with love. Not affiliated with any artist or label.
          </p>
        </div>
      </footer>
    </main>
  )
}
