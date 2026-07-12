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
import { ROUND_NAMES, type Game } from "@/lib/game"

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

  function reset() {
    setScores({})
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
    const parsed: Record<string, number> = {}
    for (const player of game.players) {
      const raw = scores[player.id]
      parsed[player.id] = raw ? parseInt(raw, 10) || 0 : 0
    }
    onSubmit(parsed)
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom">
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
                onClick={() => setScore(player.id, String(QUICK_BONUS))}
              >
                -10
              </Button>
              <Input
                id={`score-${player.id}`}
                type="number"
                inputMode="numeric"
                className="w-20"
                value={scores[player.id] ?? ""}
                onChange={(e) => setScore(player.id, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
          <SheetFooter className="p-0">
            <Button type="submit">Guardar ronda</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
