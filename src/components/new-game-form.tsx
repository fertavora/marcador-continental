"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createGame, MAX_PLAYERS, MIN_PLAYERS } from "@/lib/game"
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={`player-${index}`}>Jugador {index + 1}</Label>
              <Input
                id={`player-${index}`}
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
                onClick={() => removePlayer(index)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ))}
      </div>

      {names.length < MAX_PLAYERS && (
        <Button type="button" variant="outline" onClick={addPlayer}>
          <Plus /> Agregar jugador
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="mt-2">
        Comenzar partida
      </Button>
    </form>
  )
}
