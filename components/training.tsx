"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileText,
  GraduationCap,
  ImagePlus,
  LinkIcon,
  Pencil,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useConfirmAction } from "@/components/confirm-action-dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  defaultRoles,
  roleMetadata,
  type Permission,
  type UserRole,
} from "@/lib/roles-permissions"
import {
  deleteTrainingTopic,
  listTrainingTopics,
  saveTrainingTopic,
  type TrainingContentType,
  type TrainingTopicRecord,
} from "@/lib/supabase/training"
import { uploadPublicFile } from "@/lib/supabase/storage"

interface TrainingProps {
  user: { id?: string; name: string; email: string; role: UserRole; permissions?: Permission[] }
  onBack: () => void
}

type TrainingTopic = TrainingTopicRecord
type TrainingTopicFormData = Omit<TrainingTopic, "id"> & {
  mediaFile?: File | null
}

const roleOptions = defaultRoles

const contentTypeLabels: Record<TrainingContentType, string> = {
  text: "Texto",
  photo: "Foto",
  video: "Video",
  link: "Enlace",
  pdf: "PDF",
}

const contentTypeIcons = {
  text: FileText,
  photo: ImagePlus,
  video: PlayCircle,
  link: LinkIcon,
  pdf: FileText,
}

function getRoleLabel(role: UserRole | "general") {
  if (role === "general") return "General"
  return roleMetadata[role]?.label ?? role
}

function sortTopics(topics: TrainingTopic[]) {
  return [...topics].sort((a, b) => {
    const categorySort = getRoleLabel(a.category).localeCompare(getRoleLabel(b.category))
    if (categorySort !== 0) return categorySort
    return a.order - b.order
  })
}

