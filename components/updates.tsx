"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Bell,
  BookOpen,
  AlertTriangle,
  FileImage,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react"

interface UpdatesProps {
  onBack: () => void
}

const updates = [
  {
    id: "1",
    title: "Nueva regla de exhibición para productos lácteos",
    description: "Se ha agregado una nueva normativa para la colocación de productos refrigerados en góndola principal.",
    project: "Auditoría Supermercados Metro",
    type: "rule" as const,
    priority: "high" as const,
    date: "Hace 2 horas",
    read: false,
  },
  {
    id: "2",
    title: "Excepción aprobada para zona norte",
    description: "Las tiendas de formato reducido ahora pueden omitir la sección de electrodomésticos grandes.",
    project: "Relevamiento Tiendas Express",
    type: "exception" as const,
    priority: "medium" as const,
    date: "Hace 5 horas",
    read: false,
  },
  {
    id: "3",
    title: "Nuevas fotos de referencia disponibles",
    description: "Se han actualizado las imágenes de referencia para el correcto armado de islas promocionales.",
    project: "Control de Precios Farmacias",
    type: "photo" as const,
    priority: "low" as const,
    date: "Hace 1 día",
    read: true,
  },
  {
    id: "4",
    title: "Caso de estudio: Error común en etiquetado",
    description: "Nuevo caso práctico sobre errores frecuentes en la colocación de etiquetas de precio.",
    project: "Auditoría Supermercados Metro",
    type: "case" as const,
    priority: "medium" as const,
    date: "Hace 2 días",
    read: true,
  },
  {
    id: "5",
    title: "Actualización de checklist operativo",
    description: "Se han agregado 3 nuevos puntos de verificación al checklist diario de auditoría.",
    project: "Inventario Electro Hogar",
    type: "checklist" as const,
    priority: "high" as const,
    date: "Hace 3 días",
    read: true,
  },
]

const typeConfig = {
  rule: { icon: BookOpen, label: "Regla", color: "text-accent bg-accent/20" },
  exception: { icon: AlertTriangle, label: "Excepción", color: "text-warning bg-warning/20" },
  photo: { icon: FileImage, label: "Foto", color: "text-primary bg-primary/20" },
  case: { icon: CheckCircle2, label: "Caso", color: "text-success bg-success/20" },
  checklist: { icon: CheckCircle2, label: "Checklist", color: "text-accent bg-accent/20" },
}

const priorityConfig = {
  high: { label: "Alta", color: "bg-destructive/20 text-destructive" },
  medium: { label: "Media", color: "bg-warning/20 text-warning" },
  low: { label: "Baja", color: "bg-muted text-muted-foreground" },
}

const filters = ["Todas", "No leídas", "Reglas", "Excepciones", "Casos"]

export function Updates({ onBack }: UpdatesProps) {
  const [selectedFilter, setSelectedFilter] = useState("Todas")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const unreadCount = updates.filter(u => !u.read).length
  
  const filteredUpdates = updates.filter(update => {
    switch (selectedFilter) {
      case "No leídas":
        return !update.read
      case "Reglas":
        return update.type === "rule"
      case "Excepciones":
        return update.type === "exception"
      case "Casos":
        return update.type === "case"
      default:
        return true
    }
  })
  
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Actualizaciones
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                    {unreadCount} nuevas
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                Cambios recientes en tus proyectos
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 lg:px-8 pb-4 overflow-x-auto">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          {filteredUpdates.map((update, index) => {
            const typeInfo = typeConfig[update.type]
            const priorityInfo = priorityConfig[update.priority]
            const Icon = typeInfo.icon
            const isExpanded = expandedId === update.id
            
            return (
              <motion.div
                key={update.id}
                className={`glass-card rounded-2xl overflow-hidden transition-all ${
                  !update.read ? "border-l-4 border-l-primary" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : update.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold ${!update.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {update.title}
                        </h3>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`} />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {update.project}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityInfo.color}`}>
                          Prioridad {priorityInfo.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {update.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5"
                  >
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {update.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                          Ver detalles
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                          Marcar como leído
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {filteredUpdates.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No hay actualizaciones en esta categoría</p>
          </div>
        )}
      </main>
    </div>
  )
}
