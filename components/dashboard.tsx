"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
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

interface DashboardProps {
  user: { name: string; email: string; role: string }
  onProjectSelect: (projectId: string) => void
}

interface ProjectType {
  id: string
  name: string
  bgColor: string
  textColor: string
  coverImage?: string
}

interface CountryType {
  id: string
  name: string
  projects: ProjectType[]
}

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

function createProject(number: number, name = `Proyecto ${number}`): ProjectType {
  return {
    id: `proyecto-${number}`,
    name,
    bgColor: projectColors[(number - 1) % projectColors.length],
    textColor: "text-white",
  }
}

const initialCountries: CountryType[] = [
  {
    id: "pais-1",
    name: "Pais 1",
    projects: Array.from({ length: 10 }, (_, index) => createProject(index + 1)),
  },
  {
    id: "pais-2",
    name: "Pais 2",
    projects: Array.from({ length: 5 }, (_, index) => createProject(index + 11)),
  },
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
  country,
  onClick,
}: {
  country: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="flex aspect-[4/3] w-full max-w-36 items-center justify-center justify-self-center rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary transition-colors hover:bg-primary/10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Agregar proyecto en ${country}`}
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  )
}

function CountrySection({
  country,
  projects,
  canManage,
  onProjectSelect,
  onProjectAdd,
  onCountryEdit,
  onCountryDelete,
  onProjectEdit,
  onProjectDelete,
  delay = 0,
}: {
  country: string
  projects: ProjectType[]
  canManage: boolean
  onProjectSelect: (projectId: string) => void
  onProjectAdd: () => void
  onCountryEdit: () => void
  onCountryDelete: () => void
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
          Proyectos {country}
        </h2>
        <div className="h-px flex-1 bg-border" />
        {canManage ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onCountryEdit}
              aria-label={`Editar ${country}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onCountryDelete}
              aria-label={`Eliminar ${country}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onProjectAdd}
              aria-label={`Agregar proyecto en ${country}`}
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
            <AddProjectButton country={country} onClick={onProjectAdd} />
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}

export function Dashboard({ user, onProjectSelect }: DashboardProps) {
  const [countries, setCountries] = useState<CountryType[]>(initialCountries)
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [countryName, setCountryName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectCountryId, setProjectCountryId] = useState(initialCountries[0].id)
  const [projectCoverImage, setProjectCoverImage] = useState<string | undefined>()
  const canManageDashboard = user.role === "admin"

  const getNextProjectNumber = (currentCountries: CountryType[]) =>
    currentCountries.reduce(
      (total, country) => total + country.projects.length,
      0,
    ) + 1

  const openProjectForm = (countryId: string) => {
    if (!canManageDashboard) return

    const nextProjectNumber = getNextProjectNumber(countries)

    setEditingProjectId(null)
    setProjectName(`Proyecto ${nextProjectNumber}`)
    setProjectCountryId(countryId)
    setProjectCoverImage(undefined)
    setIsProjectDialogOpen(true)
  }

  const openProjectEditForm = (countryId: string, project: ProjectType) => {
    if (!canManageDashboard) return

    setEditingProjectId(project.id)
    setProjectName(project.name)
    setProjectCountryId(countryId)
    setProjectCoverImage(project.coverImage)
    setIsProjectDialogOpen(true)
  }

  const openCountryForm = () => {
    if (!canManageDashboard) return

    setEditingCountryId(null)
    setCountryName(`Pais ${countries.length + 1}`)
    setIsCountryDialogOpen(true)
  }

  const openCountryEditForm = (country: CountryType) => {
    if (!canManageDashboard) return

    setEditingCountryId(country.id)
    setCountryName(country.name)
    setIsCountryDialogOpen(true)
  }

  const handleCountrySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManageDashboard) return

    const trimmedName = countryName.trim()
    if (!trimmedName) return

    if (editingCountryId) {
      setCountries((currentCountries) =>
        currentCountries.map((country) =>
          country.id === editingCountryId
            ? { ...country, name: trimmedName }
            : country,
        ),
      )
      setIsCountryDialogOpen(false)
      return
    }

    setCountries((currentCountries) => {
      const nextCountryNumber = currentCountries.length + 1

      return [
        ...currentCountries,
        {
          id: `pais-${nextCountryNumber}`,
          name: trimmedName,
          projects: [],
        },
      ]
    })
    setIsCountryDialogOpen(false)
  }

  const handleProjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManageDashboard) return

    const trimmedName = projectName.trim()
    if (!trimmedName || !projectCountryId) return

    if (editingProjectId) {
      setCountries((currentCountries) => {
        const projectToEdit = currentCountries
          .flatMap((country) => country.projects)
          .find((project) => project.id === editingProjectId)

        if (!projectToEdit) {
          return currentCountries
        }

        const updatedProject = {
          ...projectToEdit,
          name: trimmedName,
          coverImage: projectCoverImage,
        }

        return currentCountries.map((country) => {
          const filteredProjects = country.projects.filter(
            (project) => project.id !== editingProjectId,
          )

          if (country.id !== projectCountryId) {
            return { ...country, projects: filteredProjects }
          }

          return {
            ...country,
            projects: [
              ...filteredProjects,
              updatedProject,
            ],
          }
        })
      })
      setIsProjectDialogOpen(false)
      return
    }

    setCountries((currentCountries) => {
      const newProject = {
        ...createProject(getNextProjectNumber(currentCountries), trimmedName),
        coverImage: projectCoverImage,
      }

      return currentCountries.map((country) =>
        country.id === projectCountryId
          ? { ...country, projects: [...country.projects, newProject] }
          : country,
      )
    })
    setIsProjectDialogOpen(false)
  }

  const handleCountryDelete = (countryId: string) => {
    if (!canManageDashboard) return

    setCountries((currentCountries) =>
      currentCountries.filter((country) => country.id !== countryId),
    )
  }

  const handleProjectDelete = (countryId: string, projectId: string) => {
    if (!canManageDashboard) return

    setCountries((currentCountries) =>
      currentCountries.map((country) =>
        country.id === countryId
          ? {
              ...country,
              projects: country.projects.filter(
                (project) => project.id !== projectId,
              ),
            }
          : country,
      ),
    )
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
        {countries.map((country, index) => (
          <CountrySection
            key={country.id}
            country={country.name}
            projects={country.projects}
            canManage={canManageDashboard}
            onProjectSelect={onProjectSelect}
            onProjectAdd={() => openProjectForm(country.id)}
            onCountryEdit={() => openCountryEditForm(country)}
            onCountryDelete={() => handleCountryDelete(country.id)}
            onProjectEdit={(project) => openProjectEditForm(country.id, project)}
            onProjectDelete={(projectId) =>
              handleProjectDelete(country.id, projectId)
            }
            delay={0.1 + index * 0.2}
          />
        ))}

        {canManageDashboard ? (
          <Button
            type="button"
            variant="outline"
            onClick={openCountryForm}
            className="flex w-full border-dashed border-primary/40 bg-card/40 p-4 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
            Agregar Pais {countries.length + 1}
          </Button>
        ) : null}
      </main>

      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCountrySubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>
                {editingCountryId ? "Editar pais" : "Agregar pais"}
              </DialogTitle>
              <DialogDescription>
                Define el nombre del nuevo contenedor de proyectos.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label htmlFor="country-name" className="text-sm font-medium">
                Nombre del pais
              </label>
              <Input
                id="country-name"
                value={countryName}
                onChange={(event) => setCountryName(event.target.value)}
                placeholder="Pais 3"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCountryDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar pais</Button>
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
                Completa los datos y elige el pais donde se mostrara.
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
              <label className="text-sm font-medium">Pais</label>
              <Select value={projectCountryId} onValueChange={setProjectCountryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un pais" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
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
