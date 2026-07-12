import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlayerAvatar } from "@/components/player-avatar"
import { getTotals, ROUND_NAMES, type Game } from "@/lib/game"

export function ScoreboardTable({ game }: { game: Game }) {
  const totals = getTotals(game)
  const sortedPlayers = [...game.players].sort(
    (a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0)
  )

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 w-14 bg-background">
              Ronda
            </TableHead>
            {sortedPlayers.map((player) => (
              <TableHead key={player.id} className="overflow-hidden text-center">
                <div className="flex flex-col items-center gap-1">
                  <PlayerAvatar player={player} />
                  <span className="max-w-full truncate text-xs">{player.name}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {game.rounds.map((round, roundIndex) => (
            <TableRow key={roundIndex}>
              <TableCell
                className="sticky left-0 w-14 bg-background font-medium"
                title={ROUND_NAMES[roundIndex]}
              >
                {roundIndex + 1}
              </TableCell>
              {sortedPlayers.map((player) => (
                <TableCell key={player.id} className="text-center">
                  {round.scores[player.id] ?? 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow className="border-t-2">
            <TableCell className="sticky left-0 w-14 bg-background font-semibold">
              Total
            </TableCell>
            {sortedPlayers.map((player) => (
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
