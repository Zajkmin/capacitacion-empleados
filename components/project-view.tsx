"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  FileImage,
  Library,
  RefreshCw,
  CheckSquare,
  HelpCircle,
  Target,
  Clock,
  Users,
  BarChart3,
  ChevronRight,
  Play,
  FileText,
  Sparkles,
} from "lucide-react"
import type { ViewType } from "@/components/dashboard-layout"

interface ProjectViewProps {
  projectId: string
  onBack: () => void
  onNavigate: (view: ViewType) => void
}

const projectData = {
  id: "1",
  name: "Auditoría Supermercados Metro",
  client: "Metro Corp",
  description: "Auditoría de góndolas, precios y exhibición para la cadena de supermercados Metro en toda la zona metropolitana.",
  color: "#3B82F6",
  logo: "M",
  progress: 75,
  team: 12,
  deadline: "15 Jun 2026",
}

const sections = [
  { 
    id: "overview", 
    icon: Target, 
    label: "Resumen General", 
    description: "Vista general del proyecto",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  { 
    id: "rules", 
    icon: BookOpen, 
    label: "Reglas", 
    description: "Normativas y procedimientos",
    color: "text-accent",
    bgColor: "bg-accent/10",
    count: 24
  },
  { 
    id: "exceptions", 
    icon: AlertTriangle, 
    label: "Excepciones", 
    description: "Casos especiales permitidos",
    color: "text-warning",
    bgColor: "bg-warning/10",
    count: 8
  },
  { 
    id: "cases", 
    icon: Sparkles, 
    label: "Casos Reales", 
    description: "Ejemplos prácticos",
    color: "text-success",
    bgColor: "bg-success/10",
    count: 15
  },
  { 
    id: "errors", 
    icon: AlertTriangle, 
    label: "Errores Frecuentes", 
    description: "Qué evitar en campo",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    count: 12
  },
  { 
    id: "photos", 
    icon: FileImage, 
    label: "Fotos Guía", 
    description: "Referencias visuales",
    color: "text-primary",
    bgColor: "bg-primary/10",
    count: 45
  },
  { 
    id: "library", 
    icon: Library, 
    label: "Biblioteca", 
    description: "Documentos y recursos",
    color: "text-accent",
    bgColor: "bg-accent/10",
    count: 18
  },
  { 
    id: "updates", 
    icon: RefreshCw, 
    label: "Actualizaciones", 
    description: "Cambios recientes",
    color: "text-warning",
    bgColor: "bg-warning/10",
    count: 3,
    highlight: true
  },
  { 
    id: "checklist", 
    icon: CheckSquare, 
    label: "Checklist", 
    description: "Lista de verificación",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  { 
    id: "faq", 
    icon: HelpCircle, 
    label: "FAQ", 
    description: "Preguntas frecuentes",
    color: "text-muted-foreground",
    bgColor: "bg-muted/10",
    count: 20
  },
]

export function ProjectView({ projectId, onBack, onNavigate }: ProjectViewProps) {
  const [activeSection, setActiveSection] = useState("overview")
  
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
                style={{ backgroundColor: projectData.color }}
              >
                {projectData.logo}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {projectData.name}
                </h1>
                <p className="text-sm text-muted-foreground">{projectData.client}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Section Nav */}
        <div className="lg:hidden overflow-x-auto pb-3 px-4">
          <div className="flex gap-2">
            {sections.slice(0, 6).map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Desktop Section Nav */}
        <aside className="hidden lg:block w-64 flex-shrink-0 p-6 border-r border-border">
          <nav className="space-y-1 sticky top-32">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <section.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm font-medium">{section.label}</span>
                {section.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    activeSection === section.id
                      ? "bg-white/20"
                      : section.highlight
                        ? "bg-warning/20 text-warning"
                        : "bg-muted"
                  }`}>
                    {section.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <ProjectSectionContent 
            section={activeSection} 
            projectData={projectData}
            onNavigate={onNavigate}
          />
        </main>
      </div>
    </div>
  )
}

function ProjectSectionContent({ 
  section, 
  projectData,
  onNavigate 
}: { 
  section: string
  projectData: typeof projectData
  onNavigate: (view: ViewType) => void
}) {
  switch (section) {
    case "overview":
      return <OverviewSection projectData={projectData} onNavigate={onNavigate} />
    case "rules":
      return <RulesSection />
    case "exceptions":
      return <ExceptionsSection />
    case "cases":
      return <CasesSection onNavigate={onNavigate} />
    case "errors":
      return <ErrorsSection />
    case "photos":
      return <PhotosSection />
    default:
      return <OverviewSection projectData={projectData} onNavigate={onNavigate} />
  }
}

function OverviewSection({ 
  projectData,
  onNavigate
}: { 
  projectData: typeof projectData
  onNavigate: (view: ViewType) => void
}) {
  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Progreso", value: `${projectData.progress}%`, icon: BarChart3 },
          { label: "Equipo", value: `${projectData.team} personas`, icon: Users },
          { label: "Fecha Límite", value: projectData.deadline, icon: Clock },
          { label: "Módulos", value: "10 activos", icon: Target },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <stat.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Description */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Descripción del Proyecto</h2>
        <p className="text-muted-foreground leading-relaxed">{projectData.description}</p>
      </div>
      
      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Continuar Capacitación", icon: Play, color: "bg-primary", onClick: () => onNavigate("visual-learning") },
            { label: "Ver Casos Prácticos", icon: Sparkles, color: "bg-accent", onClick: () => onNavigate("interactive-cases") },
            { label: "Revisar Actualizaciones", icon: RefreshCw, color: "bg-warning", onClick: () => onNavigate("updates") },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-foreground">{action.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RulesSection() {
  const rules = [
    {
      id: "1",
      title: "Exhibición de Productos",
      description: "Los productos deben estar alineados al frente del estante con etiquetas visibles",
      category: "Exhibición",
    },
    {
      id: "2",
      title: "Verificación de Precios",
      description: "Todo producto exhibido debe tener precio visible y actualizado",
      category: "Precios",
    },
    {
      id: "3",
      title: "Control de Vencimientos",
      description: "Productos con menos de 30 días de vencimiento deben ser reportados",
      category: "Vencimientos",
    },
  ]
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Reglas del Proyecto</h2>
      {rules.map((rule, index) => (
        <motion.div
          key={rule.id}
          className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{rule.title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs">
                  {rule.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rule.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ExceptionsSection() {
  const exceptions = [
    {
      id: "1",
      title: "Productos en Promoción",
      description: "Pueden ubicarse fuera del planograma en islas promocionales autorizadas",
      validUntil: "31 Dic 2026",
    },
    {
      id: "2",
      title: "Zona Norte - Formato Reducido",
      description: "Tiendas de menos de 500m² pueden omitir la sección de electrodomésticos",
      validUntil: "Permanente",
    },
  ]
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Excepciones Permitidas</h2>
      {exceptions.map((exception, index) => (
        <motion.div
          key={exception.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{exception.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{exception.description}</p>
              <span className="text-xs text-warning">Válido hasta: {exception.validUntil}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CasesSection({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Casos Reales</h2>
        <button 
          onClick={() => onNavigate("interactive-cases")}
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Ver simulador <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: "Góndola correctamente organizada", type: "correct" as const },
          { title: "Error en exhibición de precios", type: "incorrect" as const },
          { title: "Promoción bien ejecutada", type: "correct" as const },
          { title: "Producto vencido en estante", type: "incorrect" as const },
        ].map((case_, index) => (
          <motion.div
            key={index}
            className={`rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
              case_.type === "correct" ? "state-correct" : "state-incorrect"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="aspect-video rounded-xl bg-secondary mb-3 flex items-center justify-center">
              <FileImage className={`w-12 h-12 ${
                case_.type === "correct" ? "text-success" : "text-destructive"
              }`} />
            </div>
            <p className="font-medium text-foreground">{case_.title}</p>
            <span className={`text-xs ${
              case_.type === "correct" ? "text-success" : "text-destructive"
            }`}>
              {case_.type === "correct" ? "✓ Correcto" : "✗ Incorrecto"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ErrorsSection() {
  const errors = [
    {
      id: "1",
      title: "Productos sin precio visible",
      frequency: "Alta",
      impact: "Crítico",
    },
    {
      id: "2",
      title: "Etiquetas mal colocadas",
      frequency: "Media",
      impact: "Moderado",
    },
    {
      id: "3",
      title: "Productos fuera de planograma",
      frequency: "Alta",
      impact: "Alto",
    },
  ]
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Errores Frecuentes</h2>
      {errors.map((error, index) => (
        <motion.div
          key={error.id}
          className="glass-card rounded-2xl p-5 border-l-4 border-destructive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{error.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-warning/20 text-warning">
                    Frecuencia: {error.frequency}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-destructive/20 text-destructive">
                    Impacto: {error.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function PhotosSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Fotos Guía</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="glass-card rounded-2xl p-3 cursor-pointer hover:shadow-lg transition-all"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center mb-2">
              <FileImage className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              Foto referencia {index + 1}
            </p>
            <p className="text-xs text-muted-foreground">Góndola principal</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
