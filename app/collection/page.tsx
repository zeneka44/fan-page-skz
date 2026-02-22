"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { useProgress } from "@/lib/progress-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import badgesData from "@/data/badges.json"
import quizData from "@/data/quiz.json"
import {
  BookOpen, Shield, Brain, Trophy, Zap, Lock,
  Sparkles, Timer, Calendar, CalendarCheck, CalendarHeart, Compass,
  Download, RotateCcw
} from "lucide-react"

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

export default function CollectionPage() {
  const { progress, markVisited, resetProgress } = useProgress()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    markVisited("collection")
  }, [markVisited])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "skz-fun-lab-progress.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Collection</h1>
          <p className="text-muted-foreground text-sm">Your badges, quiz results, and best scores.</p>
          <div className="inline-flex items-center gap-3 mt-4 px-4 py-2 rounded-full bg-card border border-border/50">
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-neon-pink" />
              <span className="text-sm font-mono font-semibold text-neon-pink">{progress.xp} XP</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-muted-foreground">Level {progress.level}</span>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-muted-foreground">{progress.badges.length} badges</span>
          </div>
        </div>

        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-11 bg-secondary rounded-xl mb-8">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">All</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Shield className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Brain className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Results</span>
            </TabsTrigger>
            <TabsTrigger value="scores" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Trophy className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Scores</span>
            </TabsTrigger>
          </TabsList>

          {/* All tab */}
          <TabsContent value="all">
            <div className="space-y-6">
              <StatsOverview progress={progress} />
              <BadgesGrid progress={progress} />
              <QuizResults progress={progress} />
              <ScoresSection progress={progress} />
            </div>
          </TabsContent>

          {/* Badges tab */}
          <TabsContent value="badges">
            <BadgesGrid progress={progress} />
          </TabsContent>

          {/* Results tab */}
          <TabsContent value="results">
            <QuizResults progress={progress} />
          </TabsContent>

          {/* Scores tab */}
          <TabsContent value="scores">
            <ScoresSection progress={progress} />
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button variant="outline" onClick={handleExport} className="rounded-xl border-border/60 text-sm">
            <Download className="size-4" /> Export Progress
          </Button>
          {!showResetConfirm ? (
            <Button variant="ghost" onClick={() => setShowResetConfirm(true)} className="text-sm text-muted-foreground">
              <RotateCcw className="size-4" /> Reset
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="destructive" onClick={handleReset} className="text-sm rounded-xl">
                Confirm Reset
              </Button>
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="text-sm text-muted-foreground">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function StatsOverview({ progress }: { progress: ReturnType<typeof useProgress>["progress"] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Total XP", value: progress.xp.toLocaleString(), color: "text-neon-pink" },
        { label: "Level", value: progress.level, color: "text-foreground" },
        { label: "Badges", value: `${progress.badges.length}/${badgesData.badges.length}`, color: "text-neon-violet" },
        { label: "Daily Streak", value: progress.dailyStreak, color: "text-amber-400" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl bg-card border border-border/50 p-4 text-center">
          <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function BadgesGrid({ progress }: { progress: ReturnType<typeof useProgress>["progress"] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {badgesData.badges.map((badge, i) => {
          const Icon = iconMap[badge.icon] || Sparkles
          const unlocked = progress.badges.includes(badge.id)
          const gradient = gradients[i % gradients.length]
          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-4 text-center transition-all ${
                unlocked
                  ? "bg-card border-border/50"
                  : "bg-card/30 border-border/20 opacity-40"
              }`}
            >
              <div
                className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                  unlocked ? `bg-gradient-to-br ${gradient}` : "bg-secondary"
                }`}
              >
                {unlocked ? (
                  <Icon className="size-5" style={{ color: "white" }} />
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-[11px] font-medium text-foreground">{badge.title}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{badge.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuizResults({ progress }: { progress: ReturnType<typeof useProgress>["progress"] }) {
  if (progress.quizResults.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
        <Brain className="size-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No quiz results yet. Take the quiz to see your vibe here.</p>
      </div>
    )
  }
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Quiz Results</h3>
      <div className="flex flex-col gap-2">
        {progress.quizResults.map((r, i) => {
          const profile = quizData.resultProfiles.find((p) => p.id === r.profileId)
          if (!profile) return null
          return (
            <div key={i} className="rounded-xl bg-card border border-border/50 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">{profile.title}</div>
                <div className="text-xs text-muted-foreground">{profile.subtitle}</div>
              </div>
              <div className="flex items-center gap-2">
                {profile.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-[10px]">
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] text-muted-foreground">
                  {new Date(r.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScoresSection({ progress }: { progress: ReturnType<typeof useProgress>["progress"] }) {
  const hasLyricData = progress.lyricTotalCorrect > 0 || progress.lyricBestStreak > 0
  const hasMemoryData = Object.keys(progress.memoryBestTime).length > 0

  if (!hasLyricData && !hasMemoryData) {
    return (
      <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
        <Trophy className="size-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No scores yet. Play some games to see your stats here.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Best Scores</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hasLyricData && (
          <div className="rounded-xl bg-card border border-border/50 p-4">
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Lyric Guess</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Correct</div>
                <div className="text-lg font-bold font-mono text-foreground">{progress.lyricTotalCorrect}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Best Streak</div>
                <div className="text-lg font-bold font-mono text-amber-400">{progress.lyricBestStreak}</div>
              </div>
            </div>
          </div>
        )}
        {Object.entries(progress.memoryBestTime).map(([diff, time]) => (
          <div key={diff} className="rounded-xl bg-card border border-border/50 p-4">
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Memory — {diff}</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Best Time</div>
                <div className="text-lg font-bold font-mono text-foreground">
                  {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Best Moves</div>
                <div className="text-lg font-bold font-mono text-neon-pink">
                  {progress.memoryBestMoves[diff] ?? "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
