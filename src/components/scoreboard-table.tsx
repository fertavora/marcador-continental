import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlayerAvatar } from "@/components/player-avatar"
import { getTotals, type Game } from "@/lib/game"

export function ScoreboardTable({ game }: { game: Game }) {
  const totals = getTotals(game)

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background">Ronda</TableHead>
            {game.players.map((player) => (
              <TableHead key={player.id} className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <PlayerAvatar player={player} />
                  <span className="max-w-16 truncate text-xs">{player.name}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {game.rounds.map((round, index) => (
            <TableRow key={index}>
              <TableCell className="sticky left-0 bg-background font-medium">
                {index + 1}
              </TableCell>
              {game.players.map((player) => (
                <TableCell key={player.id} className="text-center">
                  {round.scores[player.id] ?? 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className="border-t-2">
            <TableCell className="sticky left-0 bg-background font-semibold">
              Total
            </TableCell>
            {game.players.map((player) => (
              <TableCell key={player.id} className="text-center font-semibold">
                {totals[player.id] ?? 0}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
