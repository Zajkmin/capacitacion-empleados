"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ItemEditModalProps {
  isOpen: boolean
  isNew: boolean
  itemType: "rule" | "exception" | "photo" | "error" | "update"
  item?: {
    id: string
    title: string
    description: string
    [key: string]: any
  }
  onSave: (item: {
    title: string
    description: string
    [key: string]: any
  }) => void
  onClose: () => void
}

export function ItemEditModal({
  isOpen,
  isNew,
  itemType,
  item,
  onSave,
  onClose,
}: ItemEditModalProps) {
  const [title, setTitle] = useState(item?.title || "")
  const [description, setDescription] = useState(item?.description || "")
  const [validUntil, setValidUntil] = useState(item?.validUntil || "Permanente")
  const [date, setDate] = useState(item?.date || new Date().toISOString().split("T")[0])
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || "")

  useEffect(() => {
    if (!isOpen) return

    setTitle(item?.title || "")
    setDescription(item?.description || "")
    setValidUntil(item?.validUntil || "Permanente")
    setDate(item?.date || new Date().toISOString().split("T")[0])
    setImageUrl(item?.imageUrl || "")
  }, [isOpen, item])

  const getItemTypeLabel = () => {
    const labels: Record<string, string> = {
      rule: "Regla",
      exception: "Excepción",
      photo: "Foto Guía",
      error: "Error Frecuente",
      update: "Actualización",
    }
    return labels[itemType] || ""
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setValidUntil("Permanente")
    setDate(new Date().toISOString().split("T")[0])
    setImageUrl("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return

    const itemData: any = {
      title: title.trim(),
      description: description.trim(),
    }

    if (itemType === "exception") {
      itemData.validUntil = validUntil.trim() || "Permanente"
    } else if (itemType === "update") {
      itemData.date = date
    } else if (itemType === "photo") {
      itemData.imageUrl =
        imageUrl.trim() ||
        `https://placehold.co/800x450?text=${encodeURIComponent(title.trim())}`
    }

    onSave(itemData)
    handleClose()
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
            {isNew ? `Nuevo ${getItemTypeLabel()}` : `Editar ${getItemTypeLabel()}`}
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
              placeholder={`Título del ${getItemTypeLabel().toLowerCase()}`}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Descripción detallada del ${getItemTypeLabel().toLowerCase()}`}
              className="w-full min-h-[120px] px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {itemType === "exception" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Válido hasta
              </label>
              <Input
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                placeholder="Ej: Permanente, 2026-12-31"
                className="w-full"
              />
            </div>
          )}

          {itemType === "update" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {itemType === "photo" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL de la imagen
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!title.trim() || !description.trim()}
            >
              {isNew ? "Crear" : "Guardar"} {getItemTypeLabel()}
            </Button>
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
