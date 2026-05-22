"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Camera,
  RefreshCw,
  ChevronRight,
  XCircle,
  Lightbulb,
  FolderOpen,
} from "lucide-react"
import { VisualLearning } from "@/components/visual-learning"
import { Library } from "@/components/library"
import type { ViewType } from "@/components/dashboard-layout"

interface ProjectViewProps {
  projectId: string
  projectName?: string
  projectColor?: string
  onBack: () => void
  onNavigate: (view: ViewType) => void
}

const projectData = {
  id: "1",
  name: "Arcor PY",
  client: "Arcor Paraguay",
  description: "Documentación operativa y guías de campo para la correcta ejecución de auditorías y merchandising en puntos de venta.",
  color: "#3B82F6",
  logo: "A",
}

const mainSections = [
  {
    id: "rules",
    icon: BookOpen,
    title: "Reglas del Proyecto",
    description: "Normativas y procedimientos a seguir",
    color: "bg-primary",
  },
  {
    id: "exceptions",
    icon: AlertTriangle,
    title: "Excepciones",
    description: "Casos especiales y permisos",
    color: "bg-amber-500",
  },
  {
    id: "visual-learning",
    icon: Lightbulb,
    title: "Aprendizaje Visual",
    description: "Comparativas y ejemplos ilustrados",
    color: "bg-violet-500",
  },
  {
    id: "library",
    icon: FolderOpen,
    title: "Biblioteca",
    description: "Recursos y documentos del proyecto",
    color: "bg-slate-500",
  },
  {
    id: "photos",
    icon: Camera,
    title: "Fotos Guia",
    description: "Referencias visuales de ejecucion",
    color: "bg-emerald-500",
  },
  {
    id: "errors",
    icon: XCircle,
    title: "Errores Frecuentes",
    description: "Que evitar en campo",
    color: "bg-rose-500",
  },
  {
    id: "updates",
    icon: RefreshCw,
    title: "Actualizaciones",
    description: "Cambios y novedades recientes",
    color: "bg-cyan-500",
  },
]

