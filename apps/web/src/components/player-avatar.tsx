import { cn } from "@/lib/utils"
import type { Player } from "@marcador/core"

export function PlayerAvatar({
  player,
  className,
}: {
  player: Player
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        className
      )}
      style={{ backgroundColor: player.color }}
      aria-hidden
    >
      {player.name.charAt(0).toUpperCase()}
    </span>
  )
}
