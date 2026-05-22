"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Target,
  Trophy,
  Clock,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Eye,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface InteractiveCasesProps {
  onBack: () => void
}

type CaseStatus = "pending" | "correct" | "incorrect"

interface HotspotArea {
  id: string
  x: number
  y: number
  width: number
  height: number
  isError: boolean
  label: string
  explanation: string
}

const cases = [
  {
    id: "1",
    title: "Análisis de Góndola",
    description: "Identifica los errores en esta exhibición de productos lácteos",
    difficulty: "Fácil",
    timeLimit: 60,
    points: 100,
    hotspots: [
      { id: "1", x: 10, y: 20, width: 20, height: 25, isError: true, label: "Producto sin precio", explanation: "Este producto no tiene etiqueta de precio visible" },
      { id: "2", x: 60, y: 45, width: 25, height: 20, isError: true, label: "Espacio vacío", explanation: "Hay un hueco en el estante que debe ser rellenado" },
      { id: "3", x: 35, y: 70, width: 20, height: 20, isError: false, label: "Bien organizado", explanation: "Esta sección está correctamente organizada" },
    ],
  },
  {
    id: "2",
    title: "Verificación de Precios",
    description: "Encuentra las inconsistencias entre precios de estante y productos",
    difficulty: "Medio",
    timeLimit: 90,
    points: 150,
    hotspots: [
      { id: "1", x: 15, y: 30, width: 22, height: 20, isError: true, label: "Precio incorrecto", explanation: "El precio del estante no coincide con el sistema" },
      { id: "2", x: 55, y: 25, width: 20, height: 22, isError: true, label: "Etiqueta vencida", explanation: "La promoción ya no está vigente" },
      { id: "3", x: 30, y: 60, width: 25, height: 18, isError: false, label: "Precio correcto", explanation: "El precio está actualizado y visible" },
    ],
  },
  {
    id: "3",
    title: "Control de Exhibición POP",
    description: "Evalúa la correcta colocación del material promocional",
    difficulty: "Difícil",
    timeLimit: 120,
    points: 200,
    hotspots: [
      { id: "1", x: 5, y: 10, width: 30, height: 15, isError: true, label: "Material obstruido", explanation: "El cartel tapa los productos del estante superior" },
      { id: "2", x: 45, y: 40, width: 25, height: 25, isError: false, label: "Buena ubicación", explanation: "El material POP está a la altura correcta" },
      { id: "3", x: 70, y: 65, width: 20, height: 20, isError: true, label: "Promoción vencida", explanation: "Este material tiene fecha de vigencia pasada" },
    ],
  },
]

