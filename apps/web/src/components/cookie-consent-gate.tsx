"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SiteHeader } from "@/components/site-header"
import { setConsent, type Consent } from "@/lib/storage"
import { useConsent } from "@/hooks/use-storage"

export function CookieConsentGate({ children }: { children: React.ReactNode }) {
  const consent = useConsent()

  function choose(value: Consent) {
    setConsent(value)
  }

  if (consent === undefined) return null

  if (consent === "declined") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">La app no puede funcionar sin cookies</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Marcador Continental guarda las partidas en tu navegador. Sin aceptar
          las cookies necesarias no es posible usar la aplicación.
        </p>
        <Button data-testid="cookie-consent-accept-declined" onClick={() => choose("accepted")}>
          Aceptar cookies
        </Button>
      </div>
    )
  }

  return (
    <>
      <AlertDialog open={consent === null}>
        <AlertDialogContent data-testid="cookie-consent-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Uso de cookies</AlertDialogTitle>
            <AlertDialogDescription>
              Marcador Continental guarda tus partidas en el navegador para que
              puedas continuar donde lo dejaste. Si no aceptas, la aplicación
              no podrá funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              data-testid="cookie-consent-decline"
              onClick={() => choose("declined")}
            >
              Rechazar
            </Button>
            <AlertDialogAction data-testid="cookie-consent-accept" onClick={() => choose("accepted")}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {consent === "accepted" ? (
        <>
          <SiteHeader />
          {children}
        </>
      ) : null}
    </>
  )
}
