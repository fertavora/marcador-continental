import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
      <Link href="/" className="font-semibold">
        Marcador Continental
      </Link>
      <ThemeToggle />
    </header>
  )
}
