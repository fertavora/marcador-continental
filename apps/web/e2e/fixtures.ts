import { test as base } from "@playwright/test"
import type { Game } from "@marcador/core"

import { CONSENT_COOKIE, GAMES_KEY } from "@/lib/storage"
import { HomePage } from "./pages/home.page"
import { NewGamePage } from "./pages/new-game.page"
import { GamePage } from "./pages/game.page"
import { HistorialPage } from "./pages/historial.page"

type Fixtures = {
  /** Seeds `localStorage["continental:games"]` before the page's first script runs. */
  seedGames: (games: Game[]) => Promise<void>
  homePage: HomePage
  newGamePage: NewGamePage
  gamePage: GamePage
  historialPage: HistorialPage
}

export const test = base.extend<Fixtures>({
  // The app can't function without cookie consent (see CookieConsentGate), so
  // every test accepts it upfront instead of clicking through the modal.
  context: async ({ context, baseURL }, use) => {
    await context.addCookies([
      { name: CONSENT_COOKIE, value: "accepted", url: baseURL ?? "http://localhost:3000" },
    ])
    await use(context)
  },

  seedGames: async ({ page }, use) => {
    await use(async (games: Game[]) => {
      // addInitScript re-runs on every navigation within the test, so guard on
      // the key already existing — otherwise a later goto() (e.g. to /historial
      // after playing a round) would stomp on data the app itself just saved.
      await page.addInitScript(
        ({ key, value }) => {
          if (window.localStorage.getItem(key) === null) {
            window.localStorage.setItem(key, value)
          }
        },
        { key: GAMES_KEY, value: JSON.stringify(games) }
      )
    })
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  newGamePage: async ({ page }, use) => {
    await use(new NewGamePage(page))
  },
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page))
  },
  historialPage: async ({ page }, use) => {
    await use(new HistorialPage(page))
  },
})

export { expect } from "@playwright/test"
