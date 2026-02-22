"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress-context"
import quizData from "@/data/quiz.json"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain, ArrowRight, ArrowLeft, RotateCcw, ExternalLink,
  BookmarkPlus, CheckCircle2
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type Screen = "intro" | "question" | "result"

export default function QuizPage() {
  const { progress, addXP, markVisited, saveQuizResult } = useProgress()
  const [screen, setScreen] = useState<Screen>("intro")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [resultProfile, setResultProfile] = useState<typeof quizData.resultProfiles[0] | null>(null)
  const [showRules, setShowRules] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    markVisited("quiz")
  }, [markVisited])

  const questions = quizData.questions
  const total = questions.length

  const calculateResult = useCallback(() => {
    const scores: Record<string, number> = {}
    quizData.resultProfiles.forEach((p) => { scores[p.id] = 0 })

    Object.values(answers).forEach((answerId) => {
      for (const q of questions) {
        const answer = q.answers.find((a) => a.id === answerId)
        if (answer) {
          Object.entries(answer.weights).forEach(([profileId, weight]) => {
            scores[profileId] = (scores[profileId] || 0) + weight
          })
        }
      }
    })

    let maxScore = 0
    let winnerId = quizData.tieBreakers.order[0]
    for (const id of quizData.tieBreakers.order) {
      if ((scores[id] || 0) > maxScore) {
        maxScore = scores[id] || 0
        winnerId = id
      }
    }

    return quizData.resultProfiles.find((p) => p.id === winnerId) || quizData.resultProfiles[0]
  }, [answers, questions])

  const handleAnswer = (answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQ].id]: answerId }))
  }

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ((p) => p + 1)
    } else {
      const result = calculateResult()
      setResultProfile(result)
      addXP(50)
      setScreen("result")
    }
  }

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1)
  }

  const handleSave = () => {
    if (resultProfile && !saved) {
      saveQuizResult(resultProfile.id)
      setSaved(true)
    }
  }

  const handleRetake = () => {
    setScreen("intro")
    setCurrentQ(0)
    setAnswers({})
    setResultProfile(null)
    setSaved(false)
  }

  const currentAnswer = answers[questions[currentQ]?.id]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* INTRO SCREEN */}
          {screen === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#FF2D95] flex items-center justify-center mx-auto mb-6">
                <Brain className="size-8" style={{ color: "white" }} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
                {quizData.meta.title}
              </h1>
              <p className="text-muted-foreground mb-8 text-pretty max-w-md mx-auto">
                Answer {total} questions to discover your listening personality. Your result will be saved to your collection.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setScreen("question")}
                  className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl px-8 h-12"
                >
                  Start Quiz <ArrowRight className="size-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRules(true)}
                  className="border-border/60 rounded-xl h-12"
                >
                  How it works
                </Button>
              </div>
            </motion.div>
          )}

          {/* QUESTION SCREEN */}
          {screen === "question" && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>{currentQ + 1} of {total}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF2D95] to-[#6C5CE7] transition-all duration-500"
                    style={{ width: `${((currentQ + 1) / total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-balance">
                {questions[currentQ].text}
              </h2>

              {/* Answers */}
              <div className="flex flex-col gap-3 mb-8" role="radiogroup" aria-label="Answer options">
                {questions[currentQ].answers.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleAnswer(a.id)}
                    role="radio"
                    aria-checked={currentAnswer === a.id}
                    className={`text-left w-full px-5 py-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      currentAnswer === a.id
                        ? "border-neon-pink bg-neon-pink/10 text-foreground"
                        : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentQ === 0}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 rounded-xl"
                >
                  {currentQ === total - 1 ? "See Result" : "Next"} <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* RESULT SCREEN */}
          {screen === "result" && resultProfile && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="rounded-2xl bg-card border border-border/50 p-8 mb-6">
                <div className="text-xs text-neon-pink font-medium mb-3">Your vibe is</div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{resultProfile.title}</h2>
                <p className="text-neon-violet font-medium text-sm mb-4">{resultProfile.subtitle}</p>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-6">
                  {resultProfile.description}
                </p>

                {/* Tags */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {resultProfile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Recommended links */}
                <div className="flex flex-col gap-2 text-left max-w-sm mx-auto">
                  {resultProfile.recommended.map((rec) => (
                    <a
                      key={rec.label}
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/30 text-sm text-foreground hover:border-neon-pink/30 transition-colors"
                    >
                      <span>{rec.label}</span>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saved}
                  className={`rounded-xl ${saved ? "bg-emerald-600 text-primary-foreground" : "bg-neon-pink text-primary-foreground hover:bg-neon-pink/90"}`}
                >
                  {saved ? (
                    <><CheckCircle2 className="size-4" /> Saved</>
                  ) : (
                    <><BookmarkPlus className="size-4" /> Save to Collection</>
                  )}
                </Button>
                <Button variant="outline" onClick={handleRetake} className="rounded-xl border-border/60">
                  <RotateCcw className="size-4" /> Retake
                </Button>
                <Link href="/play">
                  <Button variant="ghost" className="text-muted-foreground">
                    Back to Play Hub
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
            <DialogTitle className="text-foreground">How it works</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <p>{total} questions, single choice each.</p>
              <p>Your answers are weighted toward one of four personality profiles.</p>
              <p>At the end, you will see your result with recommended listening.</p>
              <p>You earn <span className="text-neon-pink font-semibold">+50 XP</span> per completion and can save results to your collection.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </main>
  )
}
