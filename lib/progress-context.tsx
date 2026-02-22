"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  type ProgressState,
  loadProgress,
  saveProgress,
  addXP as addXPFn,
  unlockBadge as unlockBadgeFn,
  markVisited as markVisitedFn,
  checkBadges,
} from "./progress-store"

interface ProgressContextValue {
  progress: ProgressState
  setProgress: (s: ProgressState) => void
  addXP: (amount: number) => void
  unlockBadge: (id: string) => void
  markVisited: (mode: string) => void
  saveQuizResult: (profileId: string) => void
  updateLyricStats: (correct: number, streak: number) => void
  updateMemoryScore: (difficulty: string, time: number, moves: number) => void
  completeDailyChallenge: () => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<ProgressState>(loadProgress)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProgressState(loadProgress())
    setLoaded(true)
  }, [])

  const persist = useCallback((s: ProgressState) => {
    const checked = checkBadges(s)
    setProgressState(checked)
    saveProgress(checked)
  }, [])

  const setProgress = useCallback(
    (s: ProgressState) => persist(s),
    [persist]
  )

  const addXP = useCallback(
    (amount: number) => {
      setProgressState((prev) => {
        const next = addXPFn(prev, amount)
        const checked = checkBadges(next)
        saveProgress(checked)
        return checked
      })
    },
    []
  )

  const unlockBadge = useCallback(
    (id: string) => {
      setProgressState((prev) => {
        const next = unlockBadgeFn(prev, id)
        saveProgress(next)
        return next
      })
    },
    []
  )

  const markVisited = useCallback(
    (mode: string) => {
      setProgressState((prev) => {
        const next = markVisitedFn(prev, mode)
        const checked = checkBadges(next)
        saveProgress(checked)
        return checked
      })
    },
    []
  )

  const saveQuizResult = useCallback(
    (profileId: string) => {
      setProgressState((prev) => {
        const next = {
          ...prev,
          quizResults: [
            ...prev.quizResults,
            { profileId, date: new Date().toISOString() },
          ],
        }
        saveProgress(next)
        return next
      })
    },
    []
  )

  const updateLyricStats = useCallback(
    (correct: number, streak: number) => {
      setProgressState((prev) => {
        const next = {
          ...prev,
          lyricTotalCorrect: prev.lyricTotalCorrect + correct,
          lyricBestStreak: Math.max(prev.lyricBestStreak, streak),
        }
        const checked = checkBadges(next)
        saveProgress(checked)
        return checked
      })
    },
    []
  )

  const updateMemoryScore = useCallback(
    (difficulty: string, time: number, moves: number) => {
      setProgressState((prev) => {
        const next = {
          ...prev,
          memoryBestTime: {
            ...prev.memoryBestTime,
            [difficulty]:
              prev.memoryBestTime[difficulty] !== undefined
                ? Math.min(prev.memoryBestTime[difficulty], time)
                : time,
          },
          memoryBestMoves: {
            ...prev.memoryBestMoves,
            [difficulty]:
              prev.memoryBestMoves[difficulty] !== undefined
                ? Math.min(prev.memoryBestMoves[difficulty], moves)
                : moves,
          },
        }
        const checked = checkBadges(next)
        saveProgress(checked)
        return checked
      })
    },
    []
  )

  const completeDailyChallenge = useCallback(() => {
    setProgressState((prev) => {
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
      const newStreak =
        prev.dailyLastDate === yesterday ? prev.dailyStreak + 1 : 1
      const next = addXPFn(
        {
          ...prev,
          dailyStreak: newStreak,
          dailyLastDate: today,
          dailyCompletedToday: true,
        },
        70
      )
      const checked = checkBadges(next)
      saveProgress(checked)
      return checked
    })
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = loadProgress()
    const empty = { ...fresh, xp: 0, level: 1, badges: [], visitedModes: [], quizResults: [], lyricBestStreak: 0, lyricTotalCorrect: 0, memoryBestTime: {}, memoryBestMoves: {}, dailyStreak: 0, dailyLastDate: null, dailyCompletedToday: false }
    setProgressState(empty)
    saveProgress(empty)
  }, [])

  if (!loaded) return null

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setProgress,
        addXP,
        unlockBadge,
        markVisited,
        saveQuizResult,
        updateLyricStats,
        updateMemoryScore,
        completeDailyChallenge,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider")
  return ctx
}
