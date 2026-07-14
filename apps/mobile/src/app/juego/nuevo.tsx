import { ScrollView, Text, View } from "react-native"

import { NewGameForm } from "@/components/new-game-form"

export default function NewGamePage() {
  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="gap-6 p-6">
        <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Nueva partida
        </Text>
        <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Ingresá entre 2 y 6 jugadores para empezar.
        </Text>
        <NewGameForm />
      </View>
    </ScrollView>
  )
}
