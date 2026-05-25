"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit2,
  Grid3x3,
  Lock,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  allPermissions,
  defaultRoles,
  permissionLabels,
  roleMetadata,
  rolePermissions,
  type Permission,
  type User,
  type UserRole,
} from "@/lib/roles-permissions"

interface AdminPanelProps {
  onBack: () => void
}

interface RoleConfig {
  id: UserRole
  label: string
  description: string
  color: string
  permissions: Permission[]
  locked?: boolean
}

type ModalMode = "create" | "edit"

const roleColors = [
  "bg-red-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-amber-600",
  "bg-rose-600",
]

const initialRoles: RoleConfig[] = defaultRoles.map((role) => ({
  id: role,
  label: roleMetadata[role].label,
  description: roleMetadata[role].description,
  color: roleMetadata[role].color,
  permissions: role === "admin" ? allPermissions : rolePermissions[role] ?? [],
  locked: role === "admin",
}))

const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    role: "admin",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Juan Garcia",
    email: "juan@example.com",
    role: "supervisor",
    createdAt: "2025-02-20",
  },
  {
    id: "3",
    name: "Maria Lopez",
    email: "maria@example.com",
    role: "encuestador",
    createdAt: "2025-03-10",
  },
  {
    id: "4",
    name: "Pedro Rodriguez",
    email: "pedro@example.com",
    role: "analista_calidad",
    createdAt: "2025-03-15",
    extraPermissions: ["delete_section"],
  },
]

