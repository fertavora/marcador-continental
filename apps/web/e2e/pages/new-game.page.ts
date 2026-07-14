import type { Locator, Page } from "@playwright/test"

const INITIAL_PLAYER_INPUTS = 2

export class NewGamePage {
  readonly page: Page
  readonly form: Locator
  readonly addPlayerButton: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.form = page.getByTestId("new-game-form")
    this.addPlayerButton = page.getByTestId("new-game-add-player")
    this.submitButton = page.getByTestId("new-game-submit")
    this.errorMessage = page.getByTestId("new-game-error")
  }

  async goto() {
    await this.page.goto("/juego/nuevo")
  }

  playerInput(index: number): Locator {
    return this.page.getByTestId(`new-game-player-input-${index}`)
  }

  removePlayerButton(index: number): Locator {
    return this.page.getByTestId(`new-game-remove-player-${index}`)
  }

  /** Fills the player name inputs, clicking "Agregar jugador" as many times as needed. */
  async fillPlayers(names: string[]) {
    const extraInputsNeeded = names.length - INITIAL_PLAYER_INPUTS
    for (let i = 0; i < extraInputsNeeded; i++) {
      await this.addPlayerButton.click()
    }
    for (let i = 0; i < names.length; i++) {
      await this.playerInput(i).fill(names[i])
    }
  }

  async submit() {
    await this.submitButton.click()
  }

  /** Fills player names and submits, ending on the created game's page. */
  async createGame(names: string[]) {
    await this.fillPlayers(names)
    await this.submit()
  }
}
