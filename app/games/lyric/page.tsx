"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress-context"
import lyricsData from "@/data/lyrics.json"
import { motion, AnimatePresence } from "framer-motion"
import {
  Music, Zap, Flame, RotateCcw, ArrowLeft, Lightbulb, CheckCircle2, XCircle
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type GameState = "playing" | "feedback" | "summary"

export default function LyricGuessPage() {
  const { addXP, markVisited, updateLyricStats } = useProgress()
  const [gameState, setGameState] = useState<GameState>("playing")
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const rounds = lyricsData.rounds
  const totalRounds = rounds.length
  const round = rounds[currentRound]

  useEffect(() => {
    markVisited("lyric")
  }, [markVisited])

  const handleSelect = useCallback((optionIndex: number) => {
    if (gameState !== "playing") return
    setSelectedOption(optionIndex)
    const correct = optionIndex === round.answerIndex
    setIsCorrect(correct)
    setGameState("feedback")

    if (correct) {
      const newStreak = streak + 1
      setScore((s) => s + 1)
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      addXP(10)
      toast.success("+10 XP", { description: `Streak: ${newStreak}` })
    } else {
      setStreak(0)
    }
  }, [gameState, round, streak, addXP])

  const handleNextRound = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound((r) => r + 1)
      setSelectedOption(null)
      setIsCorrect(null)
      setGameState("playing")
      setShowHint(false)
    } else {
      updateLyricStats(score + (isCorrect ? 0 : 0), bestStreak)
      setGameState("summary")
    }
  }

  const handleRestart = () => {
    setCurrentRound(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setGameState("playing")
    setShowHint(false)
  }

  const accuracy = totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* PLAYING / FEEDBACK */}
          {gameState !== "summary" && (
            <motion.div
              key={`round-${currentRound}-${gameState}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/50">
                    <Zap className="size-3 text-neon-pink" />
                    <span className="text-xs font-mono font-semibold text-foreground">{score}/{totalRounds}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/50">
                    <Flame className="size-3 text-amber-400" />
                    <span className="text-xs font-mono font-semibold text-foreground">{streak}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRules(true)}
                    className="text-muted-foreground text-xs"
                  >
                    Rules
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden mb-8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2D95] to-[#6C5CE7] transition-all duration-500"
                  style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
                />
              </div>

              {/* Prompt card */}
              <div className="rounded-2xl bg-card border border-border/50 p-8 text-center mb-6">
                <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                  {round.mode === "fill_blank" ? "Fill in the blank" : "Choose the next word"}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                  {round.prompt}
                </h2>
                {!showHint && gameState === "playing" && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Lightbulb className="size-3" /> Show hint
                  </button>
                )}
                {showHint && (
                  <p className="mt-3 text-xs text-neon-violet">{round.hint}</p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {round.options.map((option, i) => {
                  let btnClass = "border-border/50 bg-card text-foreground hover:border-border"
                  if (gameState === "feedback") {
                    if (i === round.answerIndex) {
                      btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    } else if (i === selectedOption && !isCorrect) {
                      btnClass = "border-red-500 bg-red-500/10 text-red-400"
                    } else {
                      btnClass = "border-border/30 bg-card/50 text-muted-foreground opacity-50"
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={gameState === "feedback"}
                      className={`px-5 py-4 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:cursor-default ${btnClass}`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {/* Feedback */}
              {gameState === "feedback" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="size-5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-5 text-red-400" />
                        <span className="text-red-400 font-semibold">
                          Not quite. It was &quot;{round.options[round.answerIndex]}&quot;
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={handleNextRound}
                    className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl"
                  >
                    {currentRound === totalRounds - 1 ? "See Results" : "Next Round"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SUMMARY */}
          {gameState === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="rounded-2xl bg-card border border-border/50 p-8 mb-6">
                <Music className="size-10 text-neon-pink mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-1">Round Complete</h2>
                <p className="text-sm text-muted-foreground mb-6">Here is how you did</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="text-2xl font-bold font-mono text-foreground">{score}/{totalRounds}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Correct</div>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="text-2xl font-bold font-mono text-neon-pink">{accuracy}%</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Accuracy</div>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="text-2xl font-bold font-mono text-amber-400">{bestStreak}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Best Streak</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  XP earned: <span className="text-neon-pink font-semibold">+{score * 10}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleRestart}
                  className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl"
                >
                  <RotateCcw className="size-4" /> Play Again
                </Button>
                <Link href="/play">
                  <Button variant="outline" className="rounded-xl border-border/60">
                    <ArrowLeft className="size-4" /> Back to Play
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rules modal */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="bg-card border-border/50 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">How to Play</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <p>You will see a short lyric prompt with a missing word.</p>
              <p>Pick the correct word from four options.</p>
              <p>Each correct answer earns <span className="text-neon-pink font-semibold">+10 XP</span>.</p>
              <p>Build streaks for badge progress. 5 in a row unlocks a badge.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </main>
  )
}
