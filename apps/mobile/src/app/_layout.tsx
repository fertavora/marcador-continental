import { useEffect } from "react"
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useColorScheme } from "nativewind"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { ThemeToggle } from "@/components/theme-toggle"
import { hydrate } from "@/lib/storage"
import "../global.css"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  useEffect(() => {
    hydrate().finally(() => SplashScreen.hideAsync())
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colorScheme === "dark" ? "#252525" : "#ffffff" },
            headerTintColor: colorScheme === "dark" ? "#fafafa" : "#252525",
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: colorScheme === "dark" ? "#252525" : "#ffffff" },
            headerRight: () => <ThemeToggle />,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Marcador Continental" }} />
          <Stack.Screen name="historial" options={{ title: "Historial" }} />
          <Stack.Screen name="juego/nuevo" options={{ title: "Nueva partida" }} />
          <Stack.Screen name="juego/[id]" options={{ title: "Partida" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
