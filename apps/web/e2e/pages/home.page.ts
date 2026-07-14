import type { Locator, Page } from "@playwright/test"

export class HomePage {
  readonly page: Page
  readonly continueGameButton: Locator
  readonly newGameButton: Locator
  readonly historialButton: Locator

  constructor(page: Page) {
    this.page = page
    this.continueGameButton = page.getByTestId("home-continue-game")
    this.newGameButton = page.getByTestId("home-new-game")
    this.historialButton = page.getByTestId("home-historial")
  }

  async goto() {
    await this.page.goto("/")
  }
}
