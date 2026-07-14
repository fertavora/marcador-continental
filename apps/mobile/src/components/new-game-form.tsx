import { useState } from "react"
import { Text, TextInput, View, useColorScheme } from "react-native"
import { useRouter } from "expo-router"
import { Plus, Trash2 } from "lucide-react-native"
import { createGame, MAX_PLAYERS, MIN_PLAYERS } from "@marcador/core"

import { Button } from "@/components/button"
import { saveGame } from "@/lib/storage"

export function NewGameForm() {
  const router = useRouter()
  const isDark = useColorScheme() === "dark"
  const foreground = isDark ? "#fafafa" : "#343434"
  const [names, setNames] = useState<string[]>(["", ""])
  const [error, setError] = useState<string | null>(null)

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)))
  }

  function addPlayer() {
    if (names.length >= MAX_PLAYERS) return
    setNames((prev) => [...prev, ""])
  }

  function removePlayer(index: number) {
    if (names.length <= MIN_PLAYERS) return
    setNames((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    const trimmed = names.map((name) => name.trim())
    if (trimmed.some((name) => name.length === 0)) {
      setError("Todos los jugadores necesitan un nombre.")
      return
    }
    const game = createGame(trimmed)
    saveGame(game)
    router.replace(`/juego/${game.id}`)
  }

  return (
    <View className="gap-4">
      <View className="gap-3">
        {names.map((name, index) => (
          <View key={index} className="flex-row items-end gap-2">
            <View className="flex-1 gap-1">
              <Text className="text-sm text-foreground dark:text-foreground-dark">
                Jugador {index + 1}
              </Text>
              <TextInput
                value={name}
                onChangeText={(value) => updateName(index, value)}
                placeholder="Nombre"
                placeholderTextColor="#8a8a8a"
                maxLength={20}
                className="rounded-md border border-border px-3 py-2.5 text-foreground dark:border-border-dark dark:text-foreground-dark"
              />
            </View>
            {names.length > MIN_PLAYERS && (
              <Button
                variant="outline"
                size="icon"
                onPress={() => removePlayer(index)}
                accessibilityLabel="Quitar jugador"
              >
                <Trash2 size={18} color={isDark ? "#dd6152" : "#c0402d"} />
              </Button>
            )}
          </View>
        ))}
      </View>

      {names.length < MAX_PLAYERS && (
        <Button variant="outline" onPress={addPlayer}>
          <Plus size={16} color={foreground} />
          <Text className="font-medium text-foreground dark:text-foreground-dark">
            Agregar jugador
          </Text>
        </Button>
      )}

      {error && <Text className="text-sm text-destructive dark:text-destructive-dark">{error}</Text>}

      <Button size="lg" className="mt-2" onPress={handleSubmit}>
        Comenzar partida
      </Button>
    </View>
  )
}
