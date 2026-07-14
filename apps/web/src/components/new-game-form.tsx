"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createGame, MAX_PLAYERS, MIN_PLAYERS } from "@marcador/core"
import { saveGame } from "@/lib/storage"

export function NewGameForm() {
  const router = useRouter()
  const [names, setNames] = useState<string[]>(["", ""])
  const [error, setError] = useState<string | null>(null)

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)))
  }

  function addPlayer() {
    if (names.length >= MAX_PLAYERS) return
    setNames((prev) => [...prev, ""])
  }

  function removePlayer(index: number) {
    if (names.length <= MIN_PLAYERS) return
    setNames((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = names.map((name) => name.trim())
    if (trimmed.some((name) => name.length === 0)) {
      setError("Todos los jugadores necesitan un nombre.")
      return
    }
    const game = createGame(trimmed)
    saveGame(game)
    router.push(`/juego/${game.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-testid="new-game-form">
      <div className="flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={`player-${index}`}>Jugador {index + 1}</Label>
              <Input
                id={`player-${index}`}
                data-testid={`new-game-player-input-${index}`}
                value={name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder="Nombre"
                maxLength={20}
                className="mt-1"
              />
            </div>
            {names.length > MIN_PLAYERS && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Quitar jugador"
                data-testid={`new-game-remove-player-${index}`}
                onClick={() => removePlayer(index)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
      </div>

      {names.length < MAX_PLAYERS && (
        <Button
          type="button"
          variant="outline"
          data-testid="new-game-add-player"
          onClick={addPlayer}
        >
          <Plus /> Agregar jugador
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="new-game-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-2" data-testid="new-game-submit">
        Comenzar partida
      </Button>
    </form>
  )
}
