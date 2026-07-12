import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayerAvatar } from "@/components/player-avatar"
import { getWinner, type Game } from "@/lib/game"

export function GameCard({ game }: { game: Game }) {
  const winner = getWinner(game)
  const date = new Date(game.createdAt).toLocaleDateString("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <Link href={`/juego/${game.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{date}</span>
            <Badge variant={game.status === "completed" ? "secondary" : "outline"}>
              {game.status === "completed" ? "Finalizada" : "En curso"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {game.players.map((player) => (
              <PlayerAvatar key={player.id} player={player} className="size-6 text-[10px]" />
            ))}
          </div>
          {winner && (
            <p className="text-sm">
              Ganó <span className="font-semibold">{winner.name}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
