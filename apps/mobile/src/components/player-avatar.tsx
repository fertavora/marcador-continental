import { Text, View } from "react-native"
import type { Player } from "@marcador/core"

import { cn } from "@/lib/cn"

export function PlayerAvatar({
  player,
  className,
  textClassName,
}: {
  player: Player
  className?: string
  textClassName?: string
}) {
  return (
    <View
      className={cn("size-8 shrink-0 items-center justify-center rounded-full", className)}
      style={{ backgroundColor: player.color }}
    >
      <Text className={cn("text-xs font-semibold text-white", textClassName)}>
        {player.name.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}
