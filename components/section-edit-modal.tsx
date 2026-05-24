"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type SectionType } from "@/lib/roles-permissions"
import { useState } from "react"

interface SectionEditModalProps {
  isOpen: boolean
  isNew: boolean
  section?: {
    id: string
    title: string
    description: string
    type: SectionType
    content?: string
  }
  onSave: (section: {
    title: string
    description: string
    type: SectionType
    content?: string
  }) => void
  onClose: () => void
}

const sectionTypes: { value: SectionType; label: string }[] = [
  { value: "rules", label: "Reglas del Proyecto" },
  { value: "exceptions", label: "Excepciones" },
  { value: "visual-learning", label: "Aprendizaje Visual" },
  { value: "library", label: "Biblioteca" },
  { value: "photos", label: "Fotos Guía" },
  { value: "errors", label: "Errores Frecuentes" },
  { value: "updates", label: "Actualizaciones" },
]

export function SectionEditModal({
  isOpen,
  isNew,
  section,
  onSave,
  onClose,
}: SectionEditModalProps) {
  const [title, setTitle] = useState(section?.title || "")
  const [description, setDescription] = useState(section?.description || "")
  const [type, setType] = useState<SectionType>(section?.type || "rules")
  const [content, setContent] = useState(section?.content || "")

  const handleSave = () => {
    onSave({ title, description, type, content })
    setTitle("")
    setDescription("")
    setType("rules")
    setContent("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            {isNew ? "Nueva Sección" : "Editar Sección"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la sección"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve de la sección"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contenido
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenido completo de la sección"
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isNew ? "Crear" : "Guardar"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
