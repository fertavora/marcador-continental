import type { Locator, Page } from "@playwright/test"

export class HistorialPage {
  readonly page: Page
  readonly emptyState: Locator
  readonly gameList: Locator
  readonly deleteAllTrigger: Locator
  readonly deleteAllCancel: Locator
  readonly deleteAllConfirm: Locator

  constructor(page: Page) {
    this.page = page
    this.emptyState = page.getByTestId("historial-empty-state")
    this.gameList = page.getByTestId("historial-game-list")
    this.deleteAllTrigger = page.getByTestId("historial-delete-all-trigger")
    this.deleteAllCancel = page.getByTestId("historial-delete-all-cancel")
    this.deleteAllConfirm = page.getByTestId("historial-delete-all-confirm")
  }

  async goto() {
    await this.page.goto("/historial")
  }

  gameCard(gameId: string): Locator {
    return this.page.getByTestId(`game-card-${gameId}`)
  }

  statusBadge(gameId: string): Locator {
    return this.page.getByTestId(`game-card-status-${gameId}`)
  }

  deleteTrigger(gameId: string): Locator {
    return this.page.getByTestId(`game-card-delete-trigger-${gameId}`)
  }

  deleteCancel(gameId: string): Locator {
    return this.page.getByTestId(`game-card-delete-cancel-${gameId}`)
  }

  deleteConfirm(gameId: string): Locator {
    return this.page.getByTestId(`game-card-delete-confirm-${gameId}`)
  }

  /** Deletes one game via its card's confirm dialog. */
  async deleteGame(gameId: string) {
    await this.deleteTrigger(gameId).click()
    await this.deleteConfirm(gameId).click()
  }

  async deleteAllGames() {
    await this.deleteAllTrigger.click()
    await this.deleteAllConfirm.click()
  }
}
