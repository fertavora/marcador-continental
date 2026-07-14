import type { Locator, Page } from "@playwright/test"

export class GamePage {
  readonly page: Page
  readonly heading: Locator
  readonly scoreboard: Locator
  readonly addRoundButton: Locator
  readonly endGameTrigger: Locator
  readonly endGameCancel: Locator
  readonly endGameConfirm: Locator
  readonly winnerBanner: Locator
  readonly historialLink: Locator
  readonly scoreEntrySheet: Locator
  readonly scoreEntrySubmit: Locator
  readonly scoreEntryError: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByTestId("game-round-heading")
    this.scoreboard = page.getByTestId("scoreboard-table")
    this.addRoundButton = page.getByTestId("game-add-round")
    this.endGameTrigger = page.getByTestId("game-end-game-trigger")
    this.endGameCancel = page.getByTestId("game-end-game-cancel")
    this.endGameConfirm = page.getByTestId("game-end-game-confirm")
    this.winnerBanner = page.getByTestId("game-winner-banner")
    this.historialLink = page.getByTestId("game-historial-link")
    this.scoreEntrySheet = page.getByTestId("score-entry-sheet")
    this.scoreEntrySubmit = page.getByTestId("score-entry-submit")
    this.scoreEntryError = page.getByTestId("score-entry-error")
  }

  async goto(gameId: string) {
    await this.page.goto(`/juego/${gameId}`)
  }

  scoreInput(playerId: string): Locator {
    return this.page.getByTestId(`score-input-${playerId}`)
  }

  totalFor(playerId: string): Locator {
    return this.page.getByTestId(`scoreboard-total-${playerId}`)
  }

  roundRow(roundNumber: number): Locator {
    return this.page.getByTestId(`scoreboard-round-${roundNumber}`)
  }

  /** Opens the round sheet, fills each player's score, and saves the round. */
  async playRound(scoresByPlayerId: Record<string, number>) {
    await this.addRoundButton.click()
    for (const [playerId, score] of Object.entries(scoresByPlayerId)) {
      await this.scoreInput(playerId).fill(String(score))
    }
    await this.scoreEntrySubmit.click()
  }

  async endGame() {
    await this.endGameTrigger.click()
    await this.endGameConfirm.click()
  }
}
