"use client"

import { Navbar } from "@/components/navbar"
import { useProgress } from "@/lib/progress-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Brain, Music, Gamepad2, CalendarDays, Trophy, ArrowRight,
  Zap, Flame, BookOpen
} from "lucide-react"
import Link from "next/link"

export default function PlayPage() {
  const { progress } = useProgress()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">Play Hub</h1>
          <p className="text-muted-foreground text-pretty">
            Pick an activity, earn XP, and collect badges.
          </p>
          {/* Mini progress */}
          <div className="inline-flex items-center gap-3 mt-4 px-4 py-2 rounded-full bg-card border border-border/50">
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-neon-pink" />
              <span className="text-sm font-mono font-semibold text-neon-pink">{progress.xp} XP</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-muted-foreground">
              Level <span className="text-foreground font-semibold">{progress.level}</span>
            </span>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{progress.badges.length}</span> badges
            </span>
          </div>
        </div>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-11 bg-secondary rounded-xl mb-8">
            <TabsTrigger value="quiz" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Brain className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Gamepad2 className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Games</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <CalendarDays className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Daily</span>
            </TabsTrigger>
            <TabsTrigger value="collection" className="rounded-lg data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline ml-1.5">Collection</span>
            </TabsTrigger>
          </TabsList>

          {/* Quiz tab */}
          <TabsContent value="quiz">
            <div className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#FF2D95] flex items-center justify-center shrink-0">
                  <Brain className="size-6" style={{ color: "white" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Find Your SKZ Vibe</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Answer 8 questions to discover your listening personality. Results are saved to your collection.
                  </p>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Trophy className="size-3 text-neon-pink" /> +50 XP
                    </span>
                    <span className="text-xs text-muted-foreground">8 questions</span>
                    {progress.quizResults.length > 0 && (
                      <span className="text-xs text-emerald-400">Completed {progress.quizResults.length}x</span>
                    )}
                  </div>
                  <Link href="/quiz">
                    <Button className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl">
                      Start Quiz <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Games tab */}
          <TabsContent value="games">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lyric Guess */}
              <Link href="/games/lyric" className="rounded-2xl bg-card border border-border/50 p-6 group hover:border-neon-pink/40 transition-all block">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF2D95] to-[#E50914] flex items-center justify-center mb-4">
                  <Music className="size-5" style={{ color: "white" }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Lyric Guess</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Fill in the blank with the right word. Build streaks for bonus XP.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="size-3 text-neon-pink" /> +10 XP per correct
                  </span>
                  <span className="text-xs text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Play <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>

              {/* Memory Cards */}
              <Link href="/games/memory" className="rounded-2xl bg-card border border-border/50 p-6 group hover:border-neon-pink/40 transition-all block">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E50914] to-[#6C5CE7] flex items-center justify-center mb-4">
                  <Gamepad2 className="size-5" style={{ color: "white" }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Memory Cards</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Flip and match pairs. Three difficulty levels with timer and move count.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Trophy className="size-3 text-neon-pink" /> +30 XP per completion
                  </span>
                  <span className="text-xs text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Play <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            </div>
          </TabsContent>

          {/* Daily tab */}
          <TabsContent value="daily">
            <div className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center shrink-0">
                  <CalendarDays className="size-6" style={{ color: "white" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    One quiz question, one lyric round, one mini memory game. Complete all three steps to earn +70 XP and build your streak.
                  </p>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="size-3 text-neon-pink" /> Streak: {progress.dailyStreak}
                    </span>
                    {progress.dailyCompletedToday && (
                      <span className="text-xs text-emerald-400">Completed today</span>
                    )}
                  </div>
                  <Link href="/daily">
                    <Button
                      className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl"
                      disabled={progress.dailyCompletedToday}
                    >
                      {progress.dailyCompletedToday ? "Done for today" : "Start Daily"}
                      <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Collection tab */}
          <TabsContent value="collection">
            <div className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8 text-center">
              <BookOpen className="size-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Collection</h3>
              <p className="text-sm text-muted-foreground mb-5">
                View your saved quiz results, unlocked badges, and best scores.
              </p>
              <Link href="/collection">
                <Button className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl">
                  Open Collection <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
