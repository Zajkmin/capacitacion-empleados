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
  CalendarClock,
  FileText,
  ImagePlus,
  LinkIcon,
  Pencil,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  userHasPermission,
  type Permission,
  type UserRole,
} from "@/lib/roles-permissions"

interface TrainingProps {
  user: { name: string; email: string; role: UserRole; permissions?: Permission[] }
  onBack: () => void
}

type TrainingContentType = "text" | "photo" | "video" | "link" | "pdf"

interface TrainingTopic {
  id: string
  title: string
  category: UserRole | "general"
  order: number
  summary: string
  body: string
  contentType: TrainingContentType
  mediaUrl?: string
  visibleTo: UserRole[]
  updatedAt: string
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

const initialTopics: TrainingTopic[] = [
  {
    id: "1",
    title: "Tipo de capacitacion",
    category: "general",
    order: 1,
    summary: "Descripcion breve de la capacitacion.",
    body: "Contenido detallado de la capacitacion. En este apartado se podran agregar instrucciones, explicaciones, imagenes, videos, enlaces o documentos relacionados con este tema.",
    contentType: "photo",
    mediaUrl: "https://placehold.co/900x500?text=Visual+de+capacitacion",
    visibleTo: ["admin", "supervisor", "encuestador", "analista_calidad"],
    updatedAt: new Date().toISOString().split("T")[0],
  },
]

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
  const [topics, setTopics] = useState<TrainingTopic[]>(initialTopics)
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<UserRole | "general" | "all">("all")
  const [editingTopic, setEditingTopic] = useState<TrainingTopic | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const canAdd = userHasPermission(user, "add_section")
  const canEdit = userHasPermission(user, "edit_section")
  const canDelete = userHasPermission(user, "delete_section")
  const canManage = canAdd || canEdit || canDelete

