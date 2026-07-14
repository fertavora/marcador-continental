import { test, expect } from "./fixtures"
import { buildGame } from "./support/game-builder"

test.describe("Ingresar puntajes de una ronda", () => {
  test("una partida con una ronda jugada aparece 'En curso' en el historial", async ({
    seedGames,
    gamePage,
    historialPage,
  }) => {
    const game = buildGame(["Ana", "Beto"])
    await seedGames([game])
    await gamePage.goto(game.id)

    await gamePage.playRound({
      [game.players[0].id]: 15,
      [game.players[1].id]: -10,
    })

    await expect(gamePage.heading).toHaveText("Ronda 2 de 7: Un trío y una escalera")
    await expect(gamePage.totalFor(game.players[0].id)).toHaveText("15")
    await expect(gamePage.totalFor(game.players[1].id)).toHaveText("-10")

    await historialPage.goto()
    await expect(historialPage.statusBadge(game.id)).toHaveText("En curso")
  })

  test("jugar las 7 rondas finaliza la partida, muestra el ganador y aparece 'Finalizada' en el historial", async ({
    seedGames,
    gamePage,
    historialPage,
  }) => {
    // Seed the first 6 rounds directly (already covered by the test above) so this
    // test focuses on what happens when the 7th and final round is played.
    const sixRoundsOfTwenty = Array.from({ length: 6 }, () => [20, 0])
    const game = buildGame(["Ana", "Beto"], sixRoundsOfTwenty)
    await seedGames([game])
    await gamePage.goto(game.id)

    await expect(gamePage.heading).toHaveText("Ronda 7 de 7: Tres escaleras")

    await gamePage.playRound({
      [game.players[0].id]: -200,
      [game.players[1].id]: 0,
    })

    await expect(gamePage.heading).toHaveText("Partida finalizada")
    await expect(gamePage.winnerBanner).toContainText("Ana")
    await expect(gamePage.totalFor(game.players[0].id)).toHaveText("-80")
    await expect(gamePage.totalFor(game.players[1].id)).toHaveText("0")
    await expect(gamePage.addRoundButton).not.toBeVisible()

    await historialPage.goto()
    await expect(historialPage.statusBadge(game.id)).toHaveText("Finalizada")
  })
})
