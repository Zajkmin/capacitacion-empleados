"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  FileImage,
  FolderOpen,
  Lightbulb,
  RefreshCw,
  XCircle,
} from "lucide-react"

import {
  listProjectActivity,
  type ProjectActivityRecord,
  type SectionItemType,
} from "@/lib/supabase/projects"

type ActivityFeedProps = {
  projectId?: string
  showProject?: boolean
  daysLimit?: number
  showAttentionAlert?: boolean
  emptyLabel?: string
}

const typeConfig: Record<
  string,
  { icon: typeof BookOpen; label: string; color: string }
> = {
  rule: { icon: BookOpen, label: "Regla", color: "text-primary bg-primary/20" },
  exception: { icon: AlertTriangle, label: "Excepcion", color: "text-warning bg-warning/20" },
  photo: { icon: Camera, label: "Foto", color: "text-emerald-500 bg-emerald-500/20" },
  error: { icon: XCircle, label: "Error", color: "text-destructive bg-destructive/20" },
  library: { icon: FolderOpen, label: "Biblioteca", color: "text-slate-500 bg-slate-500/20" },
  "visual-learning": { icon: Lightbulb, label: "Aprendizaje visual", color: "text-violet-500 bg-violet-500/20" },
  update: { icon: RefreshCw, label: "Actualizacion", color: "text-cyan-500 bg-cyan-500/20" },
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("es-PY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function getActivityTitle(activity: ProjectActivityRecord) {
  const verb =
    activity.action === "updated"
      ? "Se actualizo"
      : activity.action === "deleted"
        ? "Se elimino"
        : "Se agrego"
  return `${verb} ${activity.title}`
}

function getActivityDescription(activity: ProjectActivityRecord, showProject?: boolean) {
  const context = showProject
    ? `${activity.projectName} - ${activity.sectionTitle}`
    : activity.sectionTitle

  return `${context}${activity.description ? `: ${activity.description}` : ""}`
}

function isInsideDaysLimit(activity: ProjectActivityRecord, daysLimit?: number) {
  if (!daysLimit) return true

  const limitMs = daysLimit * 24 * 60 * 60 * 1000
  const cutoff = Date.now() - limitMs
  return new Date(activity.occurredAt).getTime() >= cutoff
}

export function ActivityFeed({
  projectId,
  showProject = false,
  daysLimit,
  showAttentionAlert = false,
  emptyLabel = "No hay notificaciones recientes.",
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ProjectActivityRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedType, setSelectedType] = useState<SectionItemType | "all">("all")

  useEffect(() => {
    let isMounted = true

    listProjectActivity(projectId)
      .then((items) => {
        if (isMounted) setActivities(items)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las notificaciones.",
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [projectId])

  const filters = useMemo(() => {
    const visibleActivities = activities.filter((activity) =>
      isInsideDaysLimit(activity, daysLimit),
    )
    const uniqueTypes = Array.from(
      new Set(visibleActivities.map((activity) => activity.itemType)),
    )

    return ["all", ...uniqueTypes] as Array<SectionItemType | "all">
  }, [activities, daysLimit])

  const visibleActivities = activities.filter((activity) =>
    isInsideDaysLimit(activity, daysLimit),
  )

  const filteredActivities = visibleActivities.filter(
    (activity) => selectedType === "all" || activity.itemType === selectedType,
  )
  const newCount = visibleActivities.filter(
    (activity) => activity.action === "created",
  ).length
  const updatedCount = visibleActivities.length - newCount

  return (
    <div className="w-full min-w-0 space-y-4 overflow-x-hidden">
      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {showAttentionAlert && !isLoading && visibleActivities.length > 0 ? (
        <div className="min-w-0 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold text-foreground">
                Hay cambios que requieren atencion
              </p>
              <p className="mt-1 break-words text-sm text-muted-foreground">
                {visibleActivities.length} notificacion
                {visibleActivities.length === 1 ? "" : "es"} reciente
                {visibleActivities.length === 1 ? "" : "s"}: {newCount} nuevo
                {newCount === 1 ? "" : "s"} y {updatedCount} modificado
                {updatedCount === 1 ? "" : "s"}.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {filters.length > 1 ? (
        <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1">
          {filters.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`flex-none whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "all" ? "Todo" : typeConfig[type]?.label ?? type}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <div className="min-w-0 rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
          Cargando notificaciones...
        </div>
      ) : null}

      {!isLoading && filteredActivities.length === 0 ? (
        <div className="min-w-0 rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
          <Bell className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </div>
      ) : null}

      <div className="min-w-0 space-y-3">
        {filteredActivities.map((activity, index) => {
          const config = typeConfig[activity.itemType] ?? {
            icon: FileImage,
            label: activity.itemType,
            color: "text-muted-foreground bg-muted",
          }
          const Icon = config.icon

          return (
            <motion.article
              key={activity.id}
              className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-2">
                    <h3 className="min-w-0 break-words font-semibold text-foreground">
                      {getActivityTitle(activity)}
                    </h3>
                    <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatActivityDate(activity.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                    {getActivityDescription(activity, showProject)}
                  </p>
                  <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                    <span className={`max-w-full break-words rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="max-w-full break-words rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {activity.action === "updated"
                        ? "Modificado"
                        : activity.action === "deleted"
                          ? "Eliminado"
                          : "Nuevo"}
                    </span>
                    {activity.action === "created" ? (
                      <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Agregado
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
