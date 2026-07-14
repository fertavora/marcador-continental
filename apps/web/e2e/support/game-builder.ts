import { addRound, createGame, type Game } from "@marcador/core"

/**
 * Builds a Game the same way the app would (via @marcador/core), so seeded
 * fixtures stay in sync with real business rules (e.g. status flips to
 * "completed" automatically once 7 rounds are played).
 */
export function buildGame(names: string[], roundsScores: number[][] = []): Game {
  let game = createGame(names)
  for (const scores of roundsScores) {
    const scoresById: Record<string, number> = {}
    game.players.forEach((player, i) => {
      scoresById[player.id] = scores[i] ?? 0
    })
    game = addRound(game, scoresById)
  }
  return game
}
