"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Building2, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  deleteProjectGroup,
  deleteProject,
  listProjectGroupsWithProjects,
  saveProjectGroup,
  saveProject,
  type ProjectGroupRecord,
  type ProjectRecord,
} from "@/lib/supabase/projects"

interface DashboardProps {
  user: { name: string; email: string; role: string }
  onProjectSelect: (projectId: string) => void
}

type ProjectType = ProjectRecord
type ProjectGroupType = ProjectGroupRecord

const projectColors = [
  "bg-sky-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-fuchsia-600",
  "bg-cyan-700",
  "bg-lime-700",
  "bg-orange-600",
]

function ProjectCard({
  project,
  onClick,
  canManage,
  onEdit,
  onDelete,
}: {
  project: ProjectType
  onClick: () => void
  canManage: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      className="group relative flex w-full flex-col items-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full"
      >
        <div
          className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg ${project.bgColor} shadow-md transition-all duration-300 group-hover:shadow-lg`}
        >
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <div className="relative flex flex-col items-center justify-center p-3 text-center">
            <span className={`text-base font-bold md:text-lg ${project.textColor}`}>
              {project.name}
            </span>
          </div>
        </div>
        <span className="mt-2 block max-w-full truncate text-sm text-foreground/70 transition-colors group-hover:text-foreground">
          {project.name}
        </span>
      </button>

      {canManage ? (
        <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm hover:bg-background"
            aria-label={`Editar ${project.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-background/90 text-destructive shadow-sm hover:bg-background"
            aria-label={`Eliminar ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </motion.div>
  )
}

function AddProjectButton({
  group,
  onClick,
}: {
  group: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="flex aspect-[4/3] w-full max-w-36 items-center justify-center justify-self-center rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary transition-colors hover:bg-primary/10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Agregar proyecto en ${group}`}
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  )
}

function ProjectGroupSection({
  group,
  projects,
  canManage,
  onProjectSelect,
  onProjectAdd,
  onGroupEdit,
  onGroupDelete,
  onProjectEdit,
  onProjectDelete,
  delay = 0,
}: {
  group: string
  projects: ProjectType[]
  canManage: boolean
  onProjectSelect: (projectId: string) => void
  onProjectAdd: () => void
  onGroupEdit: () => void
  onGroupDelete: () => void
  onProjectEdit: (project: ProjectType) => void
  onProjectDelete: (projectId: string) => void
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-8"
    >
      <div className="mb-4 flex items-center gap-3">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Proyectos de {group}
        </h2>
        <div className="h-px flex-1 bg-border" />
        {canManage ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onGroupEdit}
              aria-label={`Editar ${group}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onGroupDelete}
              aria-label={`Eliminar ${group}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onProjectAdd}
              aria-label={`Agregar proyecto en ${group}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-3 backdrop-blur-sm md:p-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="w-full max-w-36 justify-self-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: delay + index * 0.05 }}
            >
              <ProjectCard
                project={project}
                onClick={() => onProjectSelect(project.id)}
                canManage={canManage}
                onEdit={() => onProjectEdit(project)}
                onDelete={() => onProjectDelete(project.id)}
              />
            </motion.div>
          ))}
          {canManage ? (
            <AddProjectButton group={group} onClick={onProjectAdd} />
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}

export function Dashboard({ user, onProjectSelect }: DashboardProps) {
  const [groups, setGroups] = useState<ProjectGroupType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState("")
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [groupName, setGroupName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectGroupId, setProjectGroupId] = useState("")
  const [projectCoverImage, setProjectCoverImage] = useState<string | undefined>()
  const canManageDashboard = user.role === "admin"

  useEffect(() => {
    let isMounted = true

    listProjectGroupsWithProjects()
      .then((storedGroups) => {
        if (isMounted) setGroups(storedGroups)
      })
      .catch((error) => {
        if (!isMounted) return
        setDashboardError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los proyectos.",
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const getNextProjectNumber = (currentGroups: ProjectGroupType[]) =>
    currentGroups.reduce(
      (total, group) => total + group.projects.length,
      0,
    ) + 1

  const openProjectForm = (groupId: string) => {
    if (!canManageDashboard) return

    const nextProjectNumber = getNextProjectNumber(groups)

    setEditingProjectId(null)
    setProjectName(`Proyecto ${nextProjectNumber}`)
    setProjectGroupId(groupId)
    setProjectCoverImage(undefined)
    setIsProjectDialogOpen(true)
  }

  const openProjectEditForm = (groupId: string, project: ProjectType) => {
    if (!canManageDashboard) return

    setEditingProjectId(project.id)
    setProjectName(project.name)
    setProjectGroupId(groupId)
    setProjectCoverImage(project.coverImage)
    setIsProjectDialogOpen(true)
  }

  const openGroupForm = () => {
    if (!canManageDashboard) return

    setEditingGroupId(null)
    setGroupName(`Grupo ${groups.length + 1}`)
    setIsGroupDialogOpen(true)
  }

  const openGroupEditForm = (group: ProjectGroupType) => {
    if (!canManageDashboard) return

    setEditingGroupId(group.id)
    setGroupName(group.name)
    setIsGroupDialogOpen(true)
  }

  const handleGroupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManageDashboard) return

    const trimmedName = groupName.trim()
    if (!trimmedName) return

    try {
      const savedGroup = await saveProjectGroup({
        id: editingGroupId ?? undefined,
        name: trimmedName,
        sortOrder: groups.length,
      })

      setGroups((currentGroups) => {
        if (editingGroupId) {
          return currentGroups.map((group) =>
            group.id === editingGroupId
              ? { ...group, name: savedGroup.name, type: savedGroup.type }
              : group,
          )
        }

        return [...currentGroups, savedGroup]
      })
      setIsGroupDialogOpen(false)
      setDashboardError("")
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "No se pudo guardar el grupo.",
      )
    }
  }

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManageDashboard) return

    const trimmedName = projectName.trim()
    if (!trimmedName || !projectGroupId) return

    try {
      const existingProject = groups
        .flatMap((group) => group.projects)
        .find((project) => project.id === editingProjectId)
      const savedProject = await saveProject({
        id: editingProjectId ?? undefined,
        groupId: projectGroupId,
        name: trimmedName,
        bgColor:
          existingProject?.bgColor ??
          projectColors[getNextProjectNumber(groups) % projectColors.length],
        textColor: existingProject?.textColor ?? "text-white",
        coverImage: projectCoverImage,
        sortOrder: getNextProjectNumber(groups),
      })

      setGroups((currentGroups) => {
        return currentGroups.map((group) => {
          const filteredProjects = group.projects.filter(
            (project) => project.id !== editingProjectId,
          )

          if (group.id !== projectGroupId) {
            return { ...group, projects: filteredProjects }
          }

          return {
            ...group,
            projects: [
              ...filteredProjects,
              savedProject,
            ],
          }
        })
      })
      setIsProjectDialogOpen(false)
      setDashboardError("")
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "No se pudo guardar el proyecto.",
      )
    }
  }

  const handleGroupDelete = async (groupId: string) => {
    if (!canManageDashboard) return

    try {
      await deleteProjectGroup(groupId)
      setGroups((currentGroups) =>
        currentGroups.filter((group) => group.id !== groupId),
      )
      setDashboardError("")
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "No se pudo eliminar el grupo.",
      )
    }
  }

  const handleProjectDelete = async (groupId: string, projectId: string) => {
    if (!canManageDashboard) return

    try {
      await deleteProject(projectId)
      setGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                projects: group.projects.filter(
                  (project) => project.id !== projectId,
                ),
              }
            : group,
        ),
      )
      setDashboardError("")
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "No se pudo eliminar el proyecto.",
      )
    }
  }

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setProjectCoverImage(undefined)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProjectCoverImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="border-b border-border bg-card/30 p-4 backdrop-blur-sm md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Bienvenido, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona un proyecto para comenzar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary md:inline-block">
              {user.role}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-400 font-semibold text-white shadow-lg shadow-primary/25">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] p-4 md:p-6">
        {dashboardError ? (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {dashboardError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
            Cargando proyectos...
          </div>
        ) : null}

        {!isLoading && groups.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
            No hay grupos ni proyectos cargados.
          </div>
        ) : null}

        {groups.map((group, index) => (
          <ProjectGroupSection
            key={group.id}
            group={group.name}
            projects={group.projects}
            canManage={canManageDashboard}
            onProjectSelect={onProjectSelect}
            onProjectAdd={() => openProjectForm(group.id)}
            onGroupEdit={() => openGroupEditForm(group)}
            onGroupDelete={() => handleGroupDelete(group.id)}
            onProjectEdit={(project) => openProjectEditForm(group.id, project)}
            onProjectDelete={(projectId) =>
              handleProjectDelete(group.id, projectId)
            }
            delay={0.1 + index * 0.2}
          />
        ))}

        {canManageDashboard ? (
          <Button
            type="button"
            variant="outline"
            onClick={openGroupForm}
            className="flex w-full border-dashed border-primary/40 bg-card/40 p-4 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
            Agregar grupo {groups.length + 1}
          </Button>
        ) : null}
      </main>

      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <form onSubmit={handleGroupSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>
                {editingGroupId ? "Editar grupo" : "Agregar grupo"}
              </DialogTitle>
              <DialogDescription>
                Define un contenedor flexible para organizar proyectos.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label htmlFor="group-name" className="text-sm font-medium">
                Nombre del grupo
              </label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Cliente, equipo, region o area"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar grupo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent>
          <form onSubmit={handleProjectSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>
                {editingProjectId ? "Editar proyecto" : "Agregar proyecto"}
              </DialogTitle>
              <DialogDescription>
                Completa los datos y elige el grupo donde se mostrara.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Nombre del proyecto
              </label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Proyecto nuevo"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Grupo</label>
              <Select value={projectGroupId} onValueChange={setProjectGroupId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="project-cover" className="text-sm font-medium">
                Foto de portada
              </label>
              <Input
                id="project-cover"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              <div className="flex aspect-[4/3] w-36 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
                {projectCoverImage ? (
                  <img
                    src={projectCoverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProjectDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar proyecto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
