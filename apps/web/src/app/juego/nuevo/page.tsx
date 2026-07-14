import { NewGameForm } from "@/components/new-game-form"

export default function NewGamePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Nueva partida</h1>
      <p className="text-sm text-muted-foreground">
        Ingresá entre 2 y 6 jugadores para empezar.
      </p>
      <NewGameForm />
    </main>
  )
}
