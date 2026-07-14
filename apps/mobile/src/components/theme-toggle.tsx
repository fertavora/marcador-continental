import { Pressable } from "react-native"
import { useColorScheme } from "nativewind"
import { Moon, Sun } from "lucide-react-native"

import { useTheme } from "@/hooks/use-storage"
import { setTheme } from "@/lib/storage"

export function ThemeToggle() {
  const theme = useTheme()
  const isDark = theme === "dark"
  // Mirrors the header's own colorScheme-driven tint (see _layout.tsx) since
  // the icon color prop can't be styled via a `dark:` className.
  const { colorScheme } = useColorScheme()

  return (
    <Pressable
      accessibilityLabel={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
      className="size-10 items-center justify-center"
    >
      {isDark ? (
        <Sun size={20} color={colorScheme === "dark" ? "#fafafa" : "#252525"} />
      ) : (
        <Moon size={20} color={colorScheme === "dark" ? "#fafafa" : "#252525"} />
      )}
    </Pressable>
  )
}
