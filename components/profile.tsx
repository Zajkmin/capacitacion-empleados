"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { listProjectGroupsWithProjects } from "@/lib/supabase/projects"
import { updateOwnProfileName } from "@/lib/supabase/profiles"
import {
  permissionLabels,
  roleMetadata,
  type Permission,
  type UserRole,
} from "@/lib/roles-permissions"

interface ProfileProps {
  user: {
    id?: string
    name: string
    email: string
    role: UserRole
    permissions?: Permission[]
    extraPermissions?: Permission[]
  }
  onBack: () => void
  onLogout: () => void
  onUserUpdate: (updates: { name?: string }) => void
}

export function Profile({ user, onBack, onLogout, onUserUpdate }: ProfileProps) {
  const [projectsCount, setProjectsCount] = useState(0)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const roleInfo = roleMetadata[user.role] ?? {
    label: user.role,
    description: "Rol personalizado",
    color: "bg-slate-600",
  }

  useEffect(() => {
    setName(user.name)
  }, [user.name])

  useEffect(() => {
    let isMounted = true

    listProjectGroupsWithProjects()
      .then((groups) => {
        if (!isMounted) return
        setProjectsCount(
          groups.reduce((total, group) => total + group.projects.length, 0),
        )
      })
      .catch(() => {
        if (isMounted) setProjectsCount(0)
      })
      .finally(() => {
        if (isMounted) setIsLoadingProjects(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const initials = useMemo(
    () =>
      user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [user.name],
  )

  const activePermissions = user.permissions ?? []
  const extraPermissions = user.extraPermissions ?? []
  const joinedAt = new Date().toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName === user.name) {
      setIsEditOpen(false)
      return
    }

    setIsSaving(true)
    setErrorMessage("")
    setMessage("")

    try {
      const updatedProfile = await updateOwnProfileName({ name: trimmedName })
      onUserUpdate({ name: updatedProfile.name })
      setMessage("Perfil actualizado correctamente.")
      setIsEditOpen(false)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo actualizar el perfil.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-border bg-card p-2 transition-colors hover:bg-card/80"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-foreground">Mi Perfil</h1>
              <p className="text-sm text-muted-foreground">
                Cuenta, permisos y acceso asignado
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 p-4 lg:p-8">
        {message ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
            {message}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
                {initials || <User className="h-7 w-7" />}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold text-foreground">
                  {user.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(true)}
              className="w-fit gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar nombre
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ProfileMetric
            icon={FolderKanban}
            label="Proyectos visibles"
            value={isLoadingProjects ? "..." : String(projectsCount)}
          />
          <ProfileMetric
            icon={Shield}
            label="Rol"
            value={roleInfo.label}
          />
          <ProfileMetric
            icon={KeyRound}
            label="Permisos activos"
            value={String(activePermissions.length)}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  Acceso y permisos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lo que tu rol puede ver o modificar en la app.
                </p>
              </div>
              <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {activePermissions.length ? (
                activePermissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                    <span>{permissionLabels[permission] ?? permission}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                  No hay permisos cargados para este perfil.
                </div>
              )}
            </div>

            {extraPermissions.length ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Incluye {extraPermissions.length} permiso adicional asignado directamente.
              </p>
            ) : null}
          </motion.div>

          <motion.div
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            <h3 className="font-semibold text-foreground">Preferencias</h3>
            <div className="mt-4 divide-y divide-border rounded-lg border border-border">
              <PreferenceRow
                icon={Bell}
                label="Notificaciones"
                value="Activas"
              />
              <PreferenceRow
                icon={CalendarClock}
                label="Sesion"
                value={`Activa desde ${joinedAt}`}
              />
              <PreferenceRow
                icon={Shield}
                label="Privacidad"
                value="Gestionada por rol"
              />
            </div>
          </motion.div>
        </section>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Editar nombre</DialogTitle>
              <DialogDescription>
                Este cambio se guarda en tu perfil de Supabase.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label htmlFor="profile-name" className="text-sm font-medium">
                Nombre visible
              </label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!name.trim() || isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProfileMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-5 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  )
}

function PreferenceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <span className="text-right text-sm text-muted-foreground">{value}</span>
    </div>
  )
}
