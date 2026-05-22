"use client"

import { useState } from "react"
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
  Target,
  Sparkles,
} from "lucide-react"

interface VisualLearningProps {
  onBack: () => void
}

const comparisons = [
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

export function VisualLearning({ onBack }: VisualLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTip, setShowTip] = useState(false)
  
  const currentComparison = comparisons[currentIndex]
  
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
              <h1 className="text-lg font-bold text-foreground">
                Aprendizaje Visual
              </h1>
              <p className="text-sm text-muted-foreground">
                Comparativas lado a lado
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{currentIndex + 1}</span>
              <span>/</span>
              <span>{comparisons.length}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-4 lg:p-8">
        <motion.div
          key={currentComparison.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {currentComparison.title}
            </h2>
            <p className="text-muted-foreground">
              {currentComparison.description}
            </p>
          </div>
          
          {/* Comparison Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Correct */}
            <motion.div
              className="state-correct rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-bold text-success">
                  {currentComparison.correct.label}
                </h3>
              </div>
              
              {/* Image placeholder */}
              <div className="aspect-video rounded-xl bg-success/10 border border-success/30 flex items-center justify-center mb-4 relative group cursor-pointer">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-success/50 mx-auto mb-2" />
                  <p className="text-sm text-success/70">Imagen de referencia</p>
                </div>
                <button className="absolute top-3 right-3 p-2 rounded-lg bg-success/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-success" />
                </button>
              </div>
              
              {/* Points */}
              <ul className="space-y-2">
                {currentComparison.correct.points.map((point, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Incorrect */}
            <motion.div
              className="state-incorrect rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-destructive">
                  {currentComparison.incorrect.label}
                </h3>
              </div>
              
              {/* Image placeholder */}
              <div className="aspect-video rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4 relative group cursor-pointer">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-destructive/50 mx-auto mb-2" />
                  <p className="text-sm text-destructive/70">Imagen de referencia</p>
                </div>
                <button className="absolute top-3 right-3 p-2 rounded-lg bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-destructive" />
                </button>
              </div>
              
              {/* Points */}
              <ul className="space-y-2">
                {currentComparison.incorrect.points.map((point, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Tip Section */}
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
              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                showTip ? "rotate-90" : ""
              }`} />
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
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:bg-card/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {comparisons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setShowTip(false)
                  }}
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
      </main>
    </div>
  )
}
