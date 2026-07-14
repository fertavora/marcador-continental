"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { PlayerAvatar } from "@/components/player-avatar"
import { ROUND_NAMES, type Game } from "@marcador/core"

const QUICK_BONUS = -10

export function ScoreEntrySheet({
  game,
  roundNumber,
  open,
  onOpenChange,
  onSubmit,
}: {
  game: Game
  roundNumber: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (scores: Record<string, number>) => void
}) {
  const [scores, setScores] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState(false)

  function reset() {
    setScores({})
    setShowErrors(false)
  }

  function setScore(playerId: string, value: string) {
    setScores((prev) => ({ ...prev, [playerId]: value }))
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const missing = game.players.some((player) => !scores[player.id]?.trim())
    if (missing) {
      setShowErrors(true)
      return
    }
    const parsed: Record<string, number> = {}
    for (const player of game.players) {
      parsed[player.id] = parseInt(scores[player.id], 10) || 0
    }
    onSubmit(parsed)
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" data-testid="score-entry-sheet">
        <SheetHeader>
          <SheetTitle>
            Ronda {roundNumber}: {ROUND_NAMES[roundNumber - 1]}
          </SheetTitle>
          <SheetDescription>
            Ingresá los puntos de cada jugador para esta ronda.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-4">
          {game.players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <PlayerAvatar player={player} />
              <Label htmlFor={`score-${player.id}`} className="flex-1">
                {player.name}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid={`score-quick-bonus-${player.id}`}
                onClick={() => setScore(player.id, String(QUICK_BONUS))}
              >
                -10
              </Button>
              <Input
                id={`score-${player.id}`}
                type="number"
                inputMode="numeric"
                className="w-20"
                data-testid={`score-input-${player.id}`}
                value={scores[player.id] ?? ""}
                onChange={(e) => setScore(player.id, e.target.value)}
                placeholder="0"
                aria-invalid={showErrors && !scores[player.id]?.trim()}
              />
            </div>
          ))}
          {showErrors && (
            <p className="text-sm text-destructive" data-testid="score-entry-error">
              Ingresá los puntos de todos los jugadores.
            </p>
          )}
          <SheetFooter className="p-0">
            <Button type="submit" data-testid="score-entry-submit">
              Guardar ronda
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
