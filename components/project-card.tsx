"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bell, AlertCircle, CheckCircle2 } from "lucide-react"

interface ProjectCardProps {
  id: string
  name: string
  client: string
  status: "active" | "pending" | "completed"
  priority: "high" | "medium" | "low"
  progress: number
  updates: number
  color: string
  logo: string
  onClick: () => void
}

export function ProjectCard({
  name,
  client,
  status,
  priority,
  progress,
  updates,
  color,
  logo,
  onClick,
}: ProjectCardProps) {
  const statusConfig = {
    active: { label: "Activo", class: "bg-success/20 text-success" },
    pending: { label: "Pendiente", class: "bg-warning/20 text-warning" },
    completed: { label: "Completado", class: "bg-primary/20 text-primary" },
  }

  const priorityConfig = {
    high: { label: "Alta", class: "bg-destructive/20 text-destructive" },
    medium: { label: "Media", class: "bg-warning/20 text-warning" },
    low: { label: "Baja", class: "bg-muted text-muted-foreground" },
  }

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        {/* Project Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {logo}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate pr-2">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{client}</p>
            </div>
            
            {updates > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium flex-shrink-0">
                <Bell className="w-3 h-3" />
                {updates}
              </div>
            )}
          </div>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusConfig[status].class}`}>
              {statusConfig[status].label}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityConfig[priority].class}`}>
              Prioridad {priorityConfig[priority].label}
            </span>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          {/* Action hint */}
          <div className="flex items-center gap-1 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver detalles</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.button>
  )
}
