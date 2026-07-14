import { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { Trash2 } from "lucide-react-native"
import { getWinner, type Game, type Player } from "@marcador/core"

import { PlayerAvatar } from "@/components/player-avatar"
import { deleteGame } from "@/lib/storage"

// RN has no hover, so tapping the avatar toggles the name bubble directly
// (mirrors web's PlayerAvatarTooltip, which does the same for touch/mobile).
function PlayerAvatarTooltip({
  player,
  open,
  onToggle,
}: {
  player: Player
  open: boolean
  onToggle: () => void
}) {
  return (
    <View>
      <Pressable onPress={onToggle} hitSlop={6}>
        <PlayerAvatar player={player} className="size-7" />
      </Pressable>
      {open && (
        <View
          pointerEvents="none"
          style={{ transform: [{ translateX: -64 }] }}
          className="absolute -top-9 left-1/2 z-10 w-32 items-center"
        >
          <View className="rounded-md bg-foreground px-2 py-1 dark:bg-foreground-dark">
            <Text
              numberOfLines={1}
              className="text-xs text-background dark:text-background-dark"
            >
              {player.name}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export function GameCard({ game }: { game: Game }) {
  const router = useRouter()
  const winner = getWinner(game)
  const [openPlayerId, setOpenPlayerId] = useState<string | null>(null)
  const date = new Date(game.createdAt).toLocaleDateString("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  function confirmDelete() {
    Alert.alert(
      "¿Borrar esta partida?",
      "Se eliminará esta partida del historial de forma permanente. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar partida", style: "destructive", onPress: () => deleteGame(game.id) },
      ]
    )
  }

  return (
    <Pressable
      onPress={() => router.push(`/juego/${game.id}`)}
      className="gap-3 rounded-md border border-border bg-card p-4 active:bg-muted dark:border-border-dark dark:bg-card-dark dark:active:bg-muted-dark"
    >
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
          {date}
        </Text>
        <View className="flex-row items-center gap-2">
          <View
            className={
              game.status === "completed"
                ? "rounded-full bg-muted px-2.5 py-1 dark:bg-muted-dark"
                : "rounded-full border border-border px-2.5 py-1 dark:border-border-dark"
            }
          >
            <Text className="text-xs font-medium text-foreground dark:text-foreground-dark">
              {game.status === "completed" ? "Finalizada" : "En curso"}
            </Text>
          </View>
          <Pressable
            onPress={confirmDelete}
            hitSlop={8}
            className="size-8 items-center justify-center rounded-md bg-destructive dark:bg-destructive-dark"
            accessibilityLabel="Borrar partida"
          >
            <Trash2 size={16} color="white" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-2">
        {game.players.map((player) => (
          <PlayerAvatarTooltip
            key={player.id}
            player={player}
            open={openPlayerId === player.id}
            onToggle={() => setOpenPlayerId((id) => (id === player.id ? null : player.id))}
          />
        ))}
      </View>

      {winner && (
        <Text className="text-sm text-foreground dark:text-foreground-dark">
          Ganó <Text className="font-semibold">{winner.name}</Text>
        </Text>
      )}
    </Pressable>
  )
}
