import { useCallback, useSyncExternalStore } from "react"
import type { Game } from "@marcador/core"

import { getGame, getGames, getTheme, isHydrated, subscribe, type Theme } from "@/lib/storage"

export function useGames(): Game[] | undefined {
  const games = useSyncExternalStore(subscribe, getGames, getGames)
  return isHydrated() ? games : undefined
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, getTheme)
}

export function useGame(id: string): Game | null | undefined {
  const getSnapshot = useCallback(() => getGame(id), [id])
  const game = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return isHydrated() ? game : undefined
}