export function Training({ user, onBack }: TrainingProps) {
  const [topics, setTopics] = useState<TrainingTopic[]>([])
  const [query, setQuery] = useState("")
  const [selectedRoleView, setSelectedRoleView] = useState<UserRole | "general" | null>(null)
  const [editingTopic, setEditingTopic] = useState<TrainingTopic | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDefaults, setModalDefaults] = useState<{
    category: UserRole | "general"
    visibleTo: UserRole[]
    order: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { confirmAction, confirmDialog } = useConfirmAction()

  const canAdd = user.role === "admin"
  const canEdit = user.role === "admin"
  const canDelete = user.role === "admin"

  useEffect(() => {
    let isMounted = true

    listTrainingTopics()
      .then((storedTopics) => {
        if (!isMounted) return
        setTopics(storedTopics)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las capacitaciones.",
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleTopics = useMemo(() => {
    return sortTopics(
      topics.filter((topic) => {
        const roleCanSee =
          user.role === "admin" || topic.visibleTo.includes(user.role)

        return roleCanSee
      }),
    )
  }, [topics, user.role])

  const roleCards = useMemo(() => {
    const baseCards =
      user.role === "admin"
        ? [...roleOptions]
        : roleOptions.filter((role) => role === user.role)
    const hasGeneralTopics = visibleTopics.some((topic) => topic.category === "general")

    return [
      ...baseCards,
      ...(hasGeneralTopics || user.role === "admin" ? (["general"] as const) : []),
    ]
  }, [user.role, visibleTopics])

  const selectedRoleTopics = useMemo(() => {
    if (!selectedRoleView) return []

    const normalizedQuery = query.trim().toLowerCase()

    return sortTopics(
      visibleTopics.filter((topic) => {
        const matchesRole = topic.category === selectedRoleView
        const matchesQuery =
          !normalizedQuery ||
          topic.title.toLowerCase().includes(normalizedQuery) ||
          topic.summary.toLowerCase().includes(normalizedQuery) ||
          topic.body.toLowerCase().includes(normalizedQuery)

        return matchesRole && matchesQuery
      }),
    )
  }, [query, selectedRoleView, visibleTopics])

  const selectedTopicNavigation = useMemo(() => {
    if (!selectedTopic) {
      return {
        currentStep: 0,
        totalSteps: 0,
        previousTopic: null,
        nextTopic: null,
      }
    }

    const routeTopics = sortTopics(
      visibleTopics.filter((topic) => topic.category === selectedTopic.category),
    )
    const currentIndex = routeTopics.findIndex((topic) => topic.id === selectedTopic.id)

    return {
      currentStep: currentIndex >= 0 ? currentIndex + 1 : 0,
      totalSteps: routeTopics.length,
      previousTopic: currentIndex > 0 ? routeTopics[currentIndex - 1] : null,
      nextTopic:
        currentIndex >= 0 && currentIndex < routeTopics.length - 1
          ? routeTopics[currentIndex + 1]
          : null,
    }
  }, [selectedTopic, visibleTopics])

  const handleCreate = () => {
    if (!canAdd) return
    const category = selectedRoleView ?? "general"
    const defaultVisibleTo =
      category === "general" ? [...roleOptions] : [category]
    const nextOrder =
      topics.filter((topic) => topic.category === category).length + 1

    setEditingTopic(null)
    setModalDefaults({
      category,
      visibleTo: defaultVisibleTo,
      order: nextOrder,
    })
    setIsModalOpen(true)
  }

  const handleEditTopic = async (topic: TrainingTopic) => {
    if (!canEdit) return
    const confirmed = await confirmAction({
      title: "Editar tema",
      description: `Vas a modificar "${topic.title}".`,
      confirmLabel: "Editar",
    })
    if (!confirmed) return
    setEditingTopic(topic)
    setModalDefaults(null)
    setIsModalOpen(true)
  }

  const handleSaveTopic = async (topicData: TrainingTopicFormData) => {
    setIsSaving(true)
    setErrorMessage("")

    try {
      const uploadedMedia = topicData.mediaFile
        ? await uploadPublicFile({
            bucket: "training-media",
            file: topicData.mediaFile,
            folder: "training",
          })
        : null
      const savedTopic = await saveTrainingTopic({
        id: editingTopic?.id,
        title: topicData.title,
        category: topicData.category,
        order: topicData.order,
        summary: topicData.summary,
        body: topicData.body,
        contentType: topicData.contentType,
        mediaUrl: uploadedMedia?.publicUrl ?? topicData.mediaUrl,
        visibleTo: topicData.visibleTo,
        userId: user.id,
      })

      setTopics((currentTopics) => {
        if (editingTopic) {
          return currentTopics.map((topic) =>
            topic.id === editingTopic.id ? savedTopic : topic,
          )
        }

        return sortTopics([...currentTopics, savedTopic])
      })

      if (selectedTopic?.id === savedTopic.id) {
        setSelectedTopic(savedTopic)
      }

      setIsModalOpen(false)
      setEditingTopic(null)
      setModalDefaults(null)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo guardar la capacitacion.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    if (!canDelete) return
    const topic = topics.find((item) => item.id === topicId)
    const confirmed = await confirmAction({
      title: "Eliminar tema",
      description: `Esta accion eliminara "${topic?.title ?? "este tema"}".`,
      confirmLabel: "Eliminar",
    })
    if (!confirmed) return

    try {
      await deleteTrainingTopic(topicId)
      setTopics((currentTopics) =>
        currentTopics.filter((topic) => topic.id !== topicId),
      )
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(null)
      }
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la capacitacion.",
      )
    }
  }

  if (selectedTopic) {
    return (
      <TrainingDetail
        topic={selectedTopic}
        currentStep={selectedTopicNavigation.currentStep}
        totalSteps={selectedTopicNavigation.totalSteps}
        previousTopic={selectedTopicNavigation.previousTopic}
        nextTopic={selectedTopicNavigation.nextTopic}
        canEdit={canEdit}
        canDelete={canDelete}
        onBack={() => setSelectedTopic(null)}
        onNavigateTopic={setSelectedTopic}
        onEdit={() => handleEditTopic(selectedTopic)}
        onDelete={() => handleDeleteTopic(selectedTopic.id)}
      >
        <TrainingTopicModal
          isOpen={isModalOpen}
          topic={editingTopic}
          defaults={modalDefaults}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTopic(null)
            setModalDefaults(null)
          }}
          onSave={handleSaveTopic}
          isSaving={isSaving}
        />
        {confirmDialog}
      </TrainingDetail>
    )
  }

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
              <h1 className="text-lg font-bold text-foreground">
                {selectedRoleView ? getRoleLabel(selectedRoleView) : "Capacitacion"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedRoleView
                  ? "Ruta de pasos de capacitacion"
                  : "Contenido organizado por rol"}
              </p>
            </div>
            {selectedRoleView && canAdd ? (
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo paso
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
            Cargando capacitaciones...
          </div>
        ) : null}

        {!isLoading && !selectedRoleView ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roleCards.map((role, index) => {
              const count = visibleTopics.filter((topic) => topic.category === role).length
              const roleInfo = role === "general" ? null : roleMetadata[role]

              return (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setSelectedRoleView(role)
                  }}
                  className="group min-h-48 rounded-lg border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg bg-primary/10 p-3 text-primary">
                      <GraduationCap className="h-6 w-6" />
                    </span>
                    <Badge variant="secondary">
                      {count} {count === 1 ? "paso" : "pasos"}
                    </Badge>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">
                    {getRoleLabel(role)}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {role === "general"
                      ? "Capacitaciones transversales para varios roles."
                      : roleInfo?.description ?? "Capacitacion especifica por rol."}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Abrir ruta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              )
            })}
          </div>
        ) : null}

        {!isLoading && selectedRoleView ? (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedRoleView(null)
                  setQuery("")
                }}
                className="w-fit gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Roles
              </Button>
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Buscar paso"
                />
              </div>
            </div>

            {selectedRoleTopics.length ? (
              <div className="overflow-x-auto pb-4">
                <div className="flex min-w-max items-stretch gap-3">
                  {selectedRoleTopics.map((topic, index) => (
                    <div key={topic.id} className="flex items-center gap-3">
                      <TrainingStepCard
                        topic={topic}
                        stepNumber={index + 1}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onOpen={() => setSelectedTopic(topic)}
                        onEdit={() => handleEditTopic(topic)}
                        onDelete={() => handleDeleteTopic(topic.id)}
                      />
                      {index < selectedRoleTopics.length - 1 ? (
                        <ArrowRight className="h-6 w-6 flex-none text-muted-foreground" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium text-foreground">
                  No hay pasos para {getRoleLabel(selectedRoleView)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {canAdd
                    ? "Crea el primer paso para iniciar esta ruta."
                    : "Cuando el administrador agregue contenido, aparecera aqui."}
                </p>
                {canAdd ? (
                  <Button onClick={handleCreate} className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Crear primer paso
                  </Button>
                ) : null}
              </div>
            )}
          </section>
        ) : null}

        {!isLoading && !selectedRoleView && !roleCards.length ? (
          <div className="rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">
              No hay capacitaciones disponibles
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando el administrador agregue contenido para tu rol, aparecera aqui.
            </p>
          </div>
        ) : null}
      </main>

      <TrainingTopicModal
        isOpen={isModalOpen}
        topic={editingTopic}
        defaults={modalDefaults}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTopic(null)
          setModalDefaults(null)
        }}
        onSave={handleSaveTopic}
        isSaving={isSaving}
      />
      {confirmDialog}
    </div>
  )
}