export function ProjectView({ projectId, projectName, projectColor, onBack, onNavigate }: ProjectViewProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  const displayName = projectName || projectData.name
  const displayColor = projectColor || projectData.color
  
  if (activeSection) {
    if (activeSection === "visual-learning") {
      return <VisualLearning onBack={() => setActiveSection(null)} />
    }
    if (activeSection === "library") {
      return <Library onBack={() => setActiveSection(null)} />
    }

    return (
      <SectionDetail 
        sectionId={activeSection} 
        onBack={() => setActiveSection(null)}
        projectName={displayName}
      />
    )
  }
  
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
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: displayColor }}
              >
                {displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">{projectData.client}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        {/* Project Description */}
        <div className="mb-8">
          <p className="text-muted-foreground leading-relaxed">
            {projectData.description}
          </p>
        </div>
        
        {/* Section Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {mainSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="glass-card rounded-2xl p-5 text-left hover:border-primary/50 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {section.description}
              </p>
              
              <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ver mas</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}

function SectionDetail({ sectionId, onBack, projectName }: { sectionId: string; onBack: () => void; projectName: string }) {
  const section = mainSections.find(s => s.id === sectionId)
  
  if (!section) return null
  
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
            
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">
                {section.title}
              </h1>
              <p className="text-sm text-muted-foreground">{projectName}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <SectionContent sectionId={sectionId} />
      </main>
    </div>
  )
}

function SectionContent({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case "rules":
      return <RulesContent />
    case "exceptions":
      return <ExceptionsContent />
    case "photos":
      return <PhotosContent />
    case "errors":
      return <ErrorsContent />
    case "updates":
      return <UpdatesContent />
    default:
      return null
  }
}

function RulesContent() {
  const rules = [
    {
      id: "1",
      title: "Exhibicion de Productos",
      description: "Los productos deben estar alineados al frente del estante con etiquetas visibles hacia el cliente.",
    },
    {
      id: "2",
      title: "Verificacion de Precios",
      description: "Todo producto exhibido debe tener su precio visible y actualizado segun sistema.",
    },
    {
      id: "3",
      title: "Control de Vencimientos",
      description: "Productos con menos de 30 dias de vencimiento deben ser reportados inmediatamente.",
    },
    {
      id: "4",
      title: "Orden de Gondola",
      description: "Mantener el planograma establecido. No mover productos entre categorias.",
    },
  ]
  
  return (
    <div className="space-y-4">
      {rules.map((rule, index) => (
        <motion.div
          key={rule.id}
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{rule.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ExceptionsContent() {
  const exceptions = [
    {
      id: "1",
      title: "Productos en Promocion",
      description: "Pueden ubicarse fuera del planograma en islas promocionales autorizadas.",
      validUntil: "Permanente",
    },
    {
      id: "2",
      title: "Tiendas Formato Reducido",
      description: "Locales de menos de 200m2 pueden omitir secciones secundarias.",
      validUntil: "Permanente",
    },
  ]
  
  return (
    <div className="space-y-4">
      {exceptions.map((exception, index) => (
        <motion.div
          key={exception.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-amber-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{exception.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exception.description}</p>
              <span className="text-xs text-amber-500">Vigencia: {exception.validUntil}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function PhotosContent() {
  const photos = [
    { id: "1", title: "Gondola correcta", category: "Exhibicion" },
    { id: "2", title: "Etiquetado correcto", category: "Precios" },
    { id: "3", title: "Isla promocional", category: "Promociones" },
    { id: "4", title: "Cabecera de gondola", category: "Exhibicion" },
    { id: "5", title: "Refrigerador ordenado", category: "Frios" },
    { id: "6", title: "Punto de pago", category: "Checkout" },
  ]
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          className="glass-card rounded-2xl p-3 cursor-pointer hover:border-primary/50 transition-all"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center mb-3">
            <Camera className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground text-sm">{photo.title}</p>
          <p className="text-xs text-muted-foreground">{photo.category}</p>
        </motion.div>
      ))}
    </div>
  )
}

function ErrorsContent() {
  const errors = [
    {
      id: "1",
      title: "Productos sin precio",
      description: "Nunca dejar productos en exhibicion sin su etiqueta de precio visible.",
      severity: "Critico",
    },
    {
      id: "2",
      title: "Mezcla de categorias",
      description: "No ubicar productos de diferentes categorias en el mismo espacio.",
      severity: "Alto",
    },
    {
      id: "3",
      title: "Etiquetas tapadas",
      description: "Las etiquetas de precio no deben quedar ocultas por otros productos.",
      severity: "Medio",
    },
  ]
  
  return (
    <div className="space-y-4">
      {errors.map((error, index) => (
        <motion.div
          key={error.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-rose-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{error.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-500">
                  {error.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{error.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function UpdatesContent() {
  const updates = [
    {
      id: "1",
      title: "Nueva politica de exhibicion",
      description: "Se actualizo el planograma para la seccion de bebidas.",
      date: "20 May 2026",
      isNew: true,
    },
    {
      id: "2",
      title: "Cambio en horarios de visita",
      description: "Las visitas ahora deben realizarse entre 8:00 y 12:00.",
      date: "15 May 2026",
      isNew: true,
    },
    {
      id: "3",
      title: "Actualizacion de precios",
      description: "Se modificaron los precios de la linea de galletas.",
      date: "10 May 2026",
      isNew: false,
    },
  ]
  
  return (
    <div className="space-y-4">
      {updates.map((update, index) => (
        <motion.div
          key={update.id}
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{update.title}</h3>
                {update.isNew && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-500">
                    Nuevo
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{update.description}</p>
              <span className="text-xs text-muted-foreground">{update.date}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
