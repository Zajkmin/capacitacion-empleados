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
  ZoomIn,
  X,
} from "lucide-react"
import { VisualLearning } from "@/components/visual-learning"
import { Library } from "@/components/library"
import { ActivityFeed } from "@/components/activity-feed"
import { useConfirmAction } from "@/components/confirm-action-dialog"
import { SectionEditModal } from "@/components/section-edit-modal"
import { ItemEditModal } from "@/components/item-edit-modal"
import {
  userHasPermission,
  type Permission,
  type SectionType,
  type UserRole,
} from "@/lib/roles-permissions"
import {
  deleteProjectSection,
  deleteSectionItem,
  getProject,
  listSectionItems,
  listProjectSections,
  saveSectionItem,
  saveProjectSection,
  type ProjectDetailRecord,
  type SectionItemRecord,
  type SectionItemType,
} from "@/lib/supabase/projects"

interface ProjectViewProps {
  projectId: string
  projectName?: string
  projectColor?: string
  onBack: () => void
  activeSection: string | null
  onSectionSelect: (sectionId: string) => void
  onSectionBack: () => void
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
    description: "Cambios recientes en otras secciones",
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

function getProjectBadgeStyle(bgClass: string) {
  if (bgClass.startsWith("#") || bgClass.startsWith("rgb")) {
    return { className: "", style: { backgroundColor: bgClass } }
  }

  return { className: bgClass, style: undefined }
}

export function ProjectView({
  projectId,
  projectName,
  projectColor,
  onBack,
  activeSection,
  onSectionSelect,
  onSectionBack,
  user,
}: ProjectViewProps) {
  const [project, setProject] = useState<ProjectDetailRecord | null>(null)
  const [sections, setSections] = useState<ProjectSectionView[]>(
    mainSections.map(withSectionIcon),
  )
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isLoadingSections, setIsLoadingSections] = useState(true)
  const [sectionError, setSectionError] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSection, setEditingSection] = useState<ProjectSectionView | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const displayName = project?.name || projectName || "Proyecto"
  const displayBgClass = project?.bgColor || projectColor || "bg-primary"
  const displayGroupName = project?.groupName || "Proyecto"
  const displayCoverImage = project?.coverImage
  const projectBadge = getProjectBadgeStyle(displayBgClass)
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

    Promise.all([getProject(projectId), listProjectSections(projectId)])
      .then(([storedProject, storedSections]) => {
        if (!isMounted) return
        setProject(storedProject)
        setSections(storedSections.map(withSectionIcon))
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
        if (!isMounted) return
        setIsLoadingProject(false)
        setIsLoadingSections(false)
      })

    return () => {
      isMounted = false
    }
  }, [projectId])

  if (activeSection) {
    const currentSection = sections.find((section) => section.id === activeSection)
    if (!currentSection) {
      return (
        <div className="min-h-screen p-4 lg:p-8">
          <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card/50 p-4 text-sm text-muted-foreground">
            Cargando seccion...
          </div>
        </div>
      )
    }

    if (currentSection.type === "visual-learning") {
      return (
        <>
          <VisualLearning
            onBack={onSectionBack}
            sectionId={currentSection.id}
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
            onBack={onSectionBack}
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
          projectId={projectId}
          sectionId={activeSection}
          section={currentSection}
          onBack={onSectionBack}
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
                onSectionBack()
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
          userId={user?.id}
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
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden ${projectBadge.className}`}
                style={projectBadge.style}
              >
                {displayCoverImage ? (
                  <img
                    src={displayCoverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {displayGroupName}
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

        {isLoadingProject || isLoadingSections ? (
          <div className="mb-4 rounded-lg border border-border bg-card/50 p-4 text-sm text-muted-foreground">
            Cargando proyecto...
          </div>
        ) : null}

        {/* Project Description */}
        <div className="mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Consulta y administra el contenido operativo de {displayName}.
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
                onClick={() => onSectionSelect(section.id)}
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
        section={editingSection ?? undefined}
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
  projectId,
  sectionId,
  section,
  onBack,
  projectName,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  canAdd,
  userId,
  userRole,
}: {
  projectId: string
  sectionId: string
  section: ProjectSectionView
  onBack: () => void
  projectName: string
  onEdit?: () => void
  onDelete?: () => void
  canEdit?: boolean
  canDelete?: boolean
  canAdd?: boolean
  userId?: string
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
          projectId={projectId}
          sectionId={section.type} 
          sectionRecordId={section.id}
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
          userId={userId}
          userRole={userRole}
        />
      </main>
    </div>
  )
}

function SectionContent({ 
  projectId,
  sectionId,
  sectionRecordId,
  canAdd,
  canEdit,
  canDelete,
  userId,
  userRole,
}: { 
  projectId: string
  sectionId: string
  sectionRecordId: string
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
  userId?: string
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
          userId={userId}
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
          userId={userId}
        />
      )
    case "photos":
      return (
        <PhotoItemsContent
          sectionId={sectionRecordId}
          canAdd={canAdd}
          canEdit={canEdit}
          canDelete={canDelete}
          userId={userId}
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
          userId={userId}
        />
      )
    case "updates":
      return <ProjectUpdatesContent projectId={projectId} />
    default:
      return null
  }
}

function ProjectUpdatesContent({ projectId }: { projectId: string }) {
  return (
    <ActivityFeed
      projectId={projectId}
      daysLimit={7}
      emptyLabel="Todavia no hay cambios registrados en las otras secciones de este proyecto."
    />
  )
}

function useSectionItems(sectionId: string, userId?: string) {
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
      content: itemData.content,
      imageUrl: itemData.imageUrl,
      metadata,
      userId,
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
    await deleteSectionItem(itemId, userId)
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
    content: item.content,
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
  userId,
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
  userId?: string
}) {
  const { items, isLoading, errorMessage, setErrorMessage, saveItem, deleteItem } =
    useSectionItems(sectionId, userId)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SectionItemRecord | null>(null)
  const [selectedItem, setSelectedItem] = useState<SectionItemRecord | null>(null)
  const [previewImage, setPreviewImage] = useState<{
    url: string
    title: string
  } | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const selectedItemIndex = selectedItem
    ? items.findIndex((item) => item.id === selectedItem.id)
    : -1
  const currentSelectedItem =
    selectedItemIndex >= 0 ? items[selectedItemIndex] : selectedItem
  const previousItem =
    selectedItemIndex > 0 ? items[selectedItemIndex - 1] : null
  const nextItem =
    selectedItemIndex >= 0 && selectedItemIndex < items.length - 1
      ? items[selectedItemIndex + 1]
      : null
  const itemTypeLabel =
    itemType === "rule"
      ? "Regla"
      : itemType === "exception"
        ? "Excepcion"
        : itemType === "error"
          ? "Error"
          : "Contenido"
  const detailTitle =
    selectedItemIndex >= 0
      ? `${itemTypeLabel} ${selectedItemIndex + 1} - ${currentSelectedItem?.title ?? ""}`
      : currentSelectedItem?.title ?? ""

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

  const handleDeleteItem = async (item: SectionItemRecord) => {
    const confirmed = await confirmAction({
      title: "Eliminar contenido",
      description: `Esta accion eliminara "${item.title}".`,
      confirmLabel: "Eliminar",
    })
    if (!confirmed) return

    deleteItem(item.id)
      .then(() => {
        if (selectedItem?.id === item.id) {
          setSelectedItem(null)
        }
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el contenido.",
        )
      })
  }

  if (currentSelectedItem) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="mb-5 flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="flex-shrink-0 rounded-xl border border-border bg-background p-2 transition-colors hover:bg-accent"
              aria-label="Volver a la lista"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {selectedItemIndex >= 0
                  ? `${itemTypeLabel} ${selectedItemIndex + 1} de ${items.length}`
                  : itemTypeLabel}
              </p>
              <h2 className="mt-1 break-words text-xl font-semibold text-foreground [overflow-wrap:anywhere]">
                {detailTitle}
              </h2>
              <div className="mt-2">
                <SectionItemMeta item={currentSelectedItem} />
              </div>
            </div>

            {(canEdit || canDelete) ? (
              <div className="flex flex-shrink-0 gap-2">
                {canEdit ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar contenido",
                        description: `Vas a modificar "${currentSelectedItem.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingItem(currentSelectedItem)
                      setShowModal(true)
                    }}
                    className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                ) : null}
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(currentSelectedItem)}
                    className="rounded-lg bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="border-t border-border pt-5">
            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground/85 [overflow-wrap:anywhere]">
              {currentSelectedItem.description}
            </p>

            {currentSelectedItem.content ? (
              <div className="mt-5 rounded-lg border border-border bg-background/50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Explicacion adicional
                </h3>
                <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                  {currentSelectedItem.content}
                </p>
              </div>
            ) : null}

            {currentSelectedItem.imageUrl ? (
              <button
                type="button"
                onClick={() =>
                  setPreviewImage({
                    url: currentSelectedItem.imageUrl!,
                    title: currentSelectedItem.title,
                  })
                }
                className="group relative mt-5 block w-full overflow-hidden rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={currentSelectedItem.imageUrl}
                  alt=""
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
                <span className="absolute right-3 top-3 rounded-lg bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => previousItem && setSelectedItem(previousItem)}
              disabled={!previousItem}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">
                  Anterior
                </span>
                <span className="block truncate">
                  {previousItem?.title ?? "Inicio de la lista"}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => nextItem && setSelectedItem(nextItem)}
              disabled={!nextItem}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-left text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xs opacity-80">Siguiente</span>
                <span className="block truncate">
                  {nextItem?.title ?? "Fin de la lista"}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            </button>
          </div>
        </div>

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
        <SectionImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
        {confirmDialog}
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
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
          className={`glass-card group rounded-2xl p-4 sm:p-5 ${cardClass}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 rounded-xl ${accentClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <button
              type="button"
              onClick={() => setSelectedItem(item)}
              className="min-w-0 flex-1 text-left focus:outline-none"
            >
              <div className="mb-1 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <h3 className="min-w-0 break-words font-semibold text-foreground [overflow-wrap:anywhere]">
                  {itemTypeLabel} {index + 1} - {item.title}
                </h3>
                <SectionItemMeta item={item} />
              </div>
              <p className="line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                {item.description}
              </p>
              {item.imageUrl ? (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Incluye imagen de referencia
                  <ZoomIn className="h-3.5 w-3.5" />
                </span>
              ) : null}
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Ver detalle
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
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
                    onClick={() => handleDeleteItem(item)}
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

function SectionImagePreviewModal({
  image,
  onClose,
}: {
  image: { url: string; title: string } | null
  onClose: () => void
}) {
  if (!image) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-zoom-out"
        onClick={onClose}
        aria-label="Cerrar imagen ampliada"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              Imagen de referencia
            </p>
            <h3 className="truncate text-lg font-semibold text-foreground">
              {image.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card p-2 transition-colors hover:bg-accent"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-3">
          <img
            src={image.url}
            alt={image.title}
            className="max-h-[78vh] max-w-full object-contain"
          />
        </div>
      </motion.div>
    </div>
  )
}

function PhotoItemsContent({
  sectionId,
  canAdd,
  canEdit,
  canDelete,
  userId,
}: {
  sectionId: string
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
  userId?: string
}) {
  const { items, isLoading, errorMessage, setErrorMessage, saveItem, deleteItem } =
    useSectionItems(sectionId, userId)
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
