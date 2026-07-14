import { test, expect } from "./fixtures"

test.describe("Crear nueva partida", () => {
  test.beforeEach(async ({ newGamePage }) => {
    await newGamePage.goto()
  })

  test("crea una partida con 2 jugadores", async ({ page, newGamePage, gamePage }) => {
    await newGamePage.createGame(["Ana", "Beto"])

    await expect(page).toHaveURL(/\/juego\/.+/)
    await expect(gamePage.heading).toHaveText("Ronda 1 de 7: Dos tríos")
    await expect(gamePage.scoreboard.getByRole("columnheader", { name: "Ana" })).toBeVisible()
    await expect(gamePage.scoreboard.getByRole("columnheader", { name: "Beto" })).toBeVisible()
  })

  test("crea una partida con 4 jugadores", async ({ page, newGamePage, gamePage }) => {
    const names = ["Ana", "Beto", "Cami", "Dani"]
    await newGamePage.createGame(names)

    await expect(page).toHaveURL(/\/juego\/.+/)
    for (const name of names) {
      await expect(gamePage.scoreboard.getByRole("columnheader", { name })).toBeVisible()
    }
  })

  test("crea una partida con 6 jugadores", async ({ page, newGamePage, gamePage }) => {
    const names = ["Ana", "Beto", "Cami", "Dani", "Emi", "Fede"]
    await newGamePage.fillPlayers(names)
    // 6 is the max allowed, so "Agregar jugador" should no longer be an option.
    await expect(newGamePage.addPlayerButton).not.toBeVisible()
    await newGamePage.submit()

    await expect(page).toHaveURL(/\/juego\/.+/)
    for (const name of names) {
      await expect(gamePage.scoreboard.getByRole("columnheader", { name })).toBeVisible()
    }
  })
})
