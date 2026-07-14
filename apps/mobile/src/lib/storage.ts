import AsyncStorage from "@react-native-async-storage/async-storage"
import { colorScheme } from "nativewind"
import type { Game } from "@marcador/core"

const GAMES_KEY = "continental:games"
const THEME_KEY = "continental:theme"

export type Theme = "light" | "dark"

type Listener = () => void
const listeners = new Set<Listener>()

// AsyncStorage is inherently async, but useSyncExternalStore needs a sync
// getSnapshot — so we keep an in-memory cache, hydrate it once at startup,
// and mutate it synchronously on every write (persisting in the background).
let gamesCache: Game[] = []
let themeCache: Theme = "light"
let hydrated = false

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify(): void {
  listeners.forEach((listener) => listener())
}

export async function hydrate(): Promise<void> {
  if (hydrated) return
  try {
    const raw = await AsyncStorage.getItem(GAMES_KEY)
    gamesCache = raw ? (JSON.parse(raw) as Game[]) : []
  } catch {
    gamesCache = []
  }
  try {
    const rawTheme = await AsyncStorage.getItem(THEME_KEY)
    if (rawTheme === "dark") {
      themeCache = "dark"
      colorScheme.set("dark")
    }
  } catch {
    // keep default "light"
  }
  hydrated = true
  notify()
}

export function isHydrated(): boolean {
  return hydrated
}

function persist(): void {
  AsyncStorage.setItem(GAMES_KEY, JSON.stringify(gamesCache)).catch(() => {})
}

export function getGames(): Game[] {
  return gamesCache
}

export function getGame(id: string): Game | null {
  return gamesCache.find((game) => game.id === id) ?? null
}

export function saveGame(game: Game): void {
  const index = gamesCache.findIndex((g) => g.id === game.id)
  gamesCache = index === -1
    ? [...gamesCache, game]
    : gamesCache.map((g, i) => (i === index ? game : g))
  persist()
  notify()
}

export function deleteGame(id: string): void {
  gamesCache = gamesCache.filter((game) => game.id !== id)
  persist()
  notify()
}

export function deleteAllGames(): void {
  gamesCache = []
  persist()
  notify()
}

export function getTheme(): Theme {
  return themeCache
}

export function setTheme(theme: Theme): void {
  themeCache = theme
  colorScheme.set(theme)
  AsyncStorage.setItem(THEME_KEY, theme).catch(() => {})
  notify()
}
