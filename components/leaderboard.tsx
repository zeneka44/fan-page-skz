"use client"

import { Trophy, Crown, Medal, TrendingUp } from "lucide-react"

const players = [
  { rank: 1, name: "NeonStar_97", xp: 14200, badge: "Ultimate", avatar: "NS" },
  { rank: 2, name: "MidnightBias", xp: 12850, badge: "Stan", avatar: "MB" },
  { rank: 3, name: "StageBreaker", xp: 11400, badge: "Stan", avatar: "SB" },
  { rank: 4, name: "ChorusLine", xp: 9870, badge: "Stan", avatar: "CL" },
  { rank: 5, name: "DanceKing_02", xp: 8650, badge: "Super Fan", avatar: "DK" },
  { rank: 6, name: "VocalQueen", xp: 7200, badge: "Super Fan", avatar: "VQ" },
  { rank: 7, name: "RapLineForever", xp: 6450, badge: "Super Fan", avatar: "RL" },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="size-4 text-amber-400" />
  if (rank === 2) return <Medal className="size-4 text-silver" />
  if (rank === 3) return <Medal className="size-4 text-amber-700" />
  return <span className="text-xs text-muted-foreground font-mono w-4 text-center">{rank}</span>
}

function getRankBg(rank: number) {
  if (rank === 1) return "bg-amber-500/10 border-amber-500/30"
  if (rank === 2) return "bg-silver/10 border-silver/20"
  if (rank === 3) return "bg-amber-700/10 border-amber-700/20"
  return "bg-card border-border/30"
}

export function Leaderboard() {
  return (
    <section id="leaderboard" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-4">
            <Trophy className="size-3" />
            <span>Leaderboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Top Stans
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-pretty">
            The most dedicated fans rise to the top. Where do you rank?
          </p>
        </div>

        {/* Leaderboard list */}
        <div className="flex flex-col gap-2.5">
          {players.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all hover:scale-[1.01] ${getRankBg(player.rank)}`}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(player.rank)}
              </div>

              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  player.rank === 1
                    ? "bg-gradient-to-br from-[#FF2D95] to-[#6C5CE7]"
                    : "bg-secondary"
                }`}
                style={{ color: player.rank === 1 ? "white" : undefined }}
              >
                <span className={player.rank === 1 ? "" : "text-muted-foreground"}>{player.avatar}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{player.name}</div>
                <div className="text-[10px] text-muted-foreground">{player.badge}</div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1.5 shrink-0">
                <TrendingUp className="size-3 text-neon-pink" />
                <span className="text-sm font-mono font-semibold text-foreground">{player.xp.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">XP</span>
              </div>
            </div>
          ))}
        </div>

        {/* Your position */}
        <div className="mt-6 rounded-xl border border-neon-pink/30 bg-neon-pink/5 px-4 py-3.5 flex items-center gap-4">
          <div className="w-8 flex items-center justify-center">
            <span className="text-xs text-neon-pink font-mono font-bold">42</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF2D95] to-[#E50914] flex items-center justify-center text-xs font-bold shrink-0" style={{ color: "white" }}>
            YO
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">You</div>
            <div className="text-[10px] text-neon-pink">Super Fan</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <TrendingUp className="size-3 text-neon-pink" />
            <span className="text-sm font-mono font-semibold text-neon-pink">2,350</span>
            <span className="text-[10px] text-muted-foreground">XP</span>
          </div>
        </div>
      </div>
    </section>
  )
}
