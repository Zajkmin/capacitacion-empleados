"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type SectionType } from "@/lib/roles-permissions"

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

  useEffect(() => {
    if (!isOpen) return

    setTitle(section?.title || "")
    setDescription(section?.description || "")
    setType(section?.type || "rules")
    setContent(section?.content || "")
  }, [isOpen, section])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setType("rules")
    setContent("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      content: content.trim(),
    })
    resetForm()
    onClose()
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
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            {isNew ? "Nueva Sección" : "Editar Sección"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo de sección
            </label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as SectionType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((sectionType) => (
                  <SelectItem key={sectionType.value} value={sectionType.value}>
                    {sectionType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

        <div className="flex gap-3 p-6 border-t border-border">
          <Button onClick={handleClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={!title.trim() || !description.trim()}
          >
            {isNew ? "Crear" : "Guardar"} sección
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
