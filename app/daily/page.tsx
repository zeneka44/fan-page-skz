"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress-context"
import quizData from "@/data/quiz.json"
import lyricsData from "@/data/lyrics.json"
import cardsData from "@/data/cards.json"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarDays, Flame, CheckCircle2, XCircle, Zap,
  Star, Sparkles, ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  star: Star,
  zap: Zap,
  sparkles: Sparkles,
}

type Step = "quiz" | "lyric" | "memory" | "claim"

function getDailySeed() {
  const today = new Date().toISOString().split("T")[0]
  let hash = 0
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export default function DailyPage() {
  const { progress, markVisited, completeDailyChallenge, addXP } = useProgress()
  const seed = useMemo(() => getDailySeed(), [])

  const [step, setStep] = useState<Step>("quiz")
  const [quizDone, setQuizDone] = useState(false)
  const [lyricDone, setLyricDone] = useState(false)
  const [memoryDone, setMemoryDone] = useState(false)

  // Quiz state
  const dailyQuestion = quizData.questions[seed % quizData.questions.length]
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)

  // Lyric state
  const dailyLyric = lyricsData.rounds[seed % lyricsData.rounds.length]
  const [lyricAnswer, setLyricAnswer] = useState<number | null>(null)
  const [lyricCorrect, setLyricCorrect] = useState<boolean | null>(null)

  // Memory state - 2x3 grid = 3 pairs
  const miniPairs = 3
  const dailyCards = useMemo(() => {
    const available = cardsData.themes[0].cards.slice(0, miniPairs)
    const deck: Array<{
      id: number
      cardId: string
      icon: string
      label: string
      matched: boolean
      flipped: boolean
    }> = []
    available.forEach((card, i) => {
      deck.push({ id: i * 2, cardId: card.id, icon: card.icon, label: card.label, matched: false, flipped: false })
      deck.push({ id: i * 2 + 1, cardId: card.id, icon: card.icon, label: card.label, matched: false, flipped: false })
    })
    // Seeded shuffle
    let s = seed
    for (let i = deck.length - 1; i > 0; i--) {
      s = (s * 16807) % 2147483647
      const j = s % (i + 1)
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }, [seed])

  const [memCards, setMemCards] = useState(dailyCards)
  const [memFlipped, setMemFlipped] = useState<number[]>([])

  useEffect(() => {
    markVisited("daily")
  }, [markVisited])

  // Quiz step
  const handleQuizAnswer = (answerId: string) => {
    setQuizAnswer(answerId)
  }

  const confirmQuiz = () => {
    if (!quizAnswer) return
    setQuizDone(true)
    setStep("lyric")
  }

  // Lyric step
  const handleLyricSelect = (optionIdx: number) => {
    if (lyricAnswer !== null) return
    setLyricAnswer(optionIdx)
    setLyricCorrect(optionIdx === dailyLyric.answerIndex)
    if (optionIdx === dailyLyric.answerIndex) {
      addXP(10)
    }
  }

  const confirmLyric = () => {
    setLyricDone(true)
    setStep("memory")
  }

  // Memory step
  const handleMemCard = useCallback((id: number) => {
    if (memFlipped.length >= 2) return
    const card = memCards.find((c) => c.id === id)
    if (!card || card.matched || card.flipped) return

    const newCards = memCards.map((c) => c.id === id ? { ...c, flipped: true } : c)
    setMemCards(newCards)
    const newFlipped = [...memFlipped, id]
    setMemFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped
      const c1 = newCards.find((c) => c.id === a)!
      const c2 = newCards.find((c) => c.id === b)!
      if (c1.cardId === c2.cardId) {
        setTimeout(() => {
          setMemCards((prev) => {
            const updated = prev.map((c) => c.cardId === c1.cardId ? { ...c, matched: true } : c)
            if (updated.every((c) => c.matched)) {
              setMemoryDone(true)
              setStep("claim")
            }
            return updated
          })
          setMemFlipped([])
        }, 400)
      } else {
        setTimeout(() => {
          setMemCards((prev) => prev.map((c) => (c.id === a || c.id === b) ? { ...c, flipped: false } : c))
          setMemFlipped([])
        }, 700)
      }
    }
  }, [memCards, memFlipped])

  const handleClaim = () => {
    completeDailyChallenge()
    toast.success("+70 XP", { description: `Streak: ${progress.dailyStreak + 1}` })
  }

  const allDone = quizDone && lyricDone && memoryDone

  if (progress.dailyCompletedToday) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-8" style={{ color: "white" }} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Done for today!</h1>
          <p className="text-muted-foreground mb-2">
            Come back tomorrow to continue your streak.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-sm font-medium mb-8">
            <Flame className="size-3.5" /> Streak: {progress.dailyStreak}
          </div>
          <div>
            <Link href="/play">
              <Button variant="outline" className="rounded-xl border-border/60">
                <ArrowLeft className="size-4" /> Back to Play
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const steps = [
    { id: "quiz" as const, label: "Quiz", done: quizDone },
    { id: "lyric" as const, label: "Lyric", done: lyricDone },
    { id: "memory" as const, label: "Memory", done: memoryDone },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-xs font-medium mb-4">
            <CalendarDays className="size-3" />
            <span>Daily Challenge</span>
            <span className="text-muted-foreground">|</span>
            <Flame className="size-3 text-amber-400" />
            <span className="text-amber-400">{progress.dailyStreak}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Today&apos;s Challenge</h1>
          <p className="text-sm text-muted-foreground">Complete all three steps to earn +70 XP.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s.done || s.id === step) {
                    setStep(s.id)
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  s.done
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : s.id === step
                    ? "bg-neon-pink/10 border border-neon-pink/30 text-neon-pink"
                    : "bg-secondary border border-border/30 text-muted-foreground"
                }`}
              >
                {s.done && <CheckCircle2 className="size-3" />}
                {s.label}
              </button>
              {i < steps.length - 1 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* QUIZ STEP */}
          {step === "quiz" && !quizDone && (
            <motion.div key="daily-quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Step 1 — Quiz</div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{dailyQuestion.text}</h3>
                <div className="flex flex-col gap-2 mb-4" role="radiogroup">
                  {dailyQuestion.answers.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleQuizAnswer(a.id)}
                      role="radio"
                      aria-checked={quizAnswer === a.id}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        quizAnswer === a.id
                          ? "border-neon-pink bg-neon-pink/10 text-foreground"
                          : "border-border/50 bg-card text-muted-foreground hover:border-border"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <Button onClick={confirmQuiz} disabled={!quizAnswer} className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl w-full">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}

          {/* LYRIC STEP */}
          {step === "lyric" && !lyricDone && (
            <motion.div key="daily-lyric" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Step 2 — Lyric</div>
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{dailyLyric.prompt}</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {dailyLyric.options.map((opt, i) => {
                    let cls = "border-border/50 bg-card text-foreground hover:border-border"
                    if (lyricAnswer !== null) {
                      if (i === dailyLyric.answerIndex) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      else if (i === lyricAnswer && !lyricCorrect) cls = "border-red-500 bg-red-500/10 text-red-400"
                      else cls = "border-border/30 bg-card/50 text-muted-foreground opacity-50"
                    }
                    return (
                      <button key={i} onClick={() => handleLyricSelect(i)} disabled={lyricAnswer !== null}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:cursor-default ${cls}`}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {lyricAnswer !== null && (
                  <div className="text-center mb-4">
                    {lyricCorrect ? (
                      <span className="text-emerald-400 text-sm flex items-center justify-center gap-1"><CheckCircle2 className="size-4" /> Correct! +10 XP</span>
                    ) : (
                      <span className="text-red-400 text-sm flex items-center justify-center gap-1"><XCircle className="size-4" /> The answer was &quot;{dailyLyric.options[dailyLyric.answerIndex]}&quot;</span>
                    )}
                  </div>
                )}
                <Button onClick={confirmLyric} disabled={lyricAnswer === null} className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl w-full">
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}

          {/* MEMORY STEP */}
          {step === "memory" && !memoryDone && (
            <motion.div key="daily-memory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Step 3 — Mini Memory</div>
                <p className="text-sm text-muted-foreground mb-4 text-center">Match all {miniPairs} pairs to finish.</p>
                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-4">
                  {memCards.map((card) => {
                    const isFlipped = card.flipped || card.matched
                    const LucideIcon = iconMap[card.icon] || Sparkles
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleMemCard(card.id)}
                        className={`aspect-square rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                          card.matched ? "border-emerald-500/50 bg-emerald-500/10" :
                          isFlipped ? "border-neon-pink/50 bg-neon-pink/10" :
                          "border-border/50 bg-secondary hover:border-border"
                        }`}
                        aria-label={isFlipped ? card.label : "Hidden card"}
                      >
                        {isFlipped ? (
                          <LucideIcon className={`size-6 ${card.matched ? "text-emerald-400" : "text-neon-pink"}`} />
                        ) : (
                          <div className="w-5 h-5 rounded bg-muted" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* CLAIM */}
          {step === "claim" && allDone && (
            <motion.div key="daily-claim" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="rounded-2xl bg-card border border-border/50 p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7] flex items-center justify-center mx-auto mb-4">
                  <Zap className="size-8" style={{ color: "white" }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">All steps complete!</h2>
                <p className="text-sm text-muted-foreground mb-6">Claim your daily reward.</p>
                <Button
                  onClick={handleClaim}
                  size="lg"
                  className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl px-8 h-12 animate-pulse-glow"
                >
                  <Zap className="size-4" /> Claim +70 XP
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
