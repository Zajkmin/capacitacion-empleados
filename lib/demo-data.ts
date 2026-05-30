"use client"

import { allPermissions, type Permission, type User, type UserRole } from "@/lib/roles-permissions"
import { notifyDemoWrite } from "@/lib/demo-mode"
import type {
  ProjectActivityRecord,
  ProjectDetailRecord,
  ProjectGroupRecord,
  ProjectRecord,
  ProjectSectionRecord,
  SectionItemRecord,
  SectionItemType,
} from "@/lib/supabase/projects"
import type { RoleConfig } from "@/lib/supabase/roles"
import type {
  TrainingContentType,
  TrainingTopicRecord,
} from "@/lib/supabase/training"

type DemoStore = {
  groups: ProjectGroupRecord[]
  sections: Record<string, ProjectSectionRecord[]>
  items: Record<string, SectionItemRecord[]>
  training: TrainingTopicRecord[]
  users: User[]
  roles: RoleConfig[]
  activities: ProjectActivityRecord[]
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function nowIso() {
  return new Date().toISOString()
}

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

const initialStore: DemoStore = {
  groups: [
    {
      id: "demo-group-supermercados",
      name: "Clientes Demo",
      type: "demo",
      projects: [
        {
          id: "demo-project-arcor",
          name: "Arcor PY Demo",
          bgColor: "bg-sky-600",
          textColor: "text-white",
          coverImage: undefined,
        },
        {
          id: "demo-project-lacteos",
          name: "Lacteos Centro Demo",
          bgColor: "bg-emerald-600",
          textColor: "text-white",
          coverImage: undefined,
        },
      ],
    },
  ],
  sections: {
    "demo-project-arcor": [
      {
        id: "demo-section-rules",
        title: "Reglas del Proyecto",
        description: "Normativas clave para ejecucion en punto de venta",
        type: "rules",
        content: "Validar exhibicion, precios, stock visible y evidencia fotografica.",
        color: "bg-primary",
      },
      {
        id: "demo-section-exceptions",
        title: "Excepciones",
        description: "Casos permitidos con justificacion",
        type: "exceptions",
        color: "bg-amber-500",
      },
      {
        id: "demo-section-visual",
        title: "Aprendizaje Visual",
        description: "Comparativas para identificar ejecucion correcta",
        type: "visual-learning",
        color: "bg-violet-500",
      },
      {
        id: "demo-section-library",
        title: "Biblioteca",
        description: "Documentos y recursos del proyecto",
        type: "library",
        color: "bg-slate-500",
      },
      {
        id: "demo-section-photos",
        title: "Fotos Guia",
        description: "Referencias visuales de ejecucion",
        type: "photos",
        color: "bg-emerald-500",
      },
      {
        id: "demo-section-errors",
        title: "Errores Frecuentes",
        description: "Que evitar durante el relevamiento",
        type: "errors",
        color: "bg-rose-500",
      },
      {
        id: "demo-section-updates",
        title: "Actualizaciones",
        description: "Cambios recientes del proyecto",
        type: "updates",
        color: "bg-cyan-500",
      },
    ],
    "demo-project-lacteos": [
      {
        id: "demo-section-lacteos-rules",
        title: "Reglas de Cadena de Frio",
        description: "Controles basicos para productos refrigerados",
        type: "rules",
        color: "bg-primary",
      },
      {
        id: "demo-section-lacteos-photos",
        title: "Fotos Guia",
        description: "Ejemplos visuales de heladeras y cabeceras",
        type: "photos",
        color: "bg-emerald-500",
      },
    ],
  },
  items: {
    "demo-section-rules": [
      {
        id: "demo-item-rule-facing",
        sectionId: "demo-section-rules",
        type: "rule",
        title: "Facing minimo por marca",
        description:
          "Cada marca asignada debe tener al menos dos frentes visibles en gondola principal.",
        content:
          "Si el espacio esta bloqueado por quiebre, registrar evidencia y reportar al supervisor.",
        metadata: { prioridad: "alta", palabraClave: "gondola facing regla" },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      {
        id: "demo-item-rule-price",
        sectionId: "demo-section-rules",
        type: "rule",
        title: "Precio visible",
        description:
          "Toda exhibicion auditada debe contar con fleje o precio legible para el consumidor.",
        content: "La foto debe mostrar producto y precio en el mismo encuadre.",
        metadata: { palabraClave: "precio fleje" },
        sortOrder: 1,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-exceptions": [
      {
        id: "demo-item-exception-stock",
        sectionId: "demo-section-exceptions",
        type: "exception",
        title: "Quiebre total de stock",
        description:
          "Si no hay producto disponible en sala ni deposito, se permite cerrar la tarea con evidencia.",
        content:
          "Adjuntar foto de gondola y comentario del encargado cuando sea posible.",
        metadata: { palabraClave: "quiebre excepcion" },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-photos": [
      {
        id: "demo-item-photo-header",
        sectionId: "demo-section-photos",
        type: "photo",
        title: "Foto guia de cabecera correcta",
        description:
          "La evidencia debe tomar cabecera completa, precio y productos principales.",
        imageUrl: "/placeholder.jpg",
        metadata: { palabraClave: "cabecera foto guia" },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-errors": [
      {
        id: "demo-item-error-blurry",
        sectionId: "demo-section-errors",
        type: "error",
        title: "Foto borrosa o cortada",
        description:
          "No se acepta evidencia donde no se distinguen productos, precios o ubicacion.",
        content: "Repetir la captura antes de salir del punto de venta.",
        metadata: { palabraClave: "foto error evidencia" },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-library": [
      {
        id: "demo-item-library-manual",
        sectionId: "demo-section-library",
        type: "library",
        title: "Manual demo de ejecucion",
        description: "guides",
        imageUrl: "/placeholder.jpg",
        sourceUrl: "/placeholder.jpg",
        metadata: {
          resourceType: "document",
          category: "guides",
          size: "1.8 MB",
          date: "30 May 2026",
          starred: true,
        },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-visual": [
      {
        id: "demo-item-visual-gondola",
        sectionId: "demo-section-visual",
        type: "visual-learning",
        title: "Gondola ordenada vs desordenada",
        description: "Identifica una exhibicion clara y auditable.",
        content: "Prioriza encuadre, iluminacion y lectura de flejes.",
        imageUrl: "/placeholder.jpg",
        metadata: {
          correctLabel: "Correcto",
          incorrectLabel: "Incorrecto",
          correctPoints: ["Productos alineados", "Precio visible", "Foto frontal"],
          incorrectPoints: ["Productos cortados", "Sin fleje", "Encuadre inclinado"],
          correctImageUrl: "/placeholder.jpg",
          incorrectImageUrl: "/placeholder.svg",
          tip: "Si el precio no se ve, acercate y toma una segunda foto.",
        },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-updates": [
      {
        id: "demo-item-update-price",
        sectionId: "demo-section-updates",
        type: "update",
        title: "Nueva prioridad de precio",
        description: "Desde esta semana, el precio visible es obligatorio.",
        metadata: { priority: "alta" },
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-lacteos-rules": [
      {
        id: "demo-item-lacteos-temp",
        sectionId: "demo-section-lacteos-rules",
        type: "rule",
        title: "Temperatura visible",
        description: "Registrar heladera con termometro visible cuando exista.",
        metadata: {},
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
    "demo-section-lacteos-photos": [
      {
        id: "demo-item-lacteos-photo",
        sectionId: "demo-section-lacteos-photos",
        type: "photo",
        title: "Heladera limpia y ordenada",
        description: "Ejemplo de foto guia para cadena de frio.",
        imageUrl: "/placeholder.jpg",
        metadata: {},
        sortOrder: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
  },
  training: [
    {
      id: "demo-training-evidence",
      title: "Como tomar evidencia fotografica",
      category: "general",
      order: 1,
      summary: "Buenas practicas para fotos claras, auditables y completas.",
      body:
        "Toma la foto de frente, evita reflejos y confirma que producto, precio y ubicacion sean visibles.",
      contentType: "photo",
      mediaUrl: "/placeholder.jpg",
      visibleTo: ["admin", "supervisor", "encuestador", "analista_calidad"],
      updatedAt: "2026-05-30",
    },
    {
      id: "demo-training-exceptions",
      title: "Registro de excepciones",
      category: "supervisor",
      order: 1,
      summary: "Cuando una regla no puede cumplirse, documenta el motivo.",
      body:
        "Usa comentarios breves, evidencia visual y selecciona la causa correcta para que el equipo pueda validar.",
      contentType: "text",
      visibleTo: ["admin", "supervisor", "analista_calidad"],
      updatedAt: "2026-05-30",
    },
  ],
  users: [
    {
      id: "demo-user-admin",
      name: "Invitado Demo",
      email: "invitado@nexo.demo",
      role: "admin",
      createdAt: "2026-05-30",
      extraPermissions: [],
      assignedProjectIds: [],
    },
    {
      id: "demo-user-supervisor",
      name: "Supervisora Demo",
      email: "supervisora@nexo.demo",
      role: "supervisor",
      createdAt: "2026-05-29",
      extraPermissions: ["edit_section"],
      assignedProjectIds: ["demo-project-arcor"],
    },
  ],
  roles: [
    {
      id: "admin",
      label: "Administrador",
      description: "Acceso completo a todas las funciones",
      color: "bg-red-600",
      permissions: allPermissions,
      locked: true,
    },
    {
      id: "supervisor",
      label: "Supervisor",
      description: "Coordina equipos y supervisa proyectos",
      color: "bg-blue-600",
      permissions: [
        "view_dashboard",
        "view_projects",
        "view_sections",
        "view_training",
        "view_updates",
      ],
      locked: false,
    },
    {
      id: "encuestador",
      label: "Encuestador",
      description: "Acceso operativo a proyectos y capacitacion",
      color: "bg-green-600",
      permissions: [
        "view_dashboard",
        "view_projects",
        "view_sections",
        "view_training",
      ],
      locked: false,
    },
  ],
  activities: [
    {
      id: "demo-activity-1",
      projectId: "demo-project-arcor",
      projectName: "Arcor PY Demo",
      sectionId: "demo-section-rules",
      sectionTitle: "Reglas del Proyecto",
      sectionType: "rules",
      itemType: "rule",
      title: "Precio visible",
      description: "Se agrego una regla demo para flejes visibles.",
      action: "created",
      occurredAt: nowIso(),
    },
    {
      id: "demo-activity-2",
      projectId: "demo-project-arcor",
      projectName: "Arcor PY Demo",
      sectionId: "demo-section-photos",
      sectionTitle: "Fotos Guia",
      sectionType: "photos",
      itemType: "photo",
      title: "Foto guia de cabecera correcta",
      description: "Referencia visual actualizada para la demo.",
      action: "updated",
      occurredAt: nowIso(),
    },
  ],
}

let store = clone(initialStore)

export function resetDemoData() {
  store = clone(initialStore)
}

export function getDemoUser() {
  return {
    id: "demo-user-admin",
    name: "Invitado Demo",
    email: "invitado@nexo.demo",
    role: "admin" as UserRole,
    permissions: allPermissions,
    extraPermissions: [] as Permission[],
    isDemo: true,
    demoRoleLabel: "Administrador Demo",
  }
}

export function getDemoProjectGroups() {
  return clone(store.groups)
}

export function getDemoProject(projectId: string): ProjectDetailRecord {
  const group = store.groups.find((item) =>
    item.projects.some((project) => project.id === projectId),
  )
  const project = group?.projects.find((item) => item.id === projectId)
  if (!group || !project) throw new Error("Proyecto demo no encontrado.")
  return { ...clone(project), groupName: group.name }
}

export function saveDemoProjectGroup(input: {
  id?: string
  name: string
  type?: string
  sortOrder?: number
}) {
  notifyDemoWrite()
  if (input.id) {
    store.groups = store.groups.map((group) =>
      group.id === input.id ? { ...group, name: input.name, type: input.type ?? group.type } : group,
    )
    return clone(store.groups.find((group) => group.id === input.id)!)
  }

  const group: ProjectGroupRecord = {
    id: newId("demo-group"),
    name: input.name,
    type: input.type ?? "demo",
    projects: [],
  }
  store.groups.push(group)
  return clone(group)
}

export function deleteDemoProjectGroup(groupId: string) {
  notifyDemoWrite()
  store.groups = store.groups.filter((group) => group.id !== groupId)
}

export function saveDemoProject(input: {
  id?: string
  groupId: string
  name: string
  bgColor: string
  textColor?: string
  coverImage?: string
}) {
  notifyDemoWrite()
  const project: ProjectRecord = {
    id: input.id ?? newId("demo-project"),
    name: input.name,
    bgColor: input.bgColor,
    textColor: input.textColor ?? "text-white",
    coverImage: input.coverImage,
  }

  store.groups = store.groups.map((group) => ({
    ...group,
    projects: group.projects.filter((item) => item.id !== project.id),
  }))
  store.groups = store.groups.map((group) =>
    group.id === input.groupId
      ? { ...group, projects: [...group.projects, project] }
      : group,
  )

  if (!store.sections[project.id]) {
    store.sections[project.id] = clone(initialStore.sections["demo-project-arcor"]).map(
      (section, index) => ({
        ...section,
        id: `${project.id}-section-${index}`,
      }),
    )
  }

  return clone(project)
}

export function deleteDemoProject(projectId: string) {
  notifyDemoWrite()
  store.groups = store.groups.map((group) => ({
    ...group,
    projects: group.projects.filter((project) => project.id !== projectId),
  }))
  delete store.sections[projectId]
}

export function listDemoProjectSections(projectId: string) {
  return clone(store.sections[projectId] ?? [])
}

export function saveDemoProjectSection(input: {
  id?: string
  projectId: string
  title: string
  description: string
  type: ProjectSectionRecord["type"]
  content?: string
}) {
  notifyDemoWrite()
  const section: ProjectSectionRecord = {
    id: input.id ?? newId("demo-section"),
    title: input.title,
    description: input.description,
    type: input.type,
    content: input.content,
    color: {
      rules: "bg-primary",
      exceptions: "bg-amber-500",
      "visual-learning": "bg-violet-500",
      library: "bg-slate-500",
      photos: "bg-emerald-500",
      errors: "bg-rose-500",
      updates: "bg-cyan-500",
    }[input.type],
  }
  const currentSections = store.sections[input.projectId] ?? []
  store.sections[input.projectId] = input.id
    ? currentSections.map((item) => (item.id === input.id ? section : item))
    : [...currentSections, section]
  return clone(section)
}

export function deleteDemoProjectSection(sectionId: string) {
  notifyDemoWrite()
  Object.keys(store.sections).forEach((projectId) => {
    store.sections[projectId] = store.sections[projectId].filter(
      (section) => section.id !== sectionId,
    )
  })
  delete store.items[sectionId]
}

export function listDemoSectionItems(sectionId: string) {
  return clone(store.items[sectionId] ?? [])
}

export function saveDemoSectionItem(input: {
  id?: string
  sectionId: string
  type: SectionItemType
  title: string
  description: string
  content?: string
  imageUrl?: string
  sourceUrl?: string
  metadata?: Record<string, any>
  sortOrder?: number
}) {
  notifyDemoWrite()
  const item: SectionItemRecord = {
    id: input.id ?? newId("demo-item"),
    sectionId: input.sectionId,
    type: input.type,
    title: input.title,
    description: input.description,
    content: input.content,
    imageUrl: input.imageUrl,
    sourceUrl: input.sourceUrl,
    metadata: input.metadata ?? {},
    sortOrder: input.sortOrder ?? store.items[input.sectionId]?.length ?? 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  const currentItems = store.items[input.sectionId] ?? []
  store.items[input.sectionId] = input.id
    ? currentItems.map((current) => (current.id === input.id ? item : current))
    : [...currentItems, item]
  return clone(item)
}

export function deleteDemoSectionItem(itemId: string) {
  notifyDemoWrite()
  Object.keys(store.items).forEach((sectionId) => {
    store.items[sectionId] = store.items[sectionId].filter((item) => item.id !== itemId)
  })
}

export function listDemoActivity(projectId?: string) {
  return clone(
    projectId
      ? store.activities.filter((activity) => activity.projectId === projectId)
      : store.activities,
  )
}

export function listDemoTrainingTopics() {
  return clone(store.training)
}

export function saveDemoTrainingTopic(input: {
  id?: string
  title: string
  category: UserRole | "general"
  order: number
  summary: string
  body: string
  contentType: TrainingContentType
  mediaUrl?: string
  visibleTo: UserRole[]
}) {
  notifyDemoWrite()
  const topic: TrainingTopicRecord = {
    id: input.id ?? newId("demo-training"),
    title: input.title,
    category: input.category,
    order: input.order,
    summary: input.summary,
    body: input.body,
    contentType: input.contentType,
    mediaUrl: input.mediaUrl,
    visibleTo: input.visibleTo,
    updatedAt: new Date().toISOString().split("T")[0],
  }
  store.training = input.id
    ? store.training.map((item) => (item.id === input.id ? topic : item))
    : [...store.training, topic]
  return clone(topic)
}

export function deleteDemoTrainingTopic(topicId: string) {
  notifyDemoWrite()
  store.training = store.training.filter((topic) => topic.id !== topicId)
}

export function listDemoProfiles() {
  return clone(store.users)
}

export function updateDemoProfile(input: {
  id: string
  name: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  notifyDemoWrite()
  store.users = store.users.map((user) =>
    user.id === input.id
      ? {
          ...user,
          name: input.name,
          role: input.role,
          extraPermissions: input.extraPermissions,
        }
      : user,
  )
  return clone(store.users.find((user) => user.id === input.id)!)
}

export function updateDemoOwnProfileName(name: string) {
  notifyDemoWrite()
  store.users = store.users.map((user) =>
    user.id === "demo-user-admin" ? { ...user, name } : user,
  )
  return clone(store.users.find((user) => user.id === "demo-user-admin")!)
}

export function saveDemoUserProjectAssignments(input: {
  userId: string
  projectIds: string[]
}) {
  notifyDemoWrite()
  store.users = store.users.map((user) =>
    user.id === input.userId
      ? { ...user, assignedProjectIds: input.projectIds }
      : user,
  )
  return [...input.projectIds]
}

export function createDemoProfileUser(input: {
  name: string
  email: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  notifyDemoWrite()
  const user: User = {
    id: newId("demo-user"),
    name: input.name,
    email: input.email,
    role: input.role,
    extraPermissions: input.extraPermissions,
    assignedProjectIds: [],
    createdAt: new Date().toISOString().split("T")[0],
  }
  store.users = [user, ...store.users]
  return clone(user)
}

export function listDemoRoles() {
  return clone(store.roles)
}

export function getDemoRolePermissions(roleId: UserRole) {
  return store.roles.find((role) => role.id === roleId)?.permissions ?? []
}

export function saveDemoRole(role: RoleConfig) {
  notifyDemoWrite()
  store.roles = store.roles.some((item) => item.id === role.id)
    ? store.roles.map((item) => (item.id === role.id ? role : item))
    : [...store.roles, role]
  return clone(role)
}

export function deleteDemoRole(roleId: UserRole, fallbackRole: UserRole) {
  notifyDemoWrite()
  store.roles = store.roles.filter((role) => role.id !== roleId)
  store.users = store.users.map((user) =>
    user.role === roleId ? { ...user, role: fallbackRole, extraPermissions: [] } : user,
  )
}

function normalizeSearchText(value: unknown): string {
  if (value == null) return ""
  if (Array.isArray(value)) return value.map(normalizeSearchText).join(" ")
  if (typeof value === "object") return Object.values(value).map(normalizeSearchText).join(" ")
  return String(value)
}

export function searchDemoContent(query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length < 2) return []

  const projectBySection = new Map<string, { projectId: string; projectName: string; sectionTitle: string }>()
  store.groups.forEach((group) => {
    group.projects.forEach((project) => {
      store.sections[project.id]?.forEach((section) => {
        projectBySection.set(section.id, {
          projectId: project.id,
          projectName: project.name,
          sectionTitle: section.title,
        })
      })
    })
  })

  const sectionMatches = Object.values(store.items)
    .flat()
    .map((item) => {
      const context = projectBySection.get(item.sectionId)
      const searchable = [
        item.title,
        item.description,
        item.content,
        normalizeSearchText(item.metadata),
        context?.projectName,
        context?.sectionTitle,
      ]
        .join(" ")
        .toLowerCase()

      return { item, context, searchable }
    })
    .filter((entry) => entry.searchable.includes(normalizedQuery))
    .map(({ item, context }) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      content: [item.content, normalizeSearchText(item.metadata)].filter(Boolean).join("\n"),
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
      projectId: context?.projectId,
      projectName: context?.projectName,
      sectionId: item.sectionId,
      sectionTitle: context?.sectionTitle,
      contextLabel: [context?.projectName, context?.sectionTitle].filter(Boolean).join(" / "),
    }))

  const trainingMatches = store.training
    .filter((topic) =>
      [topic.title, topic.summary, topic.body, topic.category, topic.mediaUrl]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .map((topic) => ({
      id: topic.id,
      type: "training" as const,
      title: topic.title,
      description: topic.summary,
      content: topic.body,
      imageUrl: topic.contentType === "photo" ? topic.mediaUrl : undefined,
      sourceUrl: topic.mediaUrl,
      contextLabel: `Capacitacion / ${topic.category}`,
    }))

  return [...sectionMatches, ...trainingMatches]
}
