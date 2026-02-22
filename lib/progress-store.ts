import badgesData from "@/data/badges.json"

const STORAGE_KEY = "skz-fun-lab-progress-v1"

export interface ProgressState {
  xp: number
  level: number
  badges: string[]
  visitedModes: string[]
  quizResults: Array<{
    profileId: string
    date: string
  }>
  lyricBestStreak: number
  lyricTotalCorrect: number
  memoryBestTime: Record<string, number>
  memoryBestMoves: Record<string, number>
  dailyStreak: number
  dailyLastDate: string | null
  dailyCompletedToday: boolean
}

const defaultState: ProgressState = {
  xp: 0,
  level: 1,
  badges: [],
  visitedModes: [],
  quizResults: [],
  lyricBestStreak: 0,
  lyricTotalCorrect: 0,
  memoryBestTime: {},
  memoryBestMoves: {},
  dailyStreak: 0,
  dailyLastDate: null,
  dailyCompletedToday: false,
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { ...defaultState }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return { ...defaultState }
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or disabled
  }
}

const { xpRules } = badgesData

export function addXP(state: ProgressState, amount: number): ProgressState {
  const newXP = state.xp + amount
  const newLevel = Math.floor(newXP / xpRules.levelEveryXp) + 1
  return { ...state, xp: newXP, level: newLevel }
}

export function unlockBadge(state: ProgressState, badgeId: string): ProgressState {
  if (state.badges.includes(badgeId)) return state
  return { ...state, badges: [...state.badges, badgeId] }
}

export function markVisited(state: ProgressState, mode: string): ProgressState {
  if (state.visitedModes.includes(mode)) return state
  const updated = { ...state, visitedModes: [...state.visitedModes, mode] }
  // Check explorer badge
  const allModes = ["quiz", "lyric", "memory", "daily", "collection"]
  if (allModes.every((m) => updated.visitedModes.includes(m))) {
    return unlockBadge(updated, "explorer")
  }
  return updated
}

export function checkBadges(state: ProgressState): ProgressState {
  let s = { ...state }
  // first-play: if any mode visited
  if (s.visitedModes.length > 0) s = unlockBadge(s, "first-play")
  // lyric-5-streak
  if (s.lyricBestStreak >= 5) s = unlockBadge(s, "lyric-5-streak")
  // memory-under-60
  if (Object.values(s.memoryBestTime).some((t) => t < 60)) s = unlockBadge(s, "memory-under-60")
  // daily streaks
  if (s.dailyStreak >= 3) s = unlockBadge(s, "daily-3")
  if (s.dailyStreak >= 7) s = unlockBadge(s, "daily-7")
  if (s.dailyStreak >= 14) s = unlockBadge(s, "daily-14")
  // explorer
  const allModes = ["quiz", "lyric", "memory", "daily", "collection"]
  if (allModes.every((m) => s.visitedModes.includes(m))) s = unlockBadge(s, "explorer")
  return s
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0]
}
