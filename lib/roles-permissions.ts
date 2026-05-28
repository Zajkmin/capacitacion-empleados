// Tipos de roles disponibles. Se deja abierto a string para simular roles creados
// desde el frontend hasta conectar el backend.
export type UserRole =
  | "admin"
  | "supervisor"
  | "encuestador"
  | "analista_calidad"
  | (string & {})

// Permisos disponibles
export type Permission =
  | "view_dashboard"
  | "view_projects"
  | "view_sections"
  | "add_section"
  | "edit_section"
  | "delete_section"
  | "manage_users"
  | "view_training"
  | "view_updates"
  | "manage_roles"

export const allPermissions: Permission[] = [
  "view_dashboard",
  "view_projects",
  "view_sections",
  "add_section",
  "edit_section",
  "delete_section",
  "manage_users",
  "view_training",
  "view_updates",
  "manage_roles",
]

export const permissionLabels: Record<Permission, string> = {
  view_dashboard: "Ver dashboard",
  view_projects: "Ver proyectos",
  view_sections: "Ver secciones",
  add_section: "Agregar contenido",
  edit_section: "Editar contenido",
  delete_section: "Eliminar contenido",
  manage_users: "Gestionar usuarios",
  view_training: "Ver capacitacion",
  view_updates: "Ver notificaciones",
  manage_roles: "Gestionar roles y permisos",
}

// Definicion inicial de roles y sus permisos
export const rolePermissions: Record<string, Permission[]> = {
  admin: allPermissions,
  supervisor: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "view_training",
    "view_updates",
  ],
  encuestador: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "view_training",
  ],
  analista_calidad: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "add_section",
    "edit_section",
    "view_training",
    "view_updates",
  ],
}

export const defaultRoles: UserRole[] = [
  "admin",
  "supervisor",
  "encuestador",
  "analista_calidad",
]

// Metadatos de roles
export const roleMetadata: Record<
  string,
  { label: string; description: string; color: string }
> = {
  admin: {
    label: "Administrador",
    description: "Acceso completo a todas las funciones",
    color: "bg-red-600",
  },
  supervisor: {
    label: "Supervisor",
    description: "Coordina equipos y supervisa proyectos",
    color: "bg-blue-600",
  },
  encuestador: {
    label: "Encuestador",
    description: "Acceso operativo a proyectos y capacitacion",
    color: "bg-green-600",
  },
  analista_calidad: {
    label: "Analista Control de Calidad",
    description: "Revisa, edita y valida contenido operativo",
    color: "bg-purple-600",
  },
}

// Funcion para verificar si un rol tiene un permiso
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === "admin") return true
  return rolePermissions[role]?.includes(permission) ?? false
}

// Funcion para obtener permisos de un rol
export function getPermissions(role: UserRole): Permission[] {
  if (role === "admin") return allPermissions
  return rolePermissions[role] ?? []
}

export interface PermissionAwareUser {
  role: UserRole
  permissions?: Permission[]
}

export function userHasPermission(
  user: PermissionAwareUser,
  permission: Permission,
): boolean {
  if (user.role === "admin") return true
  if (user.permissions) return user.permissions.includes(permission)
  return hasPermission(user.role, permission)
}

// Tipos de secciones del proyecto
export type SectionType =
  | "rules"
  | "exceptions"
  | "visual-learning"
  | "library"
  | "photos"
  | "errors"
  | "updates"

export interface Section {
  id: string
  title: string
  description: string
  type: SectionType
  content?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Project {
  id: string
  name: string
  client: string
  description: string
  color: string
  logo: string
  sections: Section[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  extraPermissions?: Permission[]
}
