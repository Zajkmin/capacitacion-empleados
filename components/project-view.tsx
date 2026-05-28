"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Camera,
  RefreshCw,
  ChevronRight,
  XCircle,
  Lightbulb,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react"
import { VisualLearning } from "@/components/visual-learning"
import { Library } from "@/components/library"
import { useConfirmAction } from "@/components/confirm-action-dialog"
import { SectionEditModal } from "@/components/section-edit-modal"
import { ItemEditModal } from "@/components/item-edit-modal"
import type { ViewType } from "@/components/dashboard-layout"
import {
  userHasPermission,
  type Permission,
  type SectionType,
  type UserRole,
} from "@/lib/roles-permissions"
import {
  deleteProjectSection,
  deleteSectionItem,
  listSectionItems,
  listProjectSections,
  saveSectionItem,
  saveProjectSection,
  type SectionItemRecord,
  type SectionItemType,
} from "@/lib/supabase/projects"

interface ProjectViewProps {
  projectId: string
  projectName?: string
  projectColor?: string
  onBack: () => void
  onNavigate: (view: ViewType) => void
  user?: {
    id?: string
    name: string
    email: string
    role: UserRole
    permissions?: Permission[]
  }
}

const projectData = {
  id: "1",
  name: "Arcor PY",
  client: "Arcor Paraguay",
  description: "Documentación operativa y guías de campo para la correcta ejecución de auditorías y merchandising en puntos de venta.",
  color: "#3B82F6",
  logo: "A",
}

const mainSections = [
  {
    id: "rules",
    type: "rules" as SectionType,
    icon: BookOpen,
    title: "Reglas del Proyecto",
    description: "Normativas y procedimientos a seguir",
    color: "bg-primary",
  },
  {
    id: "exceptions",
    type: "exceptions" as SectionType,
    icon: AlertTriangle,
    title: "Excepciones",
    description: "Casos especiales y permisos",
    color: "bg-amber-500",
  },
  {
    id: "visual-learning",
    type: "visual-learning" as SectionType,
    icon: Lightbulb,
    title: "Aprendizaje Visual",
    description: "Comparativas y ejemplos ilustrados",
    color: "bg-violet-500",
  },
  {
    id: "library",
    type: "library" as SectionType,
    icon: FolderOpen,
    title: "Biblioteca",
    description: "Recursos y documentos del proyecto",
    color: "bg-slate-500",
  },
  {
    id: "photos",
    type: "photos" as SectionType,
    icon: Camera,
    title: "Fotos Guia",
    description: "Referencias visuales de ejecucion",
    color: "bg-emerald-500",
  },
  {
    id: "errors",
    type: "errors" as SectionType,
    icon: XCircle,
    title: "Errores Frecuentes",
    description: "Que evitar en campo",
    color: "bg-rose-500",
  },
  {
    id: "updates",
    type: "updates" as SectionType,
    icon: RefreshCw,
    title: "Actualizaciones",
    description: "Cambios y novedades recientes",
    color: "bg-cyan-500",
  },
]

const sectionIcons = Object.fromEntries(
  mainSections.map((section) => [section.type, section.icon]),
) as Record<SectionType, typeof BookOpen>

type ProjectSectionView = {
  id: string
  type: SectionType
  icon: typeof BookOpen
  title: string
  description: string
  color: string
  content?: string
}

function withSectionIcon(
  section: Omit<ProjectSectionView, "icon">,
): ProjectSectionView {
  return {
    ...section,
    icon: sectionIcons[section.type] ?? BookOpen,
  }
}