type TrainingPreview = {
  title: string
  contentType: TrainingContentType
  mediaUrl: string
}

function TrainingMedia({
  topic,
  onPreview,
}: {
  topic: TrainingTopic
  onPreview: (preview: TrainingPreview) => void
}) {
  if (!topic.mediaUrl) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Sin adjunto multimedia
      </div>
    )
  }

  if (topic.contentType === "photo") {
    return (
      <button
        type="button"
        onClick={() =>
          onPreview({
            title: topic.title,
            contentType: topic.contentType,
            mediaUrl: topic.mediaUrl!,
          })
        }
        className="group relative block w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <img
          src={topic.mediaUrl}
          alt=""
          className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 top-3 rounded-lg bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
    )
  }

  if (topic.contentType === "video") {
    return (
      <button
        type="button"
        onClick={() =>
          onPreview({
            title: topic.title,
            contentType: topic.contentType,
            mediaUrl: topic.mediaUrl!,
          })
        }
        className="flex min-h-32 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
      >
        <PlayCircle className="h-5 w-5 text-primary" />
        Ver video
      </button>
    )
  }

  if (topic.contentType === "link" || topic.contentType === "pdf") {
    return (
      <button
        type="button"
        onClick={() =>
          onPreview({
            title: topic.title,
            contentType: topic.contentType,
            mediaUrl: topic.mediaUrl!,
          })
        }
        className="flex min-h-32 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
      >
        {topic.contentType === "pdf" ? (
          <FileText className="h-5 w-5 text-primary" />
        ) : (
          <LinkIcon className="h-5 w-5 text-primary" />
        )}
        Ver recurso
      </button>
    )
  }

  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
      Contenido de texto
    </div>
  )
}

