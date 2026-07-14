import { useState } from "react"
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native"
import { ROUND_NAMES, type Game } from "@marcador/core"

import { Button } from "@/components/button"
import { PlayerAvatar } from "@/components/player-avatar"

const QUICK_BONUS = -10

export function ScoreEntrySheet({
  game,
  roundNumber,
  open,
  onOpenChange,
  onSubmit,
}: {
  game: Game
  roundNumber: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (scores: Record<string, number>) => void
}) {
  const [scores, setScores] = useState<Record<string, string>>({})

  function reset() {
    setScores({})
  }

  function setScore(playerId: string, value: string) {
    setScores((prev) => ({ ...prev, [playerId]: value }))
  }

  function close() {
    reset()
    onOpenChange(false)
  }

  function handleSubmit() {
    const parsed: Record<string, number> = {}
    for (const player of game.players) {
      const raw = scores[player.id]
      parsed[player.id] = raw ? parseInt(raw, 10) || 0 : 0
    }
    onSubmit(parsed)
    close()
  }

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
      <Pressable className="flex-1 bg-black/40" onPress={close} />
      <View className="rounded-t-2xl bg-card p-4 dark:bg-card-dark">
        <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
          Ronda {roundNumber}: {ROUND_NAMES[roundNumber - 1]}
        </Text>
        <Text className="mb-4 mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Ingresá los puntos de cada jugador para esta ronda.
        </Text>
        <ScrollView className="max-h-96">
          <View className="gap-4">
            {game.players.map((player) => (
              <View key={player.id} className="flex-row items-center gap-3">
                <PlayerAvatar player={player} />
                <Text className="flex-1 text-foreground dark:text-foreground-dark">
                  {player.name}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setScore(player.id, String(QUICK_BONUS))}
                >
                  -10
                </Button>
                <TextInput
                  keyboardType="numbers-and-punctuation"
                  value={scores[player.id] ?? ""}
                  onChangeText={(value) => setScore(player.id, value)}
                  placeholder="0"
                  placeholderTextColor="#8a8a8a"
                  className="w-16 rounded-md border border-border px-2 py-2 text-center text-foreground dark:border-border-dark dark:text-foreground-dark"
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <Button size="lg" className="mt-4" onPress={handleSubmit}>
          Guardar ronda
        </Button>
      </View>
    </Modal>
  )
}
