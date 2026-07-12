"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ScoreboardTable } from "@/components/scoreboard-table"
import { ScoreEntrySheet } from "@/components/score-entry-sheet"
import { PlayerAvatar } from "@/components/player-avatar"
import { addRound, getWinner, MAX_ROUNDS } from "@/lib/game"
import { saveGame } from "@/lib/storage"
import { useGame } from "@/hooks/use-storage"

export default function GamePage() {
  const params = useParams<{ id: string }>()
  const game = useGame(params.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  if (game === undefined) return null

  if (!game) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p>No se encontró esa partida.</p>
        <Button render={<Link href="/" />}>Volver al inicio</Button>
      </main>
    )
  }

  function handleRoundSubmit(scores: Record<string, number>) {
    if (!game) return
    saveGame(addRound(game, scores))
  }

  const winner = getWinner(game)
  const isCompleted = game.status === "completed"

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isCompleted ? "Partida finalizada" : `Ronda ${game.rounds.length + 1} de ${MAX_ROUNDS}`}
        </h1>
        <Button variant="outline" render={<Link href="/historial" />}>
          Historial
        </Button>
      </div>

      {isCompleted && winner && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 p-4">
          <PlayerAvatar player={winner} />
          <p className="text-sm">
            <span className="font-semibold">{winner.name}</span> ganó la partida.
          </p>
        </div>
      )}

      <ScoreboardTable game={game} />

      {!isCompleted && (
        <>
          <Button size="lg" onClick={() => setSheetOpen(true)}>
            Agregar ronda
          </Button>
          <ScoreEntrySheet
            game={game}
            roundNumber={game.rounds.length + 1}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            onSubmit={handleRoundSubmit}
          />
        </>
      )}
    </main>
  )
}
