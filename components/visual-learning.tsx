"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConfirmAction } from "@/components/confirm-action-dialog"

interface VisualLearningProps {
  onBack: () => void
  canAdd?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

interface Comparison {
  id: string
  title: string
  description: string
  correct: {
    label: string
    points: string[]
    imageUrl?: string
  }
  incorrect: {
    label: string
    points: string[]
    imageUrl?: string
  }
  tip: string
}

const initialComparisons: Comparison[] = [
  {
    id: "1",
    title: "Exhibición de Productos en Góndola",
    description: "Aprende a identificar una exhibición correcta vs incorrecta",
    correct: {
      label: "Correcto",
      points: [
        "Productos alineados al frente",
        "Etiquetas de precio visibles",
        "Sin espacios vacíos",
        "Facing consistente",
      ],
    },
    incorrect: {
      label: "Incorrecto",
      points: [
        "Productos desordenados",
        "Precios ocultos o faltantes",
        "Huecos en el estante",
        "Facing irregular",
      ],
    },
    tip: "Siempre verifica que el cliente pueda ver el precio sin mover el producto",
  },
  {
    id: "2",
    title: "Colocación de Material POP",
    description: "Ubicación correcta de material promocional",
    correct: {
      label: "Correcto",
      points: [
        "A la altura de los ojos",
        "Sin obstruir productos",
        "Información legible",
        "Fecha vigente",
      ],
    },
    incorrect: {
      label: "Incorrecto",
      points: [
        "Muy alto o muy bajo",
        "Tapando productos",
        "Texto ilegible",
        "Promoción vencida",
      ],
    },
    tip: "El material POP debe complementar la exhibición, no competir con ella",
  },
  {
    id: "3",
    title: "Control de Fechas de Vencimiento",
    description: "Identificación de productos próximos a vencer",
    correct: {
      label: "Correcto",
      points: [
        "Rotación FIFO aplicada",
        "Productos más antiguos adelante",
        "Fechas claramente visibles",
        "Stock ordenado por fecha",
      ],
    },
    incorrect: {
      label: "Incorrecto",
      points: [
        "Productos nuevos adelante",
        "Fechas ocultas",
        "Sin rotación de inventario",
        "Productos vencidos en exhibición",
      ],
    },
    tip: "Revisa siempre la segunda fila de productos, ahí suelen estar los más antiguos",
  },
]

export function VisualLearning({
  onBack,
  canAdd,
  canEdit,
  canDelete,
}: VisualLearningProps) {
  const [comparisons, setComparisons] = useState(initialComparisons)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingComparison, setEditingComparison] = useState<Comparison | null>(null)
  const { confirmAction, confirmDialog } = useConfirmAction()

  const currentComparison = comparisons[currentIndex]

  const handleSaveComparison = (comparisonData: Omit<Comparison, "id">) => {
    if (editingComparison) {
      setComparisons((items) =>
        items.map((item) =>
          item.id === editingComparison.id ? { ...item, ...comparisonData } : item
        )
      )
    } else {
      setComparisons((items) => [
        ...items,
        { id: Date.now().toString(), ...comparisonData },
      ])
      setCurrentIndex(comparisons.length)
    }
    setShowModal(false)
    setEditingComparison(null)
    setShowTip(false)
  }

  const handleDeleteCurrent = async () => {
    if (!currentComparison) return
    const confirmed = await confirmAction({
      title: "Eliminar comparativa",
      description: `Esta accion eliminara "${currentComparison.title}".`,
      confirmLabel: "Eliminar",
    })
    if (!confirmed) return

    const nextComparisons = comparisons.filter((item) => item.id !== currentComparison.id)
    setComparisons(nextComparisons)
    setCurrentIndex((index) => Math.max(0, Math.min(index, nextComparisons.length - 1)))
    setShowTip(false)
  }

