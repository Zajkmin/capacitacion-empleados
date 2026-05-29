"use client"

import { ArrowLeft, Bell } from "lucide-react"

import { ActivityFeed } from "@/components/activity-feed"

interface UpdatesProps {
  onBack: () => void
}

export function Updates({ onBack }: UpdatesProps) {
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="rounded-xl border border-border bg-card p-2 transition-colors hover:bg-card/80"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Notificaciones
              </h1>
              <p className="text-sm text-muted-foreground">
                Cambios de la última semana en todos los proyectos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 lg:p-8">
        <ActivityFeed
          showProject
          showAttentionAlert
          emptyLabel="Todavia no hay cambios recientes en los proyectos."
        />
      </main>
    </div>
  )
}
