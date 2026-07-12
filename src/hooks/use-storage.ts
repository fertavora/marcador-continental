"use client"

import { useCallback, useSyncExternalStore } from "react"

import { getConsent, getGame, getGames, getTheme, subscribe, type Consent, type Theme } from "@/lib/storage"
import type { Game } from "@/lib/game"

const UNKNOWN = undefined

export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, getConsent, () => UNKNOWN)
}

export function useTheme(): Theme | null | undefined {
  return useSyncExternalStore(subscribe, getTheme, () => UNKNOWN)
}

export function useGames(): Game[] | undefined {
  return useSyncExternalStore(subscribe, getGames, () => UNKNOWN)
}

export function useGame(id: string): Game | null | undefined {
  const getSnapshot = useCallback(() => getGame(id), [id])
  return useSyncExternalStore(subscribe, getSnapshot, () => UNKNOWN)
}
