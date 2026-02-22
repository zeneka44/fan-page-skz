"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress-context"
import cardsData from "@/data/cards.json"
import { motion } from "framer-motion"
import {
  Star, Zap, Crown, Heart, Moon, Flame, Music, Sparkles,
  Gem, Smile, Ghost, Rocket, Timer, MousePointerClick,
  RotateCcw, ArrowLeft, Trophy
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

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  star: Star,
  zap: Zap,
  crown: Crown,
  heart: Heart,
  moon: Moon,
  flame: Flame,
  music: Music,
  sparkles: Sparkles,
  gem: Gem,
  smile: Smile,
  ghost: Ghost,
  rocket: Rocket,
}

interface MemoryCard {
  id: number
  cardId: string
  icon: string
  label: string
  matched: boolean
  flipped: boolean
}

type Screen = "setup" | "game" | "win"

export default function MemoryPage() {
  const { addXP, markVisited, updateMemoryScore } = useProgress()
  const [screen, setScreen] = useState<Screen>("setup")
  const [difficulty, setDifficulty] = useState("easy")
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    markVisited("memory")
  }, [markVisited])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  const preset = cardsData.difficultyPresets.find((p) => p.id === difficulty) || cardsData.difficultyPresets[0]
  const theme = cardsData.themes[0]

  const initGame = useCallback(() => {
    const pairs = preset.pairs
    const available = theme.cards.slice(0, pairs)
    const deck: MemoryCard[] = []
    available.forEach((card, i) => {
      deck.push({ id: i * 2, cardId: card.id, icon: card.icon, label: card.label, matched: false, flipped: false })
      deck.push({ id: i * 2 + 1, cardId: card.id, icon: card.icon, label: card.label, matched: false, flipped: false })
    })
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    setCards(deck)
    setFlippedIds([])
    setMoves(0)
    setTimer(0)
    setIsRunning(true)
    setScreen("game")
  }, [preset, theme])

  const handleCardClick = useCallback((id: number) => {
    if (flippedIds.length >= 2) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.matched || card.flipped) return

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    )
    setCards(newCards)
    const newFlipped = [...flippedIds, id]
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [first, second] = newFlipped
      const c1 = newCards.find((c) => c.id === first)!
      const c2 = newCards.find((c) => c.id === second)!

      if (c1.cardId === c2.cardId) {
        // Match
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) =>
              c.cardId === c1.cardId ? { ...c, matched: true } : c
            )
            // Check win
            if (updated.every((c) => c.matched)) {
              setIsRunning(false)
              const finalTime = timer
              addXP(30)
              updateMemoryScore(difficulty, finalTime, moves + 1)
              toast.success("+30 XP", { description: "Memory game completed!" })
              setTimeout(() => setScreen("win"), 300)
            }
            return updated
          })
          setFlippedIds([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          )
          setFlippedIds([])
        }, 800)
      }
    }
  }, [cards, flippedIds, timer, moves, difficulty, addXP, updateMemoryScore])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const [cols] = preset.grid

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        {/* SETUP */}
        {screen === "setup" && (
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#6C5CE7] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="size-8" style={{ color: "white" }} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Memory Cards</h1>
            <p className="text-muted-foreground mb-8 text-pretty">
              Flip cards and match pairs. Choose your difficulty and see how fast you can clear the board.
            </p>

            {/* Difficulty selector */}
            <div className="flex flex-col gap-3 mb-6">
              {cardsData.difficultyPresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDifficulty(p.id)}
                  className={`px-5 py-4 rounded-xl border text-left transition-all cursor-pointer ${
                    difficulty === p.id
                      ? "border-neon-pink bg-neon-pink/10 text-foreground"
                      : "border-border/50 bg-card text-muted-foreground hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold capitalize">{p.id}</div>
                      <div className="text-xs text-muted-foreground">{p.grid[0]}x{p.grid[1]} grid, {p.pairs} pairs</div>
                    </div>
                    {difficulty === p.id && (
                      <div className="w-4 h-4 rounded-full bg-neon-pink flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={initGame}
                className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl px-8 h-12"
              >
                Start Game
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRules(true)}
                className="border-border/60 rounded-xl h-12"
              >
                How to play
              </Button>
            </div>
          </div>
        )}

        {/* GAME */}
        {screen === "game" && (
          <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/50">
                  <Timer className="size-3 text-neon-pink" />
                  <span className="text-xs font-mono font-semibold text-foreground">{formatTime(timer)}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/50">
                  <MousePointerClick className="size-3 text-neon-violet" />
                  <span className="text-xs font-mono font-semibold text-foreground">{moves}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setIsRunning(false); setScreen("setup") }}
                className="text-muted-foreground text-xs"
              >
                Quit
              </Button>
            </div>

            {/* Card grid */}
            <div
              className="grid gap-2 sm:gap-3 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                maxWidth: cols <= 4 ? "400px" : "560px",
              }}
            >
              {cards.map((card) => {
                const Icon = iconMap[card.icon] || Sparkles
                const isFlipped = card.flipped || card.matched

                return (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-square rounded-xl border transition-all cursor-pointer ${
                      card.matched
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : isFlipped
                        ? "border-neon-pink/50 bg-neon-pink/10"
                        : "border-border/50 bg-card hover:border-border"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isFlipped ? card.label : "Hidden card"}
                  >
                    {isFlipped ? (
                      <Icon
                        className={`size-6 sm:size-8 mx-auto ${card.matched ? "text-emerald-400" : "text-neon-pink"}`}
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-lg bg-secondary" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* WIN */}
        {screen === "win" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="rounded-2xl bg-card border border-border/50 p-8 mb-6">
              <Trophy className="size-10 text-neon-pink mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-1">Board Cleared!</h2>
              <p className="text-sm text-muted-foreground mb-6 capitalize">{difficulty} difficulty</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-secondary/50 p-4">
                  <div className="text-2xl font-bold font-mono text-foreground">{formatTime(timer)}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Time</div>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <div className="text-2xl font-bold font-mono text-neon-pink">{moves}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Moves</div>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <div className="text-2xl font-bold font-mono text-amber-400">+30</div>
                  <div className="text-[10px] text-muted-foreground mt-1">XP</div>
                </div>
              </div>

              {timer < 60 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-4">
                  <Zap className="size-3" /> Under 60s — Fast Memory badge!
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => setScreen("setup")}
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
      </div>

      {/* Rules modal */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="bg-card border-border/50 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">How to Play</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <p>Flip two cards per turn. If they match, they stay face-up.</p>
              <p>Clear all pairs to win. Your time and moves are tracked.</p>
              <p>You earn <span className="text-neon-pink font-semibold">+30 XP</span> per completion.</p>
              <p>Finish in under 60 seconds for the Fast Memory badge.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </main>
  )
}
