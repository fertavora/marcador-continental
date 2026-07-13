import { useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { PlayerAvatar } from "@/components/player-avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getWinner, type Game, type Player } from "@/lib/game"
import { deleteGame } from "@/lib/storage"

// Base UI only opens a tooltip on focus when the trigger matches CSS
// `:focus-visible`, which pointer/touch-driven focus usually does not — so a
// tap alone won't open it. Control the open state ourselves and toggle it on
// tap/click so mobile (no hover) still has a way to see the player's name.
function PlayerAvatarTooltip({ player }: { player: Player }) {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={
          <span
            tabIndex={0}
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen((o) => !o)
            }}
          />
        }
      >
        <PlayerAvatar player={player} className="size-6 text-[10px]" />
      </TooltipTrigger>
      <TooltipContent>{player.name}</TooltipContent>
    </Tooltip>
  )
}

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
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{date}</span>
            <div className="flex items-center gap-2">
              <Badge variant={game.status === "completed" ? "secondary" : "outline"}>
                {game.status === "completed" ? "Finalizada" : "En curso"}
              </Badge>
              {/* React bubbles portal clicks through the component tree, not the DOM
                  tree, so without this the AlertDialog's portaled content (cancel,
                  confirm, backdrop dismiss) would still reach the wrapping Link and
                  navigate to the game page. */}
              <div onClick={(e) => e.stopPropagation()}>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        aria-label="Borrar partida"
                        onClick={(e) => e.preventDefault()}
                      />
                    }
                  >
                    <Trash2 />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <Trash2 />
                      </AlertDialogMedia>
                      <AlertDialogTitle className="text-destructive">
                        ¿Borrar esta partida?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-destructive">
                        Se eliminará esta partida del historial de forma permanente. Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteGame(game.id)}
                      >
                        Borrar partida
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {game.players.map((player) => (
              <PlayerAvatarTooltip key={player.id} player={player} />
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
