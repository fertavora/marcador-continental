import { Alert, FlatList, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { Trash2 } from "lucide-react-native"

import { Button } from "@/components/button"
import { GameCard } from "@/components/game-card"
import { useGames } from "@/hooks/use-storage"
import { deleteAllGames } from "@/lib/storage"

export default function HistorialPage() {
  const router = useRouter()
  const games = useGames()
  const sorted = games
    ? [...games].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : undefined

  function confirmDeleteAll() {
    if (!sorted || sorted.length === 0) return
    Alert.alert(
      "¿Borrar todo el historial?",
      (sorted.length === 1
        ? "Se eliminará la única partida guardada de forma permanente."
        : `Se eliminarán las ${sorted.length} partidas guardadas de forma permanente.`) +
        " Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar todo", style: "destructive", onPress: () => deleteAllGames() },
      ]
    )
  }

  return (
    <View className="flex-1 bg-background p-6 dark:bg-background-dark">
      {sorted && sorted.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Todavía no hay partidas guardadas.
          </Text>
          <Button onPress={() => router.push("/juego/nuevo")}>Nueva partida</Button>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(game) => game.id}
          contentContainerClassName="gap-3"
          renderItem={({ item }) => <GameCard game={item} />}
          ListFooterComponent={
            sorted && sorted.length > 0 ? (
              <Button variant="destructive" size="lg" className="mt-3" onPress={confirmDeleteAll}>
                <Trash2 size={16} color="white" />
                <Text className="font-medium text-destructive-foreground">
                  Borrar todo el historial
                </Text>
              </Button>
            ) : null
          }
        />
      )}
    </View>
  )
}
