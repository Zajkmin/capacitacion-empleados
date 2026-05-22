"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Bell,
  Moon,
  Sun,
  Shield,
  ChevronRight,
  LogOut,
  Smartphone,
  Globe,
  HelpCircle,
  Award,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileProps {
  user: { name: string; email: string; role: string }
  onBack: () => void
}

export function Profile({ user, onBack }: ProfileProps) {
  const [notifications, setNotifications] = useState(true)
  
  const stats = [
    { label: "Proyectos", value: "4", icon: Target },
    { label: "Horas", value: "24h", icon: Clock },
    { label: "Completados", value: "127", icon: CheckCircle2 },
    { label: "Puntuación", value: "92%", icon: Award },
  ]
  
  const menuSections = [
    {
      title: "Preferencias",
      items: [
        { icon: Bell, label: "Notificaciones", toggle: true, value: notifications, onChange: setNotifications },
        { icon: Moon, label: "Tema oscuro", info: "Activado" },
        { icon: Globe, label: "Idioma", info: "Español" },
        { icon: Smartphone, label: "App móvil", info: "Sincronizado" },
      ],
    },
    {
      title: "Cuenta",
      items: [
        { icon: Shield, label: "Seguridad y privacidad" },
        { icon: HelpCircle, label: "Ayuda y soporte" },
      ],
    },
  ]
  
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
                Configuración
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tu cuenta y preferencias
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-4 lg:p-8 max-w-3xl mx-auto">
        {/* Profile Card */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Briefcase className="w-4 h-4" />
                <span>{user.role}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              Editar
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-3 rounded-xl bg-secondary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="glass-card rounded-2xl overflow-hidden mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  
                  {"toggle" in item ? (
                    <div
                      className={`w-12 h-7 rounded-full transition-colors ${
                        item.value ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        item.onChange(!item.value)
                      }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white shadow-md mt-1"
                        animate={{ marginLeft: item.value ? 26 : 4 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {"info" in item && <span className="text-sm">{item.info}</span>}
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Logout */}
        <motion.button
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-center gap-3 text-destructive hover:bg-destructive/10 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </motion.button>
        
        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          FieldOps Pro v1.0.0
        </p>
      </main>
    </div>
  )
}