function createRoleId(label: string) {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function formatPermission(permission: Permission) {
  return permissionLabels[permission] ?? permission.replace(/_/g, " ")
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles, setRoles] = useState<RoleConfig[]>(initialRoles)
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users")
  const [showUserModal, setShowUserModal] = useState(false)
  const [userModalMode, setUserModalMode] = useState<ModalMode>("create")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [temporaryPassword, setTemporaryPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("supervisor")
  const [selectedExtraPermissions, setSelectedExtraPermissions] = useState<Permission[]>([])
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [roleModalMode, setRoleModalMode] = useState<ModalMode>("create")
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null)
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [roleSelectedPermissions, setRoleSelectedPermissions] = useState<Permission[]>([])

  const roleMap = useMemo(
    () => new Map(roles.map((role) => [role.id, role])),
    [roles],
  )

  const getUserPermissions = (user: User) => {
    const role = roleMap.get(user.role)
    if (user.role === "admin") return allPermissions

    return Array.from(
      new Set([...(role?.permissions ?? []), ...(user.extraPermissions ?? [])]),
    )
  }

  const togglePermission = (
    permission: Permission,
    permissions: Permission[],
    setPermissions: (permissions: Permission[]) => void,
  ) => {
    setPermissions(
      permissions.includes(permission)
        ? permissions.filter((item) => item !== permission)
        : [...permissions, permission],
    )
  }

  const openCreateUser = () => {
    setUserModalMode("create")
    setEditingUser(null)
    setUserName("")
    setUserEmail("")
    setTemporaryPassword("")
    setSelectedRole("encuestador")
    setSelectedExtraPermissions([])
    setShowUserModal(true)
  }

  const openEditUser = (user: User) => {
    setUserModalMode("edit")
    setEditingUser(user)
    setUserName(user.name)
    setUserEmail(user.email)
    setTemporaryPassword("")
    setSelectedRole(user.role)
    setSelectedExtraPermissions(user.extraPermissions ?? [])
    setShowUserModal(true)
  }

  const handleSaveUser = () => {
    const trimmedName = userName.trim()
    const trimmedEmail = userEmail.trim()

    if (!trimmedName || !trimmedEmail) return

    if (userModalMode === "create") {
      setUsers((currentUsers) => [
        ...currentUsers,
        {
          id: Date.now().toString(),
          name: trimmedName,
          email: trimmedEmail,
          role: selectedRole,
          createdAt: new Date().toISOString().split("T")[0],
          extraPermissions:
            selectedRole === "admin" ? [] : selectedExtraPermissions,
        },
      ])
      setShowUserModal(false)
      return
    }

    if (!editingUser) return

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: trimmedName,
              email: trimmedEmail,
              role: selectedRole,
              extraPermissions:
                selectedRole === "admin" ? [] : selectedExtraPermissions,
            }
          : user,
      ),
    )
    setShowUserModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id))
  }

  const openCreateRole = () => {
    setRoleModalMode("create")
    setEditingRole(null)
    setRoleName("")
    setRoleDescription("")
    setRoleSelectedPermissions(["view_dashboard", "view_projects"])
    setShowRoleModal(true)
  }

  const openEditRole = (role: RoleConfig) => {
    setRoleModalMode("edit")
    setEditingRole(role)
    setRoleName(role.label)
    setRoleDescription(role.description)
    setRoleSelectedPermissions(role.permissions)
    setShowRoleModal(true)
  }

  const handleSaveRole = () => {
    const trimmedName = roleName.trim()
    if (!trimmedName) return

    if (roleModalMode === "edit" && editingRole) {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                label: trimmedName,
                description: roleDescription.trim(),
                permissions: role.locked ? allPermissions : roleSelectedPermissions,
              }
            : role,
        ),
      )
    } else {
      const roleId = createRoleId(trimmedName)
      if (!roleId || roles.some((role) => role.id === roleId)) return

      setRoles((currentRoles) => [
        ...currentRoles,
        {
          id: roleId,
          label: trimmedName,
          description: roleDescription.trim() || "Rol personalizado",
          color: roleColors[currentRoles.length % roleColors.length],
          permissions: roleSelectedPermissions,
        },
      ])
    }

    setShowRoleModal(false)
    setEditingRole(null)
  }

  const handleDeleteRole = (role: RoleConfig) => {
    if (role.locked) return
    if (!confirm(`¿Eliminar el rol ${role.label}?`)) return

    const fallbackRole = "encuestador"
    setRoles((currentRoles) => currentRoles.filter((item) => item.id !== role.id))
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.role === role.id ? { ...user, role: fallbackRole } : user,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <button
          onClick={onBack}
          className="rounded-lg p-2 transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Settings className="h-8 w-8 text-primary" />
            Panel de Administracion
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestion de usuarios, roles y permisos
          </p>
        </div>
      </motion.div>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`rounded-lg px-6 py-2 font-medium transition-all ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="mr-2 inline h-4 w-4" />
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`rounded-lg px-6 py-2 font-medium transition-all ${
            activeTab === "roles"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="mr-2 inline h-4 w-4" />
          Roles y Permisos
        </button>
      </div>

      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Gestion de Usuarios ({users.length})
            </h2>
            <Button onClick={openCreateUser} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>

          <div className="grid gap-4">
            {users.map((user) => {
              const role = roleMap.get(user.role)
              const userPermissions = getUserPermissions(user)

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-4 transition-all hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-400 font-bold text-white">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {user.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
                              role?.color ?? "bg-slate-600"
                            }`}
                          >
                            {role?.label ?? user.role}
                          </span>
                          {user.extraPermissions?.length ? (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              +{user.extraPermissions.length} permisos extra
                            </span>
                          ) : null}
                          <span className="text-xs text-muted-foreground">
                            Desde {user.createdAt}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Permisos efectivos: {userPermissions.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditUser(user)}
                          className="rounded-lg p-2 transition-colors hover:bg-accent"
                          title="Editar permisos"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "roles" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Roles y Permisos Disponibles
            </h2>
            <Button onClick={openCreateRole} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Rol
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="h-full p-6 transition-all hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${role.color}`}
                      >
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {role.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditRole(role)}
                        className="rounded-lg p-2 transition-colors hover:bg-accent"
                        title="Editar rol"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {!role.locked && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Eliminar rol"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="mb-3 text-sm font-medium text-foreground">
                      Permisos ({role.permissions.length}):
                    </p>
                    <div className="grid gap-2">
                      {role.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-2 rounded-lg bg-accent/50 p-2"
                        >
                          <Grid3x3 className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">
                            {formatPermission(permission)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card p-6 shadow-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {userModalMode === "create" ? "Crear Usuario" : "Permisos de Usuario"}
            </h2>

            <div className="mb-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <Input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Correo electronico
                </label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  placeholder="usuario@empresa.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Contrasena temporal
                </label>
                <Input
                  type="text"
                  value={temporaryPassword}
                  onChange={(event) => setTemporaryPassword(event.target.value)}
                  placeholder={
                    userModalMode === "create"
                      ? "Clave inicial entregada por el administrador"
                      : "Dejar vacio si no cambia"
                  }
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Solo simula el flujo frontend; luego el backend guardara y enviara esta credencial.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-foreground">
                Rol base
              </label>
              <select
                value={selectedRole}
                onChange={(event) => {
                  setSelectedRole(event.target.value as UserRole)
                  if (event.target.value === "admin") {
                    setSelectedExtraPermissions([])
                  }
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Permisos extra para este usuario
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {allPermissions.map((permission) => {
                  const basePermissions =
                    selectedRole === "admin"
                      ? allPermissions
                      : roleMap.get(selectedRole)?.permissions ?? []
                  const isIncludedByRole = basePermissions.includes(permission)

                  return (
                    <label
                      key={permission}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                        isIncludedByRole
                          ? "border-border bg-muted/40 text-muted-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          isIncludedByRole ||
                          selectedExtraPermissions.includes(permission)
                        }
                        disabled={isIncludedByRole || selectedRole === "admin"}
                        onChange={() =>
                          togglePermission(
                            permission,
                            selectedExtraPermissions,
                            setSelectedExtraPermissions,
                          )
                        }
                        className="h-4 w-4"
                      />
                      <span>{formatPermission(permission)}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false)
                  setEditingUser(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveUser}
                className="flex-1"
                disabled={!userName.trim() || !userEmail.trim()}
              >
                {userModalMode === "create" ? "Crear cuenta" : "Guardar usuario"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card p-6 shadow-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {roleModalMode === "create" ? "Nuevo Rol" : "Editar Rol"}
            </h2>

            <div className="mb-4 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nombre del rol
                </label>
                <Input
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  disabled={editingRole?.locked}
                  placeholder="Ej: Coordinador regional"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Descripcion
                </label>
                <textarea
                  value={roleDescription}
                  onChange={(event) => setRoleDescription(event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe el alcance de este rol"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-foreground">
                Permisos del rol
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {allPermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={
                        editingRole?.locked ||
                        roleSelectedPermissions.includes(permission)
                      }
                      disabled={editingRole?.locked}
                      onChange={() =>
                        togglePermission(
                          permission,
                          roleSelectedPermissions,
                          setRoleSelectedPermissions,
                        )
                      }
                      className="h-4 w-4"
                    />
                    <span>{formatPermission(permission)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleModal(false)
                  setEditingRole(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveRole} className="flex-1" disabled={!roleName.trim()}>
                Guardar rol
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
