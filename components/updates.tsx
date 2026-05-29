"use client"

import { ArrowLeft, Bell } from "lucide-react"

import { ActivityFeed } from "@/components/activity-feed"

interface UpdatesProps {
  onBack: () => void
}

export function Updates({ onBack }: UpdatesProps) {
  return (
    <div className="min-h-screen overflow-x-hidden pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="p-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="flex-shrink-0 rounded-xl border border-border bg-card p-2 transition-colors hover:bg-card/80"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="flex min-w-0 items-center gap-2 text-lg font-bold text-foreground">
                <Bell className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="truncate">Notificaciones</span>
              </h1>
              <p className="text-sm leading-snug text-muted-foreground">
                Cambios de la ultima semana en todos los proyectos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-5xl p-4 lg:p-8">
        <ActivityFeed
          showProject
          showAttentionAlert
          emptyLabel="Todavia no hay cambios recientes en los proyectos."
        />
      </main>
    </div>
  )
}
