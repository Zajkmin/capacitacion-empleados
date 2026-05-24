"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

interface DashboardProps {
  user: { name: string; email: string; role: string }
  onProjectSelect: (projectId: string) => void
}

interface ProjectType {
  id: string
  name: string
  bgColor: string
  textColor: string
  logoText: string
  subtitle?: string
}

// Proyectos organizados por pais
const projectsByCountry: Record<string, ProjectType[]> = {
  Paraguay: [
    {
      id: "arcor-py",
      name: "Arcor PY",
      bgColor: "bg-blue-600",
      textColor: "text-white",
      logoText: "ARCOR",
    },
    {
      id: "cervepar",
      name: "Cervepar",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "cervepar",
    },
    {
      id: "paresa-1",
      name: "Paresa",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "Coca-Cola | PARESA",
    },
    {
      id: "paresa-2",
      name: "Paresa",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "Coca-Cola | PARESA",
    },
    {
      id: "arcor-py-2",
      name: "Otro proyecto",
      bgColor: "bg-blue-600",
      textColor: "text-white",
      logoText: "ARCOR",
    },
    {
      id: "cervepar-2",
      name: "Cervepar",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "cervepar",
    },
    {
      id: "paresa-3",
      name: "Paresa",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "Coca-Cola | PARESA",
    },
    {
      id: "paresa-4",
      name: "Paresa",
      bgColor: "bg-white",
      textColor: "text-red-600",
      logoText: "Coca-Cola | PARESA",
    },
  ],
  Uruguay: [
    {
      id: "arcor-uy",
      name: "Arcor UY",
      bgColor: "bg-blue-900",
      textColor: "text-white",
      logoText: "ARCOR",
      subtitle: "Momentos Magicos",
    },
    {
      id: "sovi",
      name: "SOVI",
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-700",
      textColor: "text-white",
      logoText: "FNC",
    },
    {
      id: "porvenir",
      name: "PORVENIR",
      bgColor: "bg-red-600",
      textColor: "text-white",
      logoText: "pepsi",
    },
    {
      id: "fnc-biblia",
      name: "FNC BIBLIA",
      bgColor: "bg-blue-700",
      textColor: "text-white",
      logoText: "FNC",
    },
  ],
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectType
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex flex-col items-center w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-full aspect-[4/3] rounded-lg ${project.bgColor} flex items-center justify-center overflow-hidden relative shadow-md group-hover:shadow-lg transition-all duration-300`}
      >
        {/* Logo/Brand display */}
        <div className="flex flex-col items-center justify-center p-3">
          {project.logoText.includes("|") ? (
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold italic text-red-600">
                Coca-Cola
              </span>
              <span className="text-sm md:text-base font-semibold text-blue-800">PARESA</span>
            </div>
          ) : project.logoText === "pepsi" ? (
            <div className="text-2xl md:text-3xl font-bold text-white italic">pepsi</div>
          ) : project.logoText === "cervepar" ? (
            <div className="flex items-center gap-1">
              <span className="text-red-500 text-base md:text-lg">★</span>
              <span className="text-base md:text-lg font-bold text-red-600">cervepar</span>
            </div>
          ) : project.logoText === "ARCOR" ? (
            <div
              className={`text-xl md:text-2xl font-bold ${project.textColor} tracking-wider`}
            >
              ARCOR
            </div>
          ) : project.logoText === "FNC" ? (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 flex items-center justify-center">
              <span className="text-base md:text-lg font-bold text-blue-800">FNC</span>
            </div>
          ) : (
            <span className={`text-base md:text-lg font-bold ${project.textColor}`}>
              {project.logoText}
            </span>
          )}
          {"subtitle" in project && project.subtitle && (
            <span className="text-xs text-white/70 mt-1">{project.subtitle}</span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <span className="mt-2 text-sm text-foreground/70 group-hover:text-foreground transition-colors">
        {project.name}
      </span>
    </motion.button>
  )
}

function CountrySection({
  country,
  projects,
  onProjectSelect,
  delay = 0,
}: {
  country: string
  projects: ProjectType[]
  onProjectSelect: (projectId: string) => void
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Proyectos {country}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Glass Container */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3 md:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
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
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export function Dashboard({ user, onProjectSelect }: DashboardProps) {
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Bienvenido, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona un proyecto para comenzar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
              {user.role}
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary/25">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <CountrySection
          country="Paraguay"
          projects={projectsByCountry.Paraguay}
          onProjectSelect={onProjectSelect}
          delay={0.1}
        />

        <CountrySection
          country="Uruguay"
          projects={projectsByCountry.Uruguay}
          onProjectSelect={onProjectSelect}
          delay={0.3}
        />
      </main>
    </div>
  )
}
