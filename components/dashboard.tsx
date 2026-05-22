"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Users,
  FileText,
  Bell,
} from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { StatsCard } from "@/components/stats-card"
import { QuickChecklist } from "@/components/quick-checklist"

interface DashboardProps {
  user: { name: string; email: string; role: string }
  onProjectSelect: (projectId: string) => void
}

const projects = [
  {
    id: "1",
    name: "Auditoría Supermercados Metro",
    client: "Metro Corp",
    status: "active" as const,
    priority: "high" as const,
    progress: 75,
    updates: 3,
    color: "#3B82F6",
    logo: "M",
  },
  {
    id: "2",
    name: "Relevamiento Tiendas Express",
    client: "Grupo Retail",
    status: "active" as const,
    priority: "medium" as const,
    progress: 45,
    updates: 1,
    color: "#06B6D4",
    logo: "T",
  },
  {
    id: "3",
    name: "Control de Precios Farmacias",
    client: "Farmacia Total",
    status: "pending" as const,
    priority: "low" as const,
    progress: 20,
    updates: 0,
    color: "#10B981",
    logo: "F",
  },
  {
    id: "4",
    name: "Inventario Electro Hogar",
    client: "ElectroMax",
    status: "completed" as const,
    priority: "medium" as const,
    progress: 100,
    updates: 0,
    color: "#F59E0B",
    logo: "E",
  },
]

const stats = [
  {
    label: "Proyectos Activos",
    value: "4",
    change: "+2 este mes",
    trend: "up" as const,
    icon: Target,
  },
  {
    label: "Tareas Completadas",
    value: "127",
    change: "85% de avance",
    trend: "up" as const,
    icon: CheckCircle2,
  },
  {
    label: "Alertas Pendientes",
    value: "5",
    change: "3 urgentes",
    trend: "down" as const,
    icon: AlertTriangle,
  },
  {
    label: "Horas de Capacitación",
    value: "24h",
    change: "+8h esta semana",
    trend: "up" as const,
    icon: Clock,
  },
]

const recentUpdates = [
  {
    id: "1",
    title: "Nueva regla de exhibición agregada",
    project: "Auditoría Supermercados Metro",
    time: "Hace 2 horas",
    type: "rule" as const,
  },
  {
    id: "2",
    title: "Excepción aprobada para zona norte",
    project: "Relevamiento Tiendas Express",
    time: "Hace 5 horas",
    type: "exception" as const,
  },
  {
    id: "3",
    title: "Nuevo caso de estudio disponible",
    project: "Control de Precios Farmacias",
    time: "Hace 1 día",
    type: "case" as const,
  },
]

export function Dashboard({ user, onProjectSelect }: DashboardProps) {
  const firstName = user.name.split(" ")[0]
  
  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">
                Hola, {firstName} <Sparkles className="inline-block w-6 h-6 lg:w-8 lg:h-8 text-warning" />
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Aquí está el resumen de tus operaciones de hoy
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button className="relative p-3 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </header>
      
      {/* Stats Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects Section */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Proyectos Asignados
            </h2>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <ProjectCard
                  {...project}
                  onClick={() => onProjectSelect(project.id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Quick Checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <QuickChecklist />
          </motion.div>
          
          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Actualizaciones Recientes
              </h3>
              
              <div className="space-y-3">
                {recentUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        update.type === "rule" ? "bg-primary/20 text-primary" :
                        update.type === "exception" ? "bg-warning/20 text-warning" :
                        "bg-accent/20 text-accent"
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {update.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {update.project}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2.5 text-sm text-primary hover:bg-primary/10 rounded-xl transition-colors">
                Ver todas las actualizaciones
              </button>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