export function ProjectView({ projectId, projectName, projectColor, onBack, onNavigate, user }: ProjectViewProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [sections, setSections] = useState<ProjectSectionView[]>(
    mainSections.map(withSectionIcon),
  )
  const [isLoadingSections, setIsLoadingSections] = useState(true)
  const [sectionError, setSectionError] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSection, setEditingSection] = useState<ProjectSectionView | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const displayName = projectName || projectData.name
  const displayColor = projectColor || projectData.color
  const userRole = (user?.role || "encuestador") as UserRole
  const canEdit = user
    ? userHasPermission(user, "edit_section")
    : false
  const canAdd = user
    ? userHasPermission(user, "add_section")
    : false
  const canDelete = user
    ? userHasPermission(user, "delete_section")
    : false

  useEffect(() => {
    let isMounted = true

    listProjectSections(projectId)
      .then((storedSections) => {
        if (isMounted) setSections(storedSections.map(withSectionIcon))
      })
      .catch((error) => {
        if (!isMounted) return
        setSectionError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las secciones.",
        )
      })
      .finally(() => {
        if (isMounted) setIsLoadingSections(false)
      })

    return () => {
      isMounted = false
    }
  }, [projectId])

  if (activeSection) {
    const currentSection = sections.find((section) => section.id === activeSection)
    if (!currentSection) return null

    if (currentSection.type === "visual-learning") {
      return (
        <>
          <VisualLearning
            onBack={() => setActiveSection(null)}
            canAdd={canAdd}
            canEdit={canEdit}
            canDelete={canDelete}
          />
          {confirmDialog}
        </>
      )
    }
    if (currentSection.type === "library") {
      return (
        <>
          <Library
            onBack={() => setActiveSection(null)}
            sectionId={currentSection.id}
            canAdd={canAdd}
            canEdit={canEdit}
            canDelete={canDelete}
          />
          {confirmDialog}
        </>
      )
    }

    return (
      <>
        <SectionDetail
          sectionId={activeSection}
          section={currentSection}
          onBack={() => setActiveSection(null)}
          projectName={displayName}
          onEdit={async () => {
          const section = sections.find((s) => s.id === activeSection)
          if (!section) return
          const confirmed = await confirmAction({
            title: "Editar seccion",
            description: `Vas a modificar "${section.title}".`,
            confirmLabel: "Editar",
          })
          if (!confirmed) return
          setEditingSection(section)
          setShowEditModal(true)
        }}
          onDelete={async () => {
          const confirmed = await confirmAction({
            title: "Eliminar seccion",
            description: `Esta accion eliminara "${currentSection.title}" y todo su contenido.`,
            confirmLabel: "Eliminar seccion",
          })
          if (confirmed) {
            deleteProjectSection(activeSection)
              .then(() => {
                setSections(sections.filter((s) => s.id !== activeSection))
                setActiveSection(null)
                setSectionError("")
              })
              .catch((error) => {
                setSectionError(
                  error instanceof Error
                    ? error.message
                    : "No se pudo eliminar la seccion.",
                )
              })
          }
        }}
          canEdit={canEdit}
          canDelete={canDelete}
          canAdd={canAdd}
          userRole={userRole}
        />
        {confirmDialog}
      </>
    )
  }

  const handleSaveSection = async (sectionData: {
    title: string
    description: string
    type: SectionType
    content?: string
  }) => {
    try {
      const savedSection = await saveProjectSection({
        id: editingSection?.id,
        projectId,
        title: sectionData.title,
        description: sectionData.description,
        type: sectionData.type,
        content: sectionData.content,
        sortOrder: editingSection
          ? sections.findIndex((section) => section.id === editingSection.id)
          : sections.length,
        userId: user && "id" in user ? String(user.id) : undefined,
      })
      const viewSection = withSectionIcon(savedSection)

      if (editingSection) {
        setSections(
          sections.map((section) =>
            section.id === editingSection.id ? viewSection : section,
          ),
        )
      } else {
        setSections([...sections, viewSection])
      }

      setShowEditModal(false)
      setEditingSection(null)
      setSectionError("")
    } catch (error) {
      setSectionError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la seccion.",
      )
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: displayColor }}
              >
                {displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {projectData.client}
                </p>
              </div>
            </div>

            {canAdd && (
              <button
                onClick={() => {
                  setEditingSection(null)
                  setShowEditModal(true)
                }}
                className="ml-auto p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nueva</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        {sectionError ? (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {sectionError}
          </div>
        ) : null}

        {isLoadingSections ? (
          <div className="mb-4 rounded-lg border border-border bg-card/50 p-4 text-sm text-muted-foreground">
            Cargando secciones...
          </div>
        ) : null}

        {/* Project Description */}
        <div className="mb-8">
          <p className="text-muted-foreground leading-relaxed">
            {projectData.description}
          </p>
        </div>

        {/* Section Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className="glass-card rounded-2xl p-5 text-left hover:border-primary/50 transition-all group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setActiveSection(section.id)}
                className="absolute inset-0 rounded-2xl z-20"
                aria-label={`Ver ${section.title}`}
              />

              <div
                className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4 relative z-10`}
              >
                <section.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors relative z-10">
                {section.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 relative z-10">
                {section.description}
              </p>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver mas</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {(canEdit || canDelete) && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30 relative">
                    {canEdit && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          const confirmed = await confirmAction({
                            title: "Editar seccion",
                            description: `Vas a modificar "${section.title}".`,
                            confirmLabel: "Editar",
                          })
                          if (!confirmed) return
                          setEditingSection(section)
                          setShowEditModal(true)
                        }}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          const confirmed = await confirmAction({
                            title: "Eliminar seccion",
                            description: `Esta accion eliminara "${section.title}" y todo su contenido.`,
                            confirmLabel: "Eliminar seccion",
                          })
                          if (confirmed) {
                            deleteProjectSection(section.id)
                              .then(() => {
                                setSections(
                                  sections.filter((s) => s.id !== section.id),
                                )
                                setSectionError("")
                              })
                              .catch((error) => {
                                setSectionError(
                                  error instanceof Error
                                    ? error.message
                                    : "No se pudo eliminar la seccion.",
                                )
                              })
                          }
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <SectionEditModal
        isOpen={showEditModal}
        isNew={!editingSection}
        section={editingSection}
        onSave={handleSaveSection}
        onClose={() => {
          setShowEditModal(false)
          setEditingSection(null)
        }}
      />
    </div>
  )
}

function SectionDetail({
  sectionId,
  section,
  onBack,
  projectName,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  canAdd,
  userRole,
}: {
  sectionId: string
  section: ProjectSectionView
  onBack: () => void
  projectName: string
  onEdit?: () => void
  onDelete?: () => void
  canEdit?: boolean
  canDelete?: boolean
  canAdd?: boolean
  userRole?: UserRole
}) {
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {section.title}
                </h1>
                <p className="text-sm text-muted-foreground">{projectName}</p>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex gap-2">
                {canEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <SectionContent 
          sectionId={section.type} 
          sectionRecordId={section.id}
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
          userRole={userRole}
        />
      </main>
    </div>
  )
}

function SectionContent({ 
  sectionId,
  sectionRecordId,
  canAdd,
  canEdit,
  canDelete,
  userRole,
}: { 
  sectionId: string
  sectionRecordId: string
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
  userRole?: UserRole
}) {
  switch (sectionId) {
    case "rules":
      return (
        <SectionItemsContent
          sectionId={sectionRecordId}
          itemType="rule"
          icon={BookOpen}
          accentClass="bg-primary/20"
          iconClass="text-primary"
          addButtonClass="bg-primary/10 text-primary hover:bg-primary/20 border-primary/30"
          addLabel="Agregar Nueva Regla"
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )
    case "exceptions":
      return (
        <SectionItemsContent
          sectionId={sectionRecordId}
          itemType="exception"
          icon={AlertTriangle}
          accentClass="bg-amber-500/20"
          iconClass="text-amber-500"
          cardClass="border-l-4 border-amber-500"
          addButtonClass="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/30"
          addLabel="Agregar Nueva Excepcion"
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )
    case "photos":
      return (
        <PhotoItemsContent
          sectionId={sectionRecordId}
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )
    case "errors":
      return (
        <SectionItemsContent
          sectionId={sectionRecordId}
          itemType="error"
          icon={XCircle}
          accentClass="bg-rose-500/20"
          iconClass="text-rose-500"
          cardClass="border-l-4 border-rose-500"
          addButtonClass="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/30"
          addLabel="Agregar Nuevo Error Frecuente"
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )
    case "updates":
      return (
        <SectionItemsContent
          sectionId={sectionRecordId}
          itemType="update"
          icon={RefreshCw}
          accentClass="bg-cyan-500/20"
          iconClass="text-cyan-500"
          addButtonClass="bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 border-cyan-500/30"
          addLabel="Agregar Nueva Actualizacion"
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )
    default:
      return null
  }
}

function useSectionItems(sectionId: string) {
  const [items, setItems] = useState<SectionItemRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let isMounted = true

    listSectionItems(sectionId)
      .then((storedItems) => {
        if (isMounted) setItems(storedItems)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el contenido.",
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [sectionId])

  const saveItem = async (
    itemType: SectionItemType,
    itemData: Record<string, any>,
    editingItem?: SectionItemRecord | null,
  ) => {
    const metadata: Record<string, string> = {}
    if (typeof itemData.validUntil === "string") {
      metadata.validUntil = itemData.validUntil
    }
    if (typeof itemData.date === "string") {
      metadata.date = itemData.date
    }

    const savedItem = await saveSectionItem({
      id: editingItem?.id,
      sectionId,
      type: itemType,
      title: itemData.title,
      description: itemData.description,
      imageUrl: itemData.imageUrl,
      metadata,
      sortOrder: editingItem
        ? items.findIndex((item) => item.id === editingItem.id)
        : items.length,
    })

    setItems((currentItems) =>
      editingItem
        ? currentItems.map((item) =>
            item.id === savedItem.id ? savedItem : item,
          )
        : [...currentItems, savedItem],
    )
    setErrorMessage("")
  }

  const deleteItem = async (itemId: string) => {
    await deleteSectionItem(itemId)
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
    setErrorMessage("")
  }

  return {
    items,
    isLoading,
    errorMessage,
    setErrorMessage,
    saveItem,
    deleteItem,
  }
}

function itemToModalItem(item: SectionItemRecord) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    validUntil:
      typeof item.metadata.validUntil === "string"
        ? item.metadata.validUntil
        : undefined,
    date:
      typeof item.metadata.date === "string"
        ? item.metadata.date
        : undefined,
  }
}

function SectionItemMeta({ item }: { item: SectionItemRecord }) {
  const validUntil =
    typeof item.metadata.validUntil === "string"
      ? item.metadata.validUntil
      : undefined
  const date =
    typeof item.metadata.date === "string" ? item.metadata.date : undefined

  if (validUntil) {
    return (
      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700">
        {validUntil}
      </span>
    )
  }

  if (date) {
    return <span className="text-xs text-muted-foreground">{date}</span>
  }

  return null
}

function SectionItemsContent({
  sectionId,
  itemType,
  icon: Icon,
  accentClass,
  iconClass,
  addButtonClass,
  addLabel,
  cardClass = "",
  canAdd,
  canEdit,
  canDelete,
}: {
  sectionId: string
  itemType: SectionItemType
  icon: typeof BookOpen
  accentClass: string
  iconClass: string
  addButtonClass: string
  addLabel: string
  cardClass?: string
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
}) {
  const { items, isLoading, errorMessage, setErrorMessage, saveItem, deleteItem } =
    useSectionItems(sectionId)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SectionItemRecord | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSave = async (itemData: Record<string, any>) => {
    try {
      await saveItem(itemType, itemData, editingItem)
      setShowModal(false)
      setEditingItem(null)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el contenido.",
      )
    }
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {canAdd && (
        <button
          onClick={() => {
            setEditingItem(null)
            setShowModal(true)
          }}
          className={`w-full py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border mb-4 ${addButtonClass}`}
        >
          <Plus className="w-5 h-5" />
          {addLabel}
        </button>
      )}

      {isLoading ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">
          Cargando contenido...
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
          No hay contenido cargado.
        </div>
      ) : null}

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={`glass-card rounded-2xl p-5 group ${cardClass}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${accentClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 gap-3">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <SectionItemMeta item={item} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="mt-4 aspect-video w-full max-w-md rounded-xl object-cover"
                />
              ) : null}
            </div>
            {(canEdit || canDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar contenido",
                        description: `Vas a modificar "${item.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingItem(item)
                      setShowModal(true)
                    }}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Eliminar contenido",
                        description: `Esta accion eliminara "${item.title}".`,
                        confirmLabel: "Eliminar",
                      })
                      if (!confirmed) return
                      deleteItem(item.id).catch((error) => {
                        setErrorMessage(
                          error instanceof Error
                            ? error.message
                            : "No se pudo eliminar el contenido.",
                        )
                      })
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      <ItemEditModal
        isOpen={showModal}
        isNew={!editingItem}
        itemType={itemType}
        item={editingItem ? itemToModalItem(editingItem) : undefined}
        onSave={handleSave}
        onClose={() => {
          setShowModal(false)
          setEditingItem(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function PhotoItemsContent({
  sectionId,
  canAdd,
  canEdit,
  canDelete,
}: {
  sectionId: string
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
}) {
  const { items, isLoading, errorMessage, setErrorMessage, saveItem, deleteItem } =
    useSectionItems(sectionId)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SectionItemRecord | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSave = async (itemData: Record<string, any>) => {
    try {
      await saveItem("photo", itemData, editingItem)
      setShowModal(false)
      setEditingItem(null)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la foto.",
      )
    }
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {canAdd && (
        <button
          onClick={() => {
            setEditingItem(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 border border-emerald-500/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Foto Guia
        </button>
      )}

      {isLoading ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">
          Cargando fotos...
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Camera className="w-16 h-16 mx-auto text-primary/30 mb-4" />
          <p className="text-muted-foreground">
            {canAdd ? "No hay fotos guia. Agrega una nueva." : "No hay fotos guia disponibles"}
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-12 h-12 text-emerald-500/40" />
                )}
                {(canEdit || canDelete) && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {canEdit && (
                      <button
                        onClick={async () => {
                          const confirmed = await confirmAction({
                            title: "Editar foto",
                            description: `Vas a modificar "${item.title}".`,
                            confirmLabel: "Editar",
                          })
                          if (!confirmed) return
                          setEditingItem(item)
                          setShowModal(true)
                        }}
                        className="p-2 rounded-lg bg-primary/80 text-primary-foreground hover:bg-primary transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={async () => {
                          const confirmed = await confirmAction({
                            title: "Eliminar foto",
                            description: `Esta accion eliminara "${item.title}".`,
                            confirmLabel: "Eliminar",
                          })
                          if (!confirmed) return
                          deleteItem(item.id).catch((error) => {
                            setErrorMessage(
                              error instanceof Error
                                ? error.message
                                : "No se pudo eliminar la foto.",
                            )
                          })
                        }}
                        className="p-2 rounded-lg bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      <ItemEditModal
        isOpen={showModal}
        isNew={!editingItem}
        itemType="photo"
        item={editingItem ? itemToModalItem(editingItem) : undefined}
        onSave={handleSave}
        onClose={() => {
          setShowModal(false)
          setEditingItem(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function RulesContent({ canAdd, canEdit, canDelete }: { canAdd?: boolean; canEdit?: boolean; canDelete?: boolean }) {
  const [rules, setRules] = useState([
    {
      id: "1",
      title: "Exhibicion de Productos",
      description:
        "Los productos deben estar alineados al frente del estante con etiquetas visibles hacia el cliente.",
    },
    {
      id: "2",
      title: "Verificacion de Precios",
      description:
        "Todo producto exhibido debe tener su precio visible y actualizado segun sistema.",
    },
    {
      id: "3",
      title: "Control de Vencimientos",
      description:
        "Productos con menos de 30 dias de vencimiento deben ser reportados inmediatamente.",
    },
    {
      id: "4",
      title: "Orden de Gondola",
      description:
        "Mantener el planograma establecido. No mover productos entre categorias.",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSaveRule = (ruleData: any) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === editingRule.id ? { ...r, ...ruleData } : r)))
    } else {
      setRules([...rules, { id: Date.now().toString(), ...ruleData }])
    }
    setShowModal(false)
    setEditingRule(null)
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <button
          onClick={() => {
            setEditingRule(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 border border-primary/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Regla
        </button>
      )}
      {rules.map((rule, index) => (
        <motion.div
          key={rule.id}
          className="glass-card rounded-2xl p-5 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {rule.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule.description}
              </p>
              {rule.imageUrl && (
                <img
                  src={rule.imageUrl}
                  alt=""
                  className="mt-4 aspect-video w-full max-w-md rounded-xl object-cover"
                />
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar regla",
                        description: `Vas a modificar "${rule.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingRule(rule)
                      setShowModal(true)
                    }}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Eliminar regla",
                        description: `Esta accion eliminara "${rule.title}".`,
                        confirmLabel: "Eliminar",
                      })
                      if (confirmed) {
                        setRules(rules.filter((r) => r.id !== rule.id))
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <ItemEditModal
        isOpen={showModal}
        isNew={!editingRule}
        itemType="rule"
        item={editingRule}
        onSave={handleSaveRule}
        onClose={() => {
          setShowModal(false)
          setEditingRule(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function ExceptionsContent({ canAdd, canEdit, canDelete }: { canAdd?: boolean; canEdit?: boolean; canDelete?: boolean }) {
  const [exceptions, setExceptions] = useState([
    {
      id: "1",
      title: "Productos en Promocion",
      description:
        "Pueden ubicarse fuera del planograma en islas promocionales autorizadas.",
      validUntil: "Permanente",
    },
    {
      id: "2",
      title: "Tiendas Formato Reducido",
      description: "Locales de menos de 200m2 pueden omitir secciones secundarias.",
      validUntil: "Permanente",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingException, setEditingException] = useState<any>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSaveException = (exceptionData: any) => {
    if (editingException) {
      setExceptions(exceptions.map((e) => (e.id === editingException.id ? { ...e, ...exceptionData } : e)))
    } else {
      setExceptions([...exceptions, { id: Date.now().toString(), ...exceptionData }])
    }
    setShowModal(false)
    setEditingException(null)
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <button
          onClick={() => {
            setEditingException(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2 border border-amber-500/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Excepción
        </button>
      )}
      {exceptions.map((exception, index) => (
        <motion.div
          key={exception.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-amber-500 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">
                  {exception.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700">
                  {exception.validUntil}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exception.description}
              </p>
              {exception.imageUrl && (
                <img
                  src={exception.imageUrl}
                  alt=""
                  className="mt-4 aspect-video w-full max-w-md rounded-xl object-cover"
                />
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar excepcion",
                        description: `Vas a modificar "${exception.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingException(exception)
                      setShowModal(true)
                    }}
                    className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Eliminar excepcion",
                        description: `Esta accion eliminara "${exception.title}".`,
                        confirmLabel: "Eliminar",
                      })
                      if (confirmed) {
                        setExceptions(exceptions.filter((e) => e.id !== exception.id))
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <ItemEditModal
        isOpen={showModal}
        isNew={!editingException}
        itemType="exception"
        item={editingException}
        onSave={handleSaveException}
        onClose={() => {
          setShowModal(false)
          setEditingException(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function PhotosContent({ canAdd, canEdit, canDelete }: { canAdd?: boolean; canEdit?: boolean; canDelete?: boolean }) {
  const [photos, setPhotos] = useState([
    {
      id: "1",
      title: "Ejemplo de Exhibición Correcta",
      description: "Productos alineados al frente con etiquetas visibles",
      imageUrl: "https://via.placeholder.com/400x300?text=Exhibicion+Correcta",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<any>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSavePhoto = (photoData: any) => {
    if (editingPhoto) {
      setPhotos(photos.map((p) => (p.id === editingPhoto.id ? { ...p, ...photoData } : p)))
    } else {
      setPhotos([...photos, { 
        id: Date.now().toString(), 
        ...photoData,
        imageUrl:
          photoData.imageUrl ||
          "https://placehold.co/800x450?text=" + encodeURIComponent(photoData.title),
      }])
    }
    setShowModal(false)
    setEditingPhoto(null)
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <button
          onClick={() => {
            setEditingPhoto(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 border border-emerald-500/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Foto Guía
        </button>
      )}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="glass-card rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center overflow-hidden">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {(canEdit || canDelete) && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {canEdit && (
                      <button
                        onClick={async () => {
                          const confirmed = await confirmAction({
                            title: "Editar foto",
                            description: `Vas a modificar "${photo.title}".`,
                            confirmLabel: "Editar",
                          })
                          if (!confirmed) return
                          setEditingPhoto(photo)
                          setShowModal(true)
                        }}
                        className="p-2 rounded-lg bg-primary/80 text-primary-foreground hover:bg-primary transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={async () => {
                          const confirmed = await confirmAction({
                            title: "Eliminar foto",
                            description: `Esta accion eliminara "${photo.title}".`,
                            confirmLabel: "Eliminar",
                          })
                          if (confirmed) {
                            setPhotos(photos.filter((p) => p.id !== photo.id))
                          }
                        }}
                        className="p-2 rounded-lg bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{photo.title}</h3>
                <p className="text-sm text-muted-foreground">{photo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Camera className="w-16 h-16 mx-auto text-primary/30 mb-4" />
          <p className="text-muted-foreground">
            {canAdd ? "No hay fotos guía. ¡Agrega una nueva!" : "No hay fotos guía disponibles"}
          </p>
        </div>
      )}
      <ItemEditModal
        isOpen={showModal}
        isNew={!editingPhoto}
        itemType="photo"
        item={editingPhoto}
        onSave={handleSavePhoto}
        onClose={() => {
          setShowModal(false)
          setEditingPhoto(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function ErrorsContent({ canAdd, canEdit, canDelete }: { canAdd?: boolean; canEdit?: boolean; canDelete?: boolean }) {
  const [errors, setErrors] = useState([
    {
      id: "1",
      title: "Etiquetas Invertidas",
      description: "Evitar colocar etiquetas al revés o con información errada",
    },
    {
      id: "2",
      title: "Productos Caidos",
      description: "No permitir productos caídos o en posición horizontal",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingError, setEditingError] = useState<any>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSaveError = (errorData: any) => {
    if (editingError) {
      setErrors(errors.map((e) => (e.id === editingError.id ? { ...e, ...errorData } : e)))
    } else {
      setErrors([...errors, { id: Date.now().toString(), ...errorData }])
    }
    setShowModal(false)
    setEditingError(null)
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <button
          onClick={() => {
            setEditingError(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2 border border-rose-500/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nuevo Error Frecuente
        </button>
      )}
      {errors.map((error, index) => (
        <motion.div
          key={error.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-rose-500 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {error.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error.description}
              </p>
              {error.imageUrl && (
                <img
                  src={error.imageUrl}
                  alt=""
                  className="mt-4 aspect-video w-full max-w-md rounded-xl object-cover"
                />
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar error",
                        description: `Vas a modificar "${error.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingError(error)
                      setShowModal(true)
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Eliminar error",
                        description: `Esta accion eliminara "${error.title}".`,
                        confirmLabel: "Eliminar",
                      })
                      if (confirmed) {
                        setErrors(errors.filter((e) => e.id !== error.id))
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <ItemEditModal
        isOpen={showModal}
        isNew={!editingError}
        itemType="error"
        item={editingError}
        onSave={handleSaveError}
        onClose={() => {
          setShowModal(false)
          setEditingError(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function UpdatesContent({ canAdd, canEdit, canDelete }: { canAdd?: boolean; canEdit?: boolean; canDelete?: boolean }) {
  const [updates, setUpdates] = useState([
    {
      id: "1",
      date: "2025-03-15",
      title: "Nueva Política de Exhibición",
      description: "Se actualizó el planograma de acuerdo a nuevos estándares.",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<any>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const handleSaveUpdate = (updateData: any) => {
    if (editingUpdate) {
      setUpdates(updates.map((u) => (u.id === editingUpdate.id ? { ...u, ...updateData } : u)))
    } else {
      setUpdates([...updates, { id: Date.now().toString(), ...updateData }])
    }
    setShowModal(false)
    setEditingUpdate(null)
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <button
          onClick={() => {
            setEditingUpdate(null)
            setShowModal(true)
          }}
          className="w-full py-3 px-4 rounded-xl bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 border border-cyan-500/30 mb-4"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Actualización
        </button>
      )}
      {updates.map((update, index) => (
        <motion.div
          key={update.id}
          className="glass-card rounded-2xl p-5 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">
                  {update.title}
                </h3>
                <span className="text-xs text-muted-foreground">{update.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {update.description}
              </p>
              {update.imageUrl && (
                <img
                  src={update.imageUrl}
                  alt=""
                  className="mt-4 aspect-video w-full max-w-md rounded-xl object-cover"
                />
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar actualizacion",
                        description: `Vas a modificar "${update.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingUpdate(update)
                      setShowModal(true)
                    }}
                    className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Eliminar actualizacion",
                        description: `Esta accion eliminara "${update.title}".`,
                        confirmLabel: "Eliminar",
                      })
                      if (confirmed) {
                        setUpdates(updates.filter((u) => u.id !== update.id))
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <ItemEditModal
        isOpen={showModal}
        isNew={!editingUpdate}
        itemType="update"
        item={editingUpdate}
        onSave={handleSaveUpdate}
        onClose={() => {
          setShowModal(false)
          setEditingUpdate(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}
