"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { useGames } from "@/hooks/use-storage"

export default function HistorialPage() {
  const games = useGames()
  const sorted = games
    ? [...games].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : undefined

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Historial</h1>

      {sorted && sorted.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">Todavía no hay partidas guardadas.</p>
          <Button render={<Link href="/juego/nuevo" />}>Nueva partida</Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sorted?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  )
}