  const visibleTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return sortTopics(
      topics.filter((topic) => {
        const roleCanSee =
          user.role === "admin" || topic.visibleTo.includes(user.role)
        const matchesCategory =
          categoryFilter === "all" || topic.category === categoryFilter
        const matchesQuery =
          !normalizedQuery ||
          topic.title.toLowerCase().includes(normalizedQuery) ||
          topic.summary.toLowerCase().includes(normalizedQuery) ||
          topic.body.toLowerCase().includes(normalizedQuery)

        return roleCanSee && matchesCategory && matchesQuery
      }),
    )
  }, [categoryFilter, query, topics, user.role])

  const handleCreate = () => {
    if (!canAdd) return
    setEditingTopic(null)
    setIsModalOpen(true)
  }

  const handleSaveTopic = (topicData: Omit<TrainingTopic, "id">) => {
    if (editingTopic) {
      setTopics((currentTopics) =>
        currentTopics.map((topic) =>
          topic.id === editingTopic.id ? { ...topic, ...topicData } : topic,
        ),
      )
      if (selectedTopic?.id === editingTopic.id) {
        setSelectedTopic({ ...editingTopic, ...topicData })
      }
    } else {
      setTopics((currentTopics) => [
        ...currentTopics,
        { id: Date.now().toString(), ...topicData },
      ])
    }

    setIsModalOpen(false)
    setEditingTopic(null)
  }

  const handleDeleteTopic = (topicId: string) => {
    if (!canDelete) return
    const topic = topics.find((item) => item.id === topicId)
    if (!confirm(`Eliminar "${topic?.title ?? "este tema"}"? Esta accion no se puede deshacer.`)) return

    setTopics((currentTopics) =>
      currentTopics.filter((topic) => topic.id !== topicId),
    )
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(null)
    }
  }

  if (selectedTopic) {
    return (
      <TrainingDetail
        topic={selectedTopic}
        canEdit={canEdit}
        canDelete={canDelete}
        onBack={() => setSelectedTopic(null)}
        onEdit={() => {
          if (!confirm(`Editar "${selectedTopic.title}"?`)) return
          setEditingTopic(selectedTopic)
          setIsModalOpen(true)
        }}
        onDelete={() => handleDeleteTopic(selectedTopic.id)}
      >
        <TrainingTopicModal
          isOpen={isModalOpen}
          topic={editingTopic}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTopic(null)
          }}
          onSave={handleSaveTopic}
        />
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
                Capacitacion
              </h1>
              <p className="text-sm text-muted-foreground">
                Temas, guias y recursos visibles segun rol
              </p>
            </div>
            {canAdd ? (
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo tema
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
        <section className="grid gap-3 rounded-lg border border-border bg-card/50 p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Buscar por titulo, resumen o contenido"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as UserRole | "general" | "all")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorias</SelectItem>
              <SelectItem value="general">General</SelectItem>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {getRoleLabel(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {visibleTopics.length ? (
          <div className="grid gap-4">
            {visibleTopics.map((topic, index) => {
              const TypeIcon = contentTypeIcons[topic.contentType]

              return (
                <motion.article
                  key={topic.id}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                          Rol
                        </Badge>
                        <Badge variant="outline">
                          Orden {topic.order}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {contentTypeLabels[topic.contentType]}
                        </Badge>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {topic.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      {canEdit ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            if (!confirm(`Editar "${topic.title}"?`)) return
                            setEditingTopic(topic)
                            setIsModalOpen(true)
                          }}
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
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteTopic(topic.id)
                          }}
                          aria-label={`Eliminar ${topic.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTopic(topic)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedTopic(topic)
                      }
                    }}
                    className="mt-4 grid w-full cursor-pointer gap-4 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary lg:grid-cols-[1fr_280px]"
                  >
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {topic.body}
                    </p>

                    <TrainingMedia topic={topic} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Actualizado {topic.updatedAt}
                    </span>
                    <span>Ver informacion completa</span>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">
              No hay temas disponibles
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajusta la busqueda o crea contenido para este rol.
            </p>
          </div>
        )}

        {canManage ? (
          <p className="text-xs text-muted-foreground">
            Los cambios se guardan en memoria hasta conectar el backend.
          </p>
        ) : null}
      </main>

      <TrainingTopicModal
        isOpen={isModalOpen}
        topic={editingTopic}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTopic(null)
        }}
        onSave={handleSaveTopic}
      />
    </div>
  )
}

function TrainingMedia({ topic }: { topic: TrainingTopic }) {
  if (!topic.mediaUrl) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Sin adjunto multimedia
      </div>
    )
  }

  if (topic.contentType === "photo") {
    return (
      <img
        src={topic.mediaUrl}
        alt=""
        className="aspect-video w-full rounded-lg object-cover"
      />
    )
  }

  if (topic.contentType === "video") {
    return (
      <a
        href={topic.mediaUrl}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-32 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
      >
        <PlayCircle className="h-5 w-5 text-primary" />
        Abrir video
      </a>
    )
  }

  if (topic.contentType === "link" || topic.contentType === "pdf") {
    return (
      <a
        href={topic.mediaUrl}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-32 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
      >
        {topic.contentType === "pdf" ? (
          <FileText className="h-5 w-5 text-primary" />
        ) : (
          <LinkIcon className="h-5 w-5 text-primary" />
        )}
        Abrir recurso
      </a>
    )
  }

  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
      Contenido de texto
    </div>
  )
}

function TrainingDetail({
  topic,
  canEdit,
  canDelete,
  onBack,
  onEdit,
  onDelete,
  children,
}: {
  topic: TrainingTopic
  canEdit: boolean
  canDelete: boolean
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  children: ReactNode
}) {
  const TypeIcon = contentTypeIcons[topic.contentType]

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
                Informacion de la capacitacion
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
            <Badge variant="secondary">Rol</Badge>
            <Badge variant="outline">Orden {topic.order}</Badge>
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
        </section>

        <aside className="rounded-lg border border-border bg-card p-4">
          <TrainingMedia topic={topic} />
        </aside>
      </main>

      {children}
    </div>
  )
}

function TrainingTopicModal({
  isOpen,
  topic,
  onClose,
  onSave,
}: {
  isOpen: boolean
  topic: TrainingTopic | null
  onClose: () => void
  onSave: (topic: Omit<TrainingTopic, "id">) => void
}) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<UserRole | "general">("general")
  const [order, setOrder] = useState(1)
  const [summary, setSummary] = useState("")
  const [body, setBody] = useState("")
  const [contentType, setContentType] = useState<TrainingContentType>("text")
  const [mediaUrl, setMediaUrl] = useState("")
  const [visibleTo, setVisibleTo] = useState<UserRole[]>(["encuestador"])
  const [updatedAt, setUpdatedAt] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    if (!isOpen) return

    setTitle(topic?.title ?? "")
    setCategory(topic?.category ?? "general")
    setOrder(topic?.order ?? 1)
    setSummary(topic?.summary ?? "")
    setBody(topic?.body ?? "")
    setContentType(topic?.contentType ?? "text")
    setMediaUrl(topic?.mediaUrl ?? "")
    setVisibleTo(topic?.visibleTo ?? ["encuestador"])
    setUpdatedAt(topic?.updatedAt ?? new Date().toISOString().split("T")[0])
  }, [isOpen, topic])

  const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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
                !visibleTo.length
              }
            >
              Guardar tema
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
