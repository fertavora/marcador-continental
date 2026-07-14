"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useGames } from "@/hooks/use-storage"

export default function Home() {
  const games = useGames()
  const inProgress = games
    ?.filter((game) => game.status === "in-progress")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Marcador Continental</h1>
        <p className="text-sm text-muted-foreground">
          Anotador para el juego de cartas Continental
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {inProgress && (
          <Button
            size="lg"
            data-testid="home-continue-game"
            render={<Link href={`/juego/${inProgress.id}`} />}
          >
            Continuar partida
          </Button>
        )}
        <Button
          size="lg"
          variant={inProgress ? "outline" : "default"}
          data-testid="home-new-game"
          render={<Link href="/juego/nuevo" />}
        >
          Nueva partida
        </Button>
        <Button
          size="lg"
          variant="outline"
          data-testid="home-historial"
          render={<Link href="/historial" />}
        >
          Historial
        </Button>
      </div>
    </main>
  )
}
