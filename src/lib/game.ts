import { assignColors } from "@/lib/colors"

export interface Player {
  id: string
  name: string
  color: string
}

export interface Round {
  scores: Record<string, number>
}

export type GameStatus = "in-progress" | "completed"

export interface Game {
  id: string
  createdAt: string
  players: Player[]
  rounds: Round[]
  status: GameStatus
}

export const ROUND_NAMES = [
  "Dos tríos",
  "Un trío y una escalera",
  "Dos escaleras",
  "Tres tríos",
  "Dos tríos y una escalera",
  "Un trío y dos escaleras",
  "Tres escaleras",
]

export const MAX_ROUNDS = ROUND_NAMES.length
export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 6

export function createGame(names: string[]): Game {
  const colors = assignColors(names.length)
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    players: names.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      color: colors[i],
    })),
    rounds: [],
    status: "in-progress",
  }
}

export function addRound(game: Game, scores: Record<string, number>): Game {
  const rounds = [...game.rounds, { scores }]
  return {
    ...game,
    rounds,
    status: rounds.length >= MAX_ROUNDS ? "completed" : "in-progress",
  }
}

export function endGame(game: Game): Game {
  return { ...game, status: "completed" }
}

export function getTotals(game: Game): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const player of game.players) {
    totals[player.id] = 0
  }
  for (const round of game.rounds) {
    for (const [playerId, points] of Object.entries(round.scores)) {
      totals[playerId] = (totals[playerId] ?? 0) + points
    }
  }
  return totals
}

export function getWinner(game: Game): Player | null {
  if (game.status !== "completed") return null
  const totals = getTotals(game)
  return game.players.reduce<Player | null>((winner, player) => {
    if (!winner || totals[player.id] < totals[winner.id]) return player
    return winner
  }, null)
}
