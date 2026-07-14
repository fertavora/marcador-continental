"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GameCard } from "@/components/game-card"
import { useGames } from "@/hooks/use-storage"
import { deleteAllGames } from "@/lib/storage"

export default function HistorialPage() {
  const games = useGames()
  const sorted = games
    ? [...games].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : undefined

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6" data-testid="historial-page">
      <h1 className="text-2xl font-semibold">Historial</h1>

      {sorted && sorted.length === 0 && (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          data-testid="historial-empty-state"
        >
          <p className="text-sm text-muted-foreground">Todavía no hay partidas guardadas.</p>
          <Button render={<Link href="/juego/nuevo" />}>Nueva partida</Button>
        </div>
      )}

      <div className="flex flex-col gap-3" data-testid="historial-game-list">
        {sorted?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {sorted && sorted.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" size="lg" data-testid="historial-delete-all-trigger" />}
          >
            <Trash2 />
            Borrar todo el historial
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle className="text-destructive">
                ¿Borrar todo el historial?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-destructive">
                {sorted.length === 1
                  ? "Se eliminará la única partida guardada de forma permanente."
                  : `Se eliminarán las ${sorted.length} partidas guardadas de forma permanente.`}{" "}
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="historial-delete-all-cancel">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                data-testid="historial-delete-all-confirm"
                onClick={() => deleteAllGames()}
              >
                Borrar todo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  )
}