  const goNext = () => {
    if (currentIndex < comparisons.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowTip(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowTip(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground">
                Aprendizaje Visual
              </h1>
              <p className="text-sm text-muted-foreground">
                Comparativas lado a lado
              </p>
            </div>

            {(canAdd || canEdit || canDelete) && (
              <div className="flex items-center gap-2">
                {canAdd && (
                  <button
                    onClick={() => {
                      setEditingComparison(null)
                      setShowModal(true)
                    }}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    title="Agregar"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
                {currentComparison && canEdit && (
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAction({
                        title: "Editar comparativa",
                        description: `Vas a modificar "${currentComparison.title}".`,
                        confirmLabel: "Editar",
                      })
                      if (!confirmed) return
                      setEditingComparison(currentComparison)
                      setShowModal(true)
                    }}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                {currentComparison && canDelete && (
                  <button
                    onClick={handleDeleteCurrent}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {comparisons.length ? currentIndex + 1 : 0}
              </span>
              <span>/</span>
              <span>{comparisons.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8">
        {!currentComparison ? (
          <div className="max-w-3xl mx-auto text-center py-16">
            <Lightbulb className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {canAdd
                ? "No hay comparativas. Agrega una nueva para empezar."
                : "No hay comparativas disponibles."}
            </p>
          </div>
        ) : (
          <motion.div
            key={currentComparison.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {currentComparison.title}
              </h2>
              <p className="text-muted-foreground">
                {currentComparison.description}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <ComparisonPanel
                variant="correct"
                label={currentComparison.correct.label}
                points={currentComparison.correct.points}
                imageUrl={currentComparison.correct.imageUrl}
              />
              <ComparisonPanel
                variant="incorrect"
                label={currentComparison.incorrect.label}
                points={currentComparison.incorrect.points}
                imageUrl={currentComparison.incorrect.imageUrl}
              />
            </div>

            <motion.div
              className="glass-card rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setShowTip(!showTip)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-warning" />
                  </div>
                  <span className="font-semibold text-foreground">
                    Tip Profesional
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    showTip ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showTip && (
                <motion.p
                  className="mt-4 pl-13 text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {currentComparison.tip}
                </motion.p>
              )}
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-2">
                {comparisons.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setShowTip(false)
                    }}
                    aria-label={`Ir a comparativa ${index + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={currentIndex === comparisons.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <ComparisonEditModal
        isOpen={showModal}
        isNew={!editingComparison}
        comparison={editingComparison}
        onSave={handleSaveComparison}
        onClose={() => {
          setShowModal(false)
          setEditingComparison(null)
        }}
      />
      {confirmDialog}
    </div>
  )
}

function ComparisonPanel({
  variant,
  label,
  points,
  imageUrl,
}: {
  variant: "correct" | "incorrect"
  label: string
  points: string[]
  imageUrl?: string
}) {
  const isCorrect = variant === "correct"
  const Icon = isCorrect ? CheckCircle2 : XCircle
  const panelClass = isCorrect ? "state-correct" : "state-incorrect"
  const toneClass = isCorrect ? "text-success" : "text-destructive"
  const bgClass = isCorrect ? "bg-success/20" : "bg-destructive/20"
  const imageClass = isCorrect
    ? "bg-success/10 border-success/30"
    : "bg-destructive/10 border-destructive/30"

  return (
    <motion.div
      className={`${panelClass} rounded-2xl p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isCorrect ? 0.1 : 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${toneClass}`} />
        </div>
        <h3 className={`text-xl font-bold ${toneClass}`}>{label}</h3>
      </div>

      <div className={`aspect-video rounded-xl ${imageClass} border flex items-center justify-center mb-4 relative group cursor-pointer`}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center">
            <Eye className={`w-12 h-12 ${toneClass} opacity-50 mx-auto mb-2`} />
            <p className={`text-sm ${toneClass} opacity-70`}>Imagen de referencia</p>
          </div>
        )}
        <button className={`absolute top-3 right-3 p-2 rounded-lg ${bgClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <ZoomIn className={`w-4 h-4 ${toneClass}`} />
        </button>
      </div>

      <ul className="space-y-2">
        {points.map((point, index) => (
          <motion.li
            key={`${point}-${index}`}
            className="flex items-center gap-2 text-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Icon className={`w-4 h-4 ${toneClass} flex-shrink-0`} />
            <span className="text-sm">{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function ComparisonEditModal({
  isOpen,
  isNew,
  comparison,
  onSave,
  onClose,
}: {
  isOpen: boolean
  isNew: boolean
  comparison: Comparison | null
  onSave: (comparison: Omit<Comparison, "id">) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [correctPoints, setCorrectPoints] = useState("")
  const [incorrectPoints, setIncorrectPoints] = useState("")
  const [correctImageUrl, setCorrectImageUrl] = useState("")
  const [incorrectImageUrl, setIncorrectImageUrl] = useState("")
  const [tip, setTip] = useState("")

  useEffect(() => {
    if (!isOpen) return

    setTitle(comparison?.title || "")
    setDescription(comparison?.description || "")
    setCorrectPoints(comparison?.correct.points.join("\n") || "")
    setIncorrectPoints(comparison?.incorrect.points.join("\n") || "")
    setCorrectImageUrl(comparison?.correct.imageUrl || "")
    setIncorrectImageUrl(comparison?.incorrect.imageUrl || "")
    setTip(comparison?.tip || "")
  }, [isOpen, comparison])

  const handleImageUpload = (
    file: File | undefined,
    onLoad: (imageUrl: string) => void,
  ) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoad(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      correct: {
        label: "Correcto",
        imageUrl: correctImageUrl.trim() || undefined,
        points: correctPoints
          .split("\n")
          .map((point) => point.trim())
          .filter(Boolean),
      },
      incorrect: {
        label: "Incorrecto",
        imageUrl: incorrectImageUrl.trim() || undefined,
        points: incorrectPoints
          .split("\n")
          .map((point) => point.trim())
          .filter(Boolean),
      },
      tip: tip.trim(),
    })
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
            {isNew ? "Nueva comparativa" : "Editar comparativa"}
          </h2>
          <button
            type="button"
            onClick={onClose}
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
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Puntos correctos
              </label>
              <textarea
                value={correctPoints}
                onChange={(event) => setCorrectPoints(event.target.value)}
                rows={5}
                placeholder="Un punto por línea"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Puntos incorrectos
              </label>
              <textarea
                value={incorrectPoints}
                onChange={(event) => setIncorrectPoints(event.target.value)}
                rows={5}
                placeholder="Un punto por línea"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Imagen correcta
              </label>
              <Input
                type="url"
                value={correctImageUrl}
                onChange={(event) => setCorrectImageUrl(event.target.value)}
                placeholder="https://ejemplo.com/correcto.jpg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageUpload(event.target.files?.[0], setCorrectImageUrl)
                }
              />
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
                {correctImageUrl ? (
                  <img src={correctImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm text-muted-foreground">Vista previa</span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Imagen incorrecta
              </label>
              <Input
                type="url"
                value={incorrectImageUrl}
                onChange={(event) => setIncorrectImageUrl(event.target.value)}
                placeholder="https://ejemplo.com/incorrecto.jpg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageUpload(event.target.files?.[0], setIncorrectImageUrl)
                }
              />
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30">
                {incorrectImageUrl ? (
                  <img src={incorrectImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm text-muted-foreground">Vista previa</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tip profesional
            </label>
            <textarea
              value={tip}
              onChange={(event) => setTip(event.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={!title.trim() || !description.trim()}
          >
            {isNew ? "Crear" : "Guardar"} comparativa
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
