import { test, expect } from "./fixtures"
import { buildGame } from "./support/game-builder"

test.describe("Borrar partidas en el historial", () => {
  test("borra una partida", async ({ seedGames, historialPage }) => {
    const gameToDelete = buildGame(["Ana", "Beto"])
    const gameToKeep = buildGame(["Cami", "Dani"])
    await seedGames([gameToDelete, gameToKeep])
    await historialPage.goto()

    await expect(historialPage.gameCard(gameToDelete.id)).toBeVisible()
    await expect(historialPage.gameCard(gameToKeep.id)).toBeVisible()

    await historialPage.deleteGame(gameToDelete.id)

    await expect(historialPage.gameCard(gameToDelete.id)).not.toBeVisible()
    await expect(historialPage.gameCard(gameToKeep.id)).toBeVisible()
  })

  test("borra todo el historial", async ({ seedGames, historialPage }) => {
    const games = [
      buildGame(["Ana", "Beto"]),
      buildGame(["Cami", "Dani"]),
      buildGame(["Emi", "Fede"]),
    ]
    await seedGames(games)
    await historialPage.goto()

    for (const game of games) {
      await expect(historialPage.gameCard(game.id)).toBeVisible()
    }

    await historialPage.deleteAllGames()

    await expect(historialPage.emptyState).toBeVisible()
    for (const game of games) {
      await expect(historialPage.gameCard(game.id)).not.toBeVisible()
    }
  })
})
