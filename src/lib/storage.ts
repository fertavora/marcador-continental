import type { Game } from "@/lib/game"

const CONSENT_COOKIE = "continental-consent"
const THEME_COOKIE = "continental-theme"
const GAMES_KEY = "continental:games"

export type Consent = "accepted" | "declined"
export type Theme = "light" | "dark"

type Listener = () => void
const listeners = new Set<Listener>()

/** Subscribe to local changes made through setConsent/saveGame, for useSyncExternalStore. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify(): void {
  listeners.forEach((listener) => listener())
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

export function getConsent(): Consent | null {
  const value = readCookie(CONSENT_COOKIE)
  return value === "accepted" || value === "declined" ? value : null
}

export function setConsent(value: Consent): void {
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`
  notify()
}

export function getTheme(): Theme | null {
  const value = readCookie(THEME_COOKIE)
  return value === "light" || value === "dark" ? value : null
}

export function setTheme(value: Theme): void {
  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`
  document.documentElement.classList.toggle("dark", value === "dark")
  notify()
}

// useSyncExternalStore requires a stable reference when nothing changed, so
// re-parsing localStorage on every call would otherwise loop forever.
let gamesCache: { raw: string | null; games: Game[] } | null = null

export function getGames(): Game[] {
  const raw = localStorage.getItem(GAMES_KEY)
  if (gamesCache && gamesCache.raw === raw) return gamesCache.games
  let games: Game[] = []
  if (raw) {
    try {
      games = JSON.parse(raw) as Game[]
    } catch {
      games = []
    }
  }
  gamesCache = { raw, games }
  return games
}

export function getGame(id: string): Game | null {
  return getGames().find((game) => game.id === id) ?? null
}

export function saveGame(game: Game): void {
  const games = [...getGames()]
  const index = games.findIndex((g) => g.id === game.id)
  if (index === -1) {
    games.push(game)
  } else {
    games[index] = game
  }
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
  notify()
}
