"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  User,
  ListChecks,
} from "lucide-react"

interface TrainingProps {
  user: { name: string; email: string; role: string }
  onBack: () => void
}

const roleGuides: Record<string, {
  subtitle: string
  intro: string
  focus: string[]
  steps: string[]
  recommendations: string[]
}> = {
  encuestador: {
    subtitle: "Funciones clave para el encuestador",
    intro: "Como encuestador, tu responsabilidad principal es obtener información precisa y atender al cliente con profesionalismo.",
    focus: [
      "Realizar preguntas claras y neutrales",
      "Registrar respuestas exactas sin interpretación personal",
      "Mantener una actitud amable y respetuosa",
      "Respetar la privacidad y el tiempo del encuestado",
    ],
    steps: [
      "Presentarte con nombre y propósito de la visita",
      "Verificar datos antes de iniciar la encuesta",
      "Leer cada pregunta completa y asegurarte de que el encuestado entienda",
      "No influenciar las respuestas ni emitir juicios",
      "Agradecer al final y explicar el siguiente paso si aplica",
    ],
    recommendations: [
      "Prepara el material antes de llegar al punto de venta",
      "Usa un tono de voz cómodo y profesional",
      "Mantén el equipo cargado y los formularios listos",
      "Solicita permiso antes de tomar fotos o datos adicionales",
    ],
  },
  supervisor: {
    subtitle: "Rol y responsabilidades del supervisor",
    intro: "Como supervisor de campo, debes coordinar al equipo, asegurar la calidad del trabajo y apoyar en la resolución de incidencias.",
    focus: [
      "Revisar el avance de las visitas y proyectos asignados",
      "Apoyar y orientar a los encuestadores en terreno",
      "Verificar que se sigan los estándares de la empresa",
      "Generar reportes claros y oportunos",
    ],
    steps: [
      "Revisar el plan de trabajo del día antes de salir",
      "Asegurar que cada encuestador entienda su ruta y objetivos",
      "Monitorear la calidad de los datos obtenidos",
      "Intervenir cuando haya dudas o problemas técnicos",
      "Brindar retroalimentación constructiva al equipo",
    ],
    recommendations: [
      "Mantén comunicación constante con el equipo",
      "Lleva copias de los protocoles y formatos necesarios",
      "Prioriza la seguridad del equipo y del punto de venta",
      "Documenta cualquier cambio o evento relevante",
    ],
  },
  analista_calidad: {
    subtitle: "Guía práctica para promotores",
    intro: "El promotor debe asegurar la correcta exhibición de productos y ofrecer soporte al cliente en el punto de venta.",
    focus: [
      "Seguir el planograma establecido",
      "Mantener la imagen del producto limpia y visible",
      "Informar sobre promociones y materiales POP",
      "Responder dudas básicas del personal de tienda",
    ],
    steps: [
      "Verificar el estado de los exhibidores y materiales promocionales",
      "Reponer productos según el esquema de exhibición",
      "Asegurar que precios y etiquetado estén visibles",
      "Reportar faltantes o daños de forma clara",
      "Coordinar con el responsable de la tienda cuando sea necesario",
    ],
    recommendations: [
      "Mantén una actitud proactiva y colaborativa",
      "Respeta los horarios de atención de cada tienda",
      "Usa uniforme y credenciales claramente visibles",
      "Asegura que el material POP esté en buen estado",
    ],
  },
}

const defaultGuide = {
  subtitle: "Capacitación general",
  intro: "Aquí encontrarás instrucciones generales para desempeñarte con seguridad y profesionalismo en tu rol.",
  focus: [
    "Comprender tus tareas antes de iniciarlas",
    "Mantener una comunicación clara y respetuosa",
    "Seguir los protocolos y normas de la empresa",
    "Entregar información verídica y documentada",
  ],
  steps: [
    "Consulta tu ruta y objetivos diarios antes de salir",
    "Revisa el material y equipo necesarios para el trabajo",
    "Actúa con profesionalismo en cada visita",
    "Reporta incidencias, resultados y cambios lo antes posible",
  ],
  recommendations: [
    "Pregunta si tienes dudas sobre alguna tarea",
    "Cuida tu presentación personal",
    "Mantén tus herramientas y dispositivo en buen estado",
    "Respeta la privacidad y el tiempo de quienes entrevistas o visitas",
  ],
}

export function Training({ user, onBack }: TrainingProps) {
  const guide = roleGuides[user.role] ?? defaultGuide

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
              <h1 className="text-lg font-bold text-foreground">Capacitación</h1>
              <p className="text-sm text-muted-foreground">Guía de acciones basadas en tu rol</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Rol asignado</p>
              <p className="font-semibold text-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{guide.subtitle}</h2>
              <p className="text-sm text-muted-foreground mt-1">{guide.intro}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border p-5 bg-secondary/70">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Puntos clave</h3>
              </div>
              <ul className="space-y-3">
                {guide.focus.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border p-5 bg-secondary/70">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Recomendaciones</h3>
              </div>
              <ul className="space-y-3">
                {guide.recommendations.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="glass-card rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Qué hacer</h2>
              <p className="text-sm text-muted-foreground mt-1">Sigue estos pasos para cumplir con tu rol de forma efectiva.</p>
            </div>
          </div>

          <ol className="space-y-4 pl-5 text-sm text-muted-foreground list-decimal">
            {guide.steps.map((step) => (
              <li key={step} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </motion.section>
      </main>
    </div>
  )
}
