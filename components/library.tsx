"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Search,
  FileText,
  FileImage,
  Video,
  Download,
  Filter,
  Grid,
  List,
  FolderOpen,
  Clock,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface LibraryProps {
  onBack: () => void
}

const categories = [
  { id: "all", label: "Todos", count: 45 },
  { id: "documents", label: "Documentos", count: 18 },
  { id: "images", label: "Imágenes", count: 15 },
  { id: "videos", label: "Videos", count: 8 },
  { id: "guides", label: "Guías", count: 4 },
]

const resources = [
  {
    id: "1",
    title: "Manual de Auditoría 2026",
    type: "document",
    category: "guides",
    size: "2.4 MB",
    date: "15 May 2026",
    starred: true,
  },
  {
    id: "2",
    title: "Fotos de Referencia - Góndolas",
    type: "image",
    category: "images",
    size: "45 archivos",
    date: "12 May 2026",
    starred: false,
  },
  {
    id: "3",
    title: "Video: Técnicas de Relevamiento",
    type: "video",
    category: "videos",
    size: "125 MB",
    date: "10 May 2026",
    starred: true,
  },
  {
    id: "4",
    title: "Plantilla de Reporte Semanal",
    type: "document",
    category: "documents",
    size: "450 KB",
    date: "8 May 2026",
    starred: false,
  },
  {
    id: "5",
    title: "Guía de Excepciones Permitidas",
    type: "document",
    category: "guides",
    size: "1.2 MB",
    date: "5 May 2026",
    starred: true,
  },
  {
    id: "6",
    title: "Video: Uso de la App Móvil",
    type: "video",
    category: "videos",
    size: "85 MB",
    date: "1 May 2026",
    starred: false,
  },
]

const typeIcons = {
  document: FileText,
  image: FileImage,
  video: Video,
}

const typeColors = {
  document: "text-primary bg-primary/20",
  image: "text-accent bg-accent/20",
  video: "text-warning bg-warning/20",
}

export function Library({ onBack }: LibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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
                <FolderOpen className="w-5 h-5 text-primary" />
                Biblioteca
              </h1>
              <p className="text-sm text-muted-foreground">
                Documentos y recursos
              </p>
            </div>
          </div>
          
          {/* Search & Filters */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border"
              />
            </div>
            <div className="flex items-center bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="px-4 lg:px-8 pb-4 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {category.label}
                <span className="ml-2 opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="p-4 lg:p-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, index) => {
              const Icon = typeIcons[resource.type as keyof typeof typeIcons]
              const colorClass = typeColors[resource.type as keyof typeof typeColors]
              
              return (
                <motion.div
                  key={resource.id}
                  className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.starred && (
                        <Star className="w-4 h-4 text-warning fill-warning" />
                      )}
                      <button className="p-2 rounded-lg bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{resource.size}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{resource.date}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResources.map((resource, index) => {
              const Icon = typeIcons[resource.type as keyof typeof typeIcons]
              const colorClass = typeColors[resource.type as keyof typeof typeColors]
              
              return (
                <motion.div
                  key={resource.id}
                  className="glass-card rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.size} • {resource.date}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {resource.starred && (
                      <Star className="w-4 h-4 text-warning fill-warning" />
                    )}
                    <button className="p-2 rounded-lg bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron recursos</p>
          </div>
        )}
      </main>
    </div>
  )
}
