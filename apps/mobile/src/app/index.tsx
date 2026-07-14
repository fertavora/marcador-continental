import { Text, View } from "react-native"
import { useRouter } from "expo-router"

import { Button } from "@/components/button"
import { useGames } from "@/hooks/use-storage"

export default function HomeScreen() {
  const router = useRouter()
  const games = useGames()
  const inProgress = games
    ?.filter((game) => game.status === "in-progress")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background p-6 dark:bg-background-dark">
      <View className="gap-2">
        <Text className="text-center text-3xl font-bold text-foreground dark:text-foreground-dark">
          Marcador Continental
        </Text>
        <Text className="text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Anotador para el juego de cartas Continental
        </Text>
      </View>

      <View className="w-full gap-3">
        {inProgress && (
          <Button size="lg" onPress={() => router.push(`/juego/${inProgress.id}`)}>
            Continuar partida
          </Button>
        )}
        <Button
          size="lg"
          variant={inProgress ? "outline" : "default"}
          onPress={() => router.push("/juego/nuevo")}
        >
          Nueva partida
        </Button>
        <Button size="lg" variant="outline" onPress={() => router.push("/historial")}>
          Historial
        </Button>
      </View>
    </View>
  )
}
