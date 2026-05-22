"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ListChecks } from "lucide-react"

const initialTasks = [
  { id: "1", text: "Revisar actualización de reglas Metro", completed: false },
  { id: "2", text: "Completar módulo de excepciones", completed: false },
  { id: "3", text: "Validar fotos de referencia", completed: true },
  { id: "4", text: "Responder quiz de capacitación", completed: false },
]

export function QuickChecklist() {
  const [tasks, setTasks] = useState(initialTasks)
  
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }
  
  const completedCount = tasks.filter(t => t.completed).length
  const progress = (completedCount / tasks.length) * 100
  
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          Checklist del Día
        </h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{tasks.length}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-success rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Tasks */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                task.completed
                  ? "bg-success/10"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-sm text-left ${
                task.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}>
                {task.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
