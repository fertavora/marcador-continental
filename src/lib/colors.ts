const PALETTE = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#ec4899", // pink
  "#14b8a6", // teal
]

export function assignColors(count: number): string[] {
  const shuffled = [...PALETTE].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
