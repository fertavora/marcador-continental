import { ScrollView, Text, View } from "react-native"
import { getTotals, type Game } from "@marcador/core"

import { PlayerAvatar } from "@/components/player-avatar"

const ROUND_COL_WIDTH = 56

export function ScoreboardTable({ game }: { game: Game }) {
  const totals = getTotals(game)
  const sortedPlayers = [...game.players].sort(
    (a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0)
  )

  return (
    <View className="overflow-hidden rounded-md border border-border dark:border-border-dark">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1">
          <View className="flex-row border-b border-border bg-muted dark:border-border-dark dark:bg-muted-dark">
            <View style={{ width: ROUND_COL_WIDTH }} className="justify-center p-2">
              <Text
                numberOfLines={1}
                className="text-xs font-medium text-foreground dark:text-foreground-dark"
              >
                Ronda
              </Text>
            </View>
            {sortedPlayers.map((player) => (
              <View key={player.id} className="w-24 items-center gap-1 p-2">
                <PlayerAvatar player={player} className="size-6" textClassName="text-[10px]" />
                <Text
                  numberOfLines={1}
                  className="max-w-full text-xs text-foreground dark:text-foreground-dark"
                >
                  {player.name}
                </Text>
              </View>
            ))}
          </View>

          {game.rounds.map((round, roundIndex) => (
            <View
              key={roundIndex}
              className="flex-row border-b border-border dark:border-border-dark"
            >
              <View style={{ width: ROUND_COL_WIDTH }} className="justify-center p-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  {roundIndex + 1}
                </Text>
              </View>
              {sortedPlayers.map((player) => (
                <View key={player.id} className="w-24 items-center justify-center p-2">
                  <Text className="text-sm text-foreground dark:text-foreground-dark">
                    {round.scores[player.id] ?? 0}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <View className="flex-row border-t-2 border-border dark:border-border-dark">
            <View style={{ width: ROUND_COL_WIDTH }} className="justify-center p-2">
              <Text
                numberOfLines={1}
                className="text-sm font-semibold text-foreground dark:text-foreground-dark"
              >
                Total
              </Text>
            </View>
            {sortedPlayers.map((player) => (
              <View key={player.id} className="w-24 items-center justify-center p-2">
                <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                  {totals[player.id] ?? 0}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
