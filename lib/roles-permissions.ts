// Tipos de roles disponibles
export type UserRole = "admin" | "supervisor" | "operario" | "especialista"

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

// Definición de roles y sus permisos
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
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
  ],
  supervisor: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "view_training",
    "view_updates",
  ],
  operario: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "view_training",
  ],
  especialista: [
    "view_dashboard",
    "view_projects",
    "view_sections",
    "add_section",
    "edit_section",
    "view_training",
    "view_updates",
  ],
}

// Metadatos de roles
export const roleMetadata: Record<UserRole, { label: string; description: string; color: string }> = {
  admin: {
    label: "Administrador",
    description: "Acceso completo a todas las funciones",
    color: "bg-red-600",
  },
  supervisor: {
    label: "Supervisor de Campo",
    description: "Acceso a ver proyectos y capacitación",
    color: "bg-blue-600",
  },
  operario: {
    label: "Operario",
    description: "Acceso básico a proyectos",
    color: "bg-green-600",
  },
  especialista: {
    label: "Especialista",
    description: "Puede crear y editar contenido",
    color: "bg-purple-600",
  },
}

// Función para verificar si un rol tiene un permiso
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

// Función para obtener permisos de un rol
export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role]
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
}
