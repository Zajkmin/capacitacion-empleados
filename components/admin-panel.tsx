"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Lock,
  MoreVertical,
  ArrowLeft,
  Settings,
  Grid3x3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  roleMetadata,
  getPermissions,
  type UserRole,
  type User,
  rolePermissions,
} from "@/lib/roles-permissions"

interface AdminPanelProps {
  onBack: () => void
}

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
    name: "Juan García",
    email: "juan@example.com",
    role: "supervisor",
    createdAt: "2025-02-20",
  },
  {
    id: "3",
    name: "Maria López",
    email: "maria@example.com",
    role: "operario",
    createdAt: "2025-03-10",
  },
  {
    id: "4",
    name: "Pedro Rodríguez",
    email: "pedro@example.com",
    role: "especialista",
    createdAt: "2025-03-15",
  },
]

const roles: UserRole[] = ["admin", "supervisor", "operario", "especialista"]

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>("supervisor")

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setSelectedRole(user.role)
    setShowEditModal(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, role: selectedRole } : u
        )
      )
      setShowEditModal(false)
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión de usuarios, roles y permisos
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === "roles"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Roles y Permisos
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Gestión de Usuarios ({users.length})
            </h2>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Usuario
            </Button>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold">
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
                      <div className="flex gap-2 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                            roleMetadata[user.role].color
                          }`}
                        >
                          {roleMetadata[user.role].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Desde {user.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Roles y Permisos Disponibles
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => {
              const metadata = roleMetadata[role]
              const permissions = getPermissions(role)

              return (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all h-full">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${metadata.color} text-white flex items-center justify-center`}
                      >
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {metadata.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {metadata.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground mb-3">
                        Permisos ({permissions.length}):
                      </p>
                      <div className="grid gap-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg"
                          >
                            <Grid3x3 className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground capitalize">
                              {permission
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Editar Usuario
            </h2>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Usuario:</p>
              <p className="font-medium text-foreground">{editingUser.name}</p>
              <p className="text-sm text-muted-foreground">{editingUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground block mb-3">
                Rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleMetadata[role].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
