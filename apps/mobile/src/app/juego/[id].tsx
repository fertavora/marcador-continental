import { useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { addRound, endGame, getWinner, MAX_ROUNDS, ROUND_NAMES } from "@marcador/core"

import { Button } from "@/components/button"
import { PlayerAvatar } from "@/components/player-avatar"
import { ScoreboardTable } from "@/components/scoreboard-table"
import { ScoreEntrySheet } from "@/components/score-entry-sheet"
import { useGame } from "@/hooks/use-storage"
import { saveGame } from "@/lib/storage"

export default function GamePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const game = useGame(id)
  const [sheetOpen, setSheetOpen] = useState(false)

  if (game === undefined) return null

  if (!game) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6 dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">
          No se encontró esa partida.
        </Text>
        <Button onPress={() => router.replace("/")}>Volver al inicio</Button>
      </View>
    )
  }

  function handleRoundSubmit(scores: Record<string, number>) {
    saveGame(addRound(game!, scores))
  }

  function confirmEndGame() {
    Alert.alert(
      "¿Terminar la partida?",
      `Se jugaron ${game!.rounds.length} de ${MAX_ROUNDS} rondas. Al terminar ahora, se declarará ganador a quien tenga el puntaje más bajo hasta el momento. Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Terminar juego", onPress: () => saveGame(endGame(game!)) },
      ]
    )
  }

  const winner = getWinner(game)
  const isCompleted = game.status === "completed"

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="gap-6 p-6">
        <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          {isCompleted
            ? "Partida finalizada"
            : `Ronda ${game.rounds.length + 1} de ${MAX_ROUNDS}: ${ROUND_NAMES[game.rounds.length]}`}
        </Text>

        {isCompleted && winner && (
          <View className="flex-row items-center gap-3 rounded-md border border-border bg-muted p-4 dark:border-border-dark dark:bg-muted-dark">
            <PlayerAvatar player={winner} />
            <Text className="text-sm text-foreground dark:text-foreground-dark">
              <Text className="font-semibold">{winner.name}</Text> ganó la partida.
            </Text>
          </View>
        )}

        <ScoreboardTable game={game} />

        {!isCompleted && (
          <View className="gap-3">
            <Button size="lg" onPress={() => setSheetOpen(true)}>
              Agregar ronda
            </Button>
            <Button variant="outline" size="lg" onPress={confirmEndGame}>
              Terminar juego
            </Button>
            <ScoreEntrySheet
              game={game}
              roundNumber={game.rounds.length + 1}
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              onSubmit={handleRoundSubmit}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