export function InteractiveCases({ onBack }: InteractiveCasesProps) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0)
  const [gameState, setGameState] = useState<"intro" | "playing" | "results">("intro")
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  
  const currentCase = cases[currentCaseIndex]
  
  const startGame = () => {
    setGameState("playing")
    setSelectedHotspots([])
    setTimeLeft(currentCase.timeLimit)
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  
  const handleHotspotClick = (hotspot: HotspotArea) => {
    if (selectedHotspots.includes(hotspot.id)) return
    
    setSelectedHotspots([...selectedHotspots, hotspot.id])
    
    if (hotspot.isError) {
      setScore(score + 25)
      setStreak(streak + 1)
    } else {
      setScore(Math.max(0, score - 10))
      setStreak(0)
    }
    
    // Check if all errors found
    const errors = currentCase.hotspots.filter(h => h.isError)
    const foundErrors = errors.filter(e => [...selectedHotspots, hotspot.id].includes(e.id))
    
    if (foundErrors.length === errors.length) {
      setTimeout(endGame, 500)
    }
  }
  
  const endGame = () => {
    setGameState("results")
  }
  
  const nextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(currentCaseIndex + 1)
      setGameState("intro")
      setSelectedHotspots([])
    }
  }
  
  const resetGame = () => {
    setGameState("intro")
    setSelectedHotspots([])
    setScore(0)
    setStreak(0)
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
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Casos Interactivos
              </h1>
              <p className="text-sm text-muted-foreground">
                Simulador operativo
              </p>
            </div>
            
            {gameState === "playing" && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/20 text-warning">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary">
                  <Target className="w-4 h-4" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Case Card */}
              <div className="glass-card rounded-2xl p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        currentCase.difficulty === "Fácil" ? "bg-success/20 text-success" :
                        currentCase.difficulty === "Medio" ? "bg-warning/20 text-warning" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {currentCase.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/20 text-primary">
                        {currentCase.points} pts
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {currentCase.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {currentCase.description}
                    </p>
                  </div>
                </div>
                
                {/* Preview Image */}
                <div className="aspect-video rounded-xl bg-secondary border border-border flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Vista previa del caso</p>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-foreground">Instrucciones:</h3>
                  <ul className="space-y-2">
                    {[
                      "Analiza la imagen cuidadosamente",
                      "Toca las áreas donde detectes errores",
                      "Evita tocar áreas correctas (penalización)",
                      `Tiempo límite: ${currentCase.timeLimit} segundos`,
                    ].map((instruction, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={startGame}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Comenzar Análisis
                </Button>
              </div>
              
              {/* Cases Overview */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Progreso de Casos</h3>
                <div className="flex items-center gap-3">
                  {cases.map((c, index) => (
                    <button
                      key={c.id}
                      onClick={() => setCurrentCaseIndex(index)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        index === currentCaseIndex
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-muted-foreground"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm truncate">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.difficulty}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Streak indicator */}
              {streak >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-warning"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">Racha: {streak}x</span>
                </motion.div>
              )}
              
              {/* Interactive Area */}
              <div className="glass-card rounded-2xl p-4 lg:p-6">
                <div className="relative aspect-video rounded-xl bg-secondary border border-border overflow-hidden">
                  {/* Hotspot zones */}
                  {currentCase.hotspots.map((hotspot) => {
                    const isSelected = selectedHotspots.includes(hotspot.id)
                    
                    return (
                      <motion.button
                        key={hotspot.id}
                        onClick={() => handleHotspotClick(hotspot)}
                        disabled={isSelected}
                        className={`absolute rounded-lg border-2 transition-all ${
                          isSelected
                            ? hotspot.isError
                              ? "bg-destructive/30 border-destructive"
                              : "bg-success/30 border-success"
                            : "bg-transparent border-transparent hover:bg-white/10 hover:border-white/30"
                        }`}
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          width: `${hotspot.width}%`,
                          height: `${hotspot.height}%`,
                        }}
                        whileHover={{ scale: isSelected ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            {hotspot.isError ? (
                              <CheckCircle2 className="w-6 h-6 text-success" />
                            ) : (
                              <XCircle className="w-6 h-6 text-destructive" />
                            )}
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                  
                  {/* Center placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center opacity-50">
                      <Target className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Toca las áreas con errores
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feedback for last selection */}
                {selectedHotspots.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-secondary"
                  >
                    {(() => {
                      const lastId = selectedHotspots[selectedHotspots.length - 1]
                      const hotspot = currentCase.hotspots.find(h => h.id === lastId)
                      if (!hotspot) return null
                      
                      return (
                        <div className="flex items-start gap-3">
                          {hotspot.isError ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-medium ${hotspot.isError ? "text-success" : "text-warning"}`}>
                              {hotspot.isError ? "¡Error encontrado!" : "Área correcta"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {hotspot.explanation}
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}
              </div>
              
              {/* Progress */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Errores encontrados</span>
                  <span className="font-medium text-foreground">
                    {currentCase.hotspots.filter(h => h.isError && selectedHotspots.includes(h.id)).length}
                    /
                    {currentCase.hotspots.filter(h => h.isError).length}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success rounded-full"
                    animate={{
                      width: `${(currentCase.hotspots.filter(h => h.isError && selectedHotspots.includes(h.id)).length / currentCase.hotspots.filter(h => h.isError).length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-2xl p-6 lg:p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Análisis Completado!
              </h2>
              <p className="text-muted-foreground mb-8">
                Aquí está tu desempeño en este caso
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="text-3xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Puntos</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="text-3xl font-bold text-success">
                    {currentCase.hotspots.filter(h => h.isError && selectedHotspots.includes(h.id)).length}
                    /{currentCase.hotspots.filter(h => h.isError).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Errores</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="text-3xl font-bold text-warning">
                    {currentCase.timeLimit - timeLeft}s
                  </p>
                  <p className="text-sm text-muted-foreground">Tiempo</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reintentar
                </Button>
                {currentCaseIndex < cases.length - 1 && (
                  <Button
                    onClick={nextCase}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  >
                    Siguiente Caso
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
