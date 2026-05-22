"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Zap, ArrowRight, Shield, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginPageProps {
  onLogin: (email: string, password: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">FieldOps Pro</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              Capacitación operativa{" "}
              <span className="text-primary">inteligente</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-md leading-relaxed">
              Plataforma moderna para equipos de campo. Aprende rápido, 
              ejecuta mejor, documenta todo.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Aprendizaje visual y práctico" },
                { icon: BarChart3, text: "Seguimiento en tiempo real" },
                { icon: Zap, text: "Actualizaciones instantáneas" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FieldOps Pro</span>
          </div>
          
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-muted-foreground">
                Ingresa tus credenciales para continuar
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="h-12 bg-secondary border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-secondary border-border focus:border-primary focus:ring-primary/20 pr-12 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border bg-secondary accent-primary" />
                  <span className="text-muted-foreground">Recordarme</span>
                </label>
                <button type="button" className="text-primary hover:text-primary/80 transition-colors">
                  Olvidé mi contraseña
                </button>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Ingresando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Ingresar</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Contacta a tu administrador
                </button>
              </p>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-6">
            Al ingresar, aceptas nuestros{" "}
            <button className="text-primary hover:underline">Términos de uso</button>
            {" "}y{" "}
            <button className="text-primary hover:underline">Política de privacidad</button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
