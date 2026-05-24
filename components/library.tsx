"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Search,
  FileText,
  FileImage,
  Video,
  Download,
  Grid,
  List,
  FolderOpen,
  Clock,
  Star,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LibraryProps {
  onBack: () => void
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

type ResourceType = "document" | "image" | "video"
type ResourceCategory = "documents" | "images" | "videos" | "guides"

interface Resource {
  id: string
  title: string
  type: ResourceType
  category: ResourceCategory
  size: string
  date: string
  starred: boolean
}

const categoryLabels: Record<ResourceCategory | "all", string> = {
  all: "Todos",
  documents: "Documentos",
  images: "Imágenes",
  videos: "Videos",
  guides: "Guías",
}

const initialResources: Resource[] = [
  {
    id: "1",
    title: "Manual de Auditoría 2026",
    type: "document",
    category: "guides",
    size: "2.4 MB",
    date: "15 May 2026",
    starred: true,
  },
  {
    id: "2",
    title: "Fotos de Referencia - Góndolas",
    type: "image",
    category: "images",
    size: "45 archivos",
    date: "12 May 2026",
    starred: false,
  },
  {
    id: "3",
    title: "Video: Técnicas de Relevamiento",
    type: "video",
    category: "videos",
    size: "125 MB",
    date: "10 May 2026",
    starred: true,
  },
  {
    id: "4",
    title: "Plantilla de Reporte Semanal",
    type: "document",
    category: "documents",
    size: "450 KB",
    date: "8 May 2026",
    starred: false,
  },
  {
    id: "5",
    title: "Guía de Excepciones Permitidas",
    type: "document",
    category: "guides",
    size: "1.2 MB",
    date: "5 May 2026",
    starred: true,
  },
  {
    id: "6",
    title: "Video: Uso de la App Móvil",
    type: "video",
    category: "videos",
    size: "85 MB",
    date: "1 May 2026",
    starred: false,
  },
]

const typeIcons = {
  document: FileText,
  image: FileImage,
  video: Video,
}

const typeColors = {
  document: "text-primary bg-primary/20",
  image: "text-accent bg-accent/20",
  video: "text-warning bg-warning/20",
}

export function Library({ onBack, canAdd, canEdit, canDelete }: LibraryProps) {
  const [resources, setResources] = useState(initialResources)
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showModal, setShowModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

  const categories = useMemo(
    () =>
      (["all", "documents", "images", "videos", "guides"] as const).map((id) => ({
        id,
        label: categoryLabels[id],
        count:
          id === "all"
            ? resources.length
            : resources.filter((resource) => resource.category === id).length,
      })),
    [resources]
  )

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSaveResource = (resourceData: Omit<Resource, "id">) => {
    if (editingResource) {
      setResources((items) =>
        items.map((item) =>
          item.id === editingResource.id ? { ...item, ...resourceData } : item
        )
      )
    } else {
      setResources((items) => [
        ...items,
        { id: Date.now().toString(), ...resourceData },
      ])
    }
    setShowModal(false)
    setEditingResource(null)
  }

  const handleDeleteResource = (resource: Resource) => {
    if (!confirm("¿Está seguro de que desea eliminar este recurso?")) return
    setResources((items) => items.filter((item) => item.id !== resource.id))
  }

  const openNewResourceModal = () => {
    setEditingResource(null)
    setShowModal(true)
  }

  const openEditResourceModal = (resource: Resource) => {
    setEditingResource(resource)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                Biblioteca
              </h1>
              <p className="text-sm text-muted-foreground">
                Documentos y recursos
              </p>
            </div>

            {canAdd && (
              <button
                onClick={openNewResourceModal}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                title="Agregar"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border"
              />
            </div>
            <div className="flex items-center bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 pb-4 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {category.label}
                <span className="ml-2 opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={openEditResourceModal}
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResources.map((resource, index) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                index={index}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={openEditResourceModal}
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        )}

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {canAdd ? "No se encontraron recursos. Agrega uno nuevo." : "No se encontraron recursos"}
            </p>
          </div>
        )}
      </main>

      <ResourceEditModal
        isOpen={showModal}
        isNew={!editingResource}
        resource={editingResource}
        onSave={handleSaveResource}
        onClose={() => {
          setShowModal(false)
          setEditingResource(null)
        }}
      />
    </div>
  )
}

function ResourceCard({
  resource,
  index,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  resource: Resource
  index: number
  canEdit?: boolean
  canDelete?: boolean
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
}) {
  const Icon = typeIcons[resource.type]
  const colorClass = typeColors[resource.type]

  return (
    <motion.div
      className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <ResourceActions
          resource={resource}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
        {resource.title}
      </h3>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{resource.size}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{resource.date}</span>
        </div>
      </div>
    </motion.div>
  )
}

function ResourceRow({
  resource,
  index,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  resource: Resource
  index: number
  canEdit?: boolean
  canDelete?: boolean
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
}) {
  const Icon = typeIcons[resource.type]
  const colorClass = typeColors[resource.type]

  return (
    <motion.div
      className="glass-card rounded-xl p-4 hover:shadow-lg transition-all group flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">
          {resource.size} · {resource.date}
        </p>
      </div>

      <ResourceActions
        resource={resource}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </motion.div>
  )
}

function ResourceActions({
  resource,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  resource: Resource
  canEdit?: boolean
  canDelete?: boolean
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {resource.starred && <Star className="w-4 h-4 text-warning fill-warning" />}
      <button className="p-2 rounded-lg bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
        <Download className="w-4 h-4 text-muted-foreground" />
      </button>
      {canEdit && (
        <button
          onClick={() => onEdit(resource)}
          className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 hover:bg-primary/20 transition-all"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {canDelete && (
        <button
          onClick={() => onDelete(resource)}
          className="p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function ResourceEditModal({
  isOpen,
  isNew,
  resource,
  onSave,
  onClose,
}: {
  isOpen: boolean
  isNew: boolean
  resource: Resource | null
  onSave: (resource: Omit<Resource, "id">) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(resource?.title || "")
  const [type, setType] = useState<ResourceType>(resource?.type || "document")
  const [category, setCategory] = useState<ResourceCategory>(resource?.category || "documents")
  const [size, setSize] = useState(resource?.size || "")
  const [date, setDate] = useState(resource?.date || "")
  const [starred, setStarred] = useState(resource?.starred || false)

  useEffect(() => {
    if (!isOpen) return

    setTitle(resource?.title || "")
    setType(resource?.type || "document")
    setCategory(resource?.category || "documents")
    setSize(resource?.size || "")
    setDate(resource?.date || "")
    setStarred(resource?.starred || false)
  }, [isOpen, resource])

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      type,
      category,
      size: size.trim() || "Sin tamaño",
      date: date.trim() || new Date().toLocaleDateString("es-PY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      starred,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            {isNew ? "Nuevo recurso" : "Editar recurso"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título
            </label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo
              </label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as ResourceType)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="document">Documento</option>
                <option value="image">Imagen</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoría
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as ResourceCategory)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="documents">Documentos</option>
                <option value="images">Imágenes</option>
                <option value="videos">Videos</option>
                <option value="guides">Guías</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tamaño
              </label>
              <Input
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder="Ej: 2.4 MB, 45 archivos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha
              </label>
              <Input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                placeholder="Ej: 24 May 2026"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={starred}
              onChange={(event) => setStarred(event.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Marcar como destacado
          </label>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={!title.trim()}>
            {isNew ? "Crear" : "Guardar"} recurso
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