function TrainingStepCard({
  topic,
  stepNumber,
  canEdit,
  canDelete,
  onOpen,
  onEdit,
  onDelete,
}: {
  topic: TrainingTopic
  stepNumber: number
  canEdit: boolean
  canDelete: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const TypeIcon = contentTypeIcons[topic.contentType]

  return (
    <motion.article
      className="group relative aspect-square w-72 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full flex-col text-left focus:outline-none"
        aria-label={`Abrir ${topic.title}`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            {stepNumber}
          </span>
          <Badge variant="outline" className="gap-1">
            <TypeIcon className="h-3 w-3" />
            {contentTypeLabels[topic.contentType]}
          </Badge>
        </div>

        <div className="mt-5 min-h-0">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Paso {stepNumber}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
            {topic.title}
          </h3>
          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {topic.summary}
          </p>
        </div>

        <div
          className={`mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 ${
            canEdit || canDelete ? "pr-20" : ""
          }`}
        >
          <span className="text-xs text-muted-foreground">
            Orden {topic.order}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Abrir
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </button>

      {(canEdit || canDelete) ? (
        <div className="absolute bottom-4 right-4 flex justify-end gap-2">
          {canEdit ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`Editar ${topic.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onDelete}
              aria-label={`Eliminar ${topic.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  )
}

function TrainingDetail({
  topic,
  currentStep,
  totalSteps,
  previousTopic,
  nextTopic,
  canEdit,
  canDelete,
  onBack,
  onNavigateTopic,
  onEdit,
  onDelete,
  children,
}: {
  topic: TrainingTopic
  currentStep: number
  totalSteps: number
  previousTopic: TrainingTopic | null
  nextTopic: TrainingTopic | null
  canEdit: boolean
  canDelete: boolean
  onBack: () => void
  onNavigateTopic: (topic: TrainingTopic) => void
  onEdit: () => void
  onDelete: () => void
  children: ReactNode
}) {
  const TypeIcon = contentTypeIcons[topic.contentType]
  const [preview, setPreview] = useState<TrainingPreview | null>(null)

  useEffect(() => {
    setPreview(null)
  }, [topic.id])

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
              <h1 className="truncate text-lg font-bold text-foreground">
                {topic.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentStep && totalSteps
                  ? `Paso ${currentStep} de ${totalSteps}`
                  : "Informacion de la capacitacion"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={onEdit}
                  aria-label="Editar capacitacion"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : null}
              {canDelete ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={onDelete}
                  aria-label="Eliminar capacitacion"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-[1fr_360px] lg:p-8">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getRoleLabel(topic.category)}</Badge>
            <Badge variant="outline">Orden {topic.order}</Badge>
            {currentStep && totalSteps ? (
              <Badge variant="outline">
                Paso {currentStep} de {totalSteps}
              </Badge>
            ) : null}
            <Badge variant="outline" className="gap-1">
              <TypeIcon className="h-3 w-3" />
              {contentTypeLabels[topic.contentType]}
            </Badge>
          </div>

          <h2 className="text-2xl font-semibold text-foreground">
            {topic.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {topic.summary}
          </p>

          <div className="mt-6 border-t border-border pt-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {topic.body}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            Actualizado {topic.updatedAt}
          </div>

          <div className="mt-8 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => previousTopic && onNavigateTopic(previousTopic)}
              disabled={!previousTopic}
              className="h-auto justify-start gap-3 px-4 py-3 text-left"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  Paso anterior
                </span>
                <span className="block truncate">
                  {previousTopic?.title ?? "Inicio de la ruta"}
                </span>
              </span>
            </Button>

            <Button
              type="button"
              onClick={() => nextTopic && onNavigateTopic(nextTopic)}
              disabled={!nextTopic}
              className="h-auto justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0">
                <span className="block text-xs opacity-80">
                  Siguiente paso
                </span>
                <span className="block truncate">
                  {nextTopic?.title ?? "Fin de la ruta"}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        </section>

        <aside className="rounded-lg border border-border bg-card p-4">
          <TrainingMedia topic={topic} onPreview={setPreview} />
        </aside>
      </main>

      <TrainingPreviewModal
        preview={preview}
        onClose={() => setPreview(null)}
      />
      {children}
    </div>
  )
}

function TrainingPreviewModal({
  preview,
  onClose,
}: {
  preview: TrainingPreview | null
  onClose: () => void
}) {
  if (!preview) return null

  const isPhoto = preview.contentType === "photo"
  const isVideo = preview.contentType === "video"
  const isPdf = preview.contentType === "pdf"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-zoom-out"
        onClick={onClose}
        aria-label="Cerrar vista ampliada"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              {isPhoto
                ? "Imagen"
                : isVideo
                  ? "Video"
                  : isPdf
                    ? "PDF"
                    : "Recurso"}
            </p>
            <h3 className="truncate text-lg font-semibold text-foreground">
              {preview.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild type="button" variant="outline" size="sm">
              <a href={preview.mediaUrl} target="_blank" rel="noreferrer">
                Abrir
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-3">
          {isPhoto ? (
            <img
              src={preview.mediaUrl}
              alt={preview.title}
              className="max-h-[78vh] max-w-full object-contain"
            />
          ) : isVideo ? (
            <video
              src={preview.mediaUrl}
              controls
              className="max-h-[78vh] w-full max-w-5xl rounded-md bg-black"
            />
          ) : (
            <iframe
              src={preview.mediaUrl}
              title={preview.title}
              className="h-[78vh] w-full rounded-md border-0 bg-white"
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

function TrainingTopicModal({
  isOpen,
  topic,
  defaults,
  onClose,
  onSave,
  isSaving,
}: {
  isOpen: boolean
  topic: TrainingTopic | null
  defaults?: {
    category: UserRole | "general"
    visibleTo: UserRole[]
    order: number
  } | null
  onClose: () => void
  onSave: (topic: TrainingTopicFormData) => void
  isSaving?: boolean
}) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<UserRole | "general">("general")
  const [order, setOrder] = useState(1)
  const [summary, setSummary] = useState("")
  const [body, setBody] = useState("")
  const [contentType, setContentType] = useState<TrainingContentType>("text")
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [visibleTo, setVisibleTo] = useState<UserRole[]>(["encuestador"])
  const [updatedAt, setUpdatedAt] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    if (!isOpen) return

    setTitle(topic?.title ?? "")
    setCategory(topic?.category ?? defaults?.category ?? "general")
    setOrder(topic?.order ?? defaults?.order ?? 1)
    setSummary(topic?.summary ?? "")
    setBody(topic?.body ?? "")
    setContentType(topic?.contentType ?? "text")
    setMediaUrl(topic?.mediaUrl ?? "")
    setMediaFile(null)
    setVisibleTo(topic?.visibleTo ?? defaults?.visibleTo ?? ["encuestador"])
    setUpdatedAt(topic?.updatedAt ?? new Date().toISOString().split("T")[0])
  }, [defaults, isOpen, topic])

  const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setMediaFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setMediaUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const toggleRole = (role: UserRole) => {
    setVisibleTo((currentRoles) =>
      currentRoles.includes(role)
        ? currentRoles.filter((currentRole) => currentRole !== role)
        : [...currentRoles, role],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !summary.trim() || !body.trim() || !visibleTo.length) {
      return
    }

    onSave({
      title: title.trim(),
      category,
      order,
      summary: summary.trim(),
      body: body.trim(),
      contentType,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaFile,
      visibleTo,
      updatedAt,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-card shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-xl font-semibold text-foreground">
              {topic ? "Editar tema" : "Nuevo tema"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-accent"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_140px]">
              <div className="grid gap-2">
                <label htmlFor="training-title" className="text-sm font-medium">
                  Titulo
                </label>
                <Input
                  id="training-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ej: Como registrar evidencias"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="training-order" className="text-sm font-medium">
                  Orden
                </label>
                <Input
                  id="training-order"
                  type="number"
                  min={1}
                  value={order}
                  onChange={(event) => setOrder(Number(event.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as UserRole | "general")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={contentType}
                  onValueChange={(value) =>
                    setContentType(value as TrainingContentType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(contentTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="training-date" className="text-sm font-medium">
                  Actualizado
                </label>
                <Input
                  id="training-date"
                  type="date"
                  value={updatedAt}
                  onChange={(event) => setUpdatedAt(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="training-summary" className="text-sm font-medium">
                Resumen
              </label>
              <Input
                id="training-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Descripcion corta del tema"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="training-body" className="text-sm font-medium">
                Contenido
              </label>
              <textarea
                id="training-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={6}
                placeholder="Explicacion completa del tema"
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium">Adjunto multimedia</label>
              <Input
                value={mediaUrl}
                onChange={(event) => setMediaUrl(event.target.value)}
                placeholder="URL de video, imagen, enlace o PDF"
              />
              <Input
                type="file"
                accept="image/*,video/*,.pdf"
              onChange={handleMediaUpload}
              />
            </div>

            <div className="grid gap-3">
              <p className="text-sm font-medium">Visibilidad por rol</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {roleOptions.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={visibleTo.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="h-4 w-4"
                    />
                    <span>{getRoleLabel(role)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border p-5">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !title.trim() ||
                !summary.trim() ||
                !body.trim() ||
                !visibleTo.length ||
                isSaving
              }
            >
              {isSaving ? "Guardando..." : "Guardar tema"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
