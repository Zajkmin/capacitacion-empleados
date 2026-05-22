"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  Gamepad2,
  Library as LibraryIcon,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
} from "lucide-react"
import type { ViewType } from "@/components/dashboard-layout"

interface SidebarProps {
  user: { name: string; email: string; role: string }
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { id: "dashboard" as ViewType, icon: LayoutDashboard, label: "Dashboard" },
  { id: "visual-learning" as ViewType, icon: BookOpen, label: "Aprendizaje" },
  { id: "interactive-cases" as ViewType, icon: Gamepad2, label: "Casos Interactivos" },
  { id: "library" as ViewType, icon: LibraryIcon, label: "Biblioteca" },
  { id: "updates" as ViewType, icon: Bell, label: "Actualizaciones" },
]

export function Sidebar({
  user,
  currentView,
  onNavigate,
  onLogout,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
      animate={{ width: collapsed ? 80 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          animate={{ opacity: collapsed ? 0 : 1 }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground whitespace-nowrap">
              FieldOps Pro
            </span>
          )}
        </motion.div>
        
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-current" : ""}`} />
                  {!collapsed && (
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-current"
                      layoutId="activeIndicator"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        
        {/* Divider */}
        <div className="my-4 h-px bg-sidebar-border" />
        
        {/* Settings */}
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onNavigate("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === "profile"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">Configuración</span>}
            </button>
          </li>
        </ul>
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-sidebar-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={onLogout}
            className="mt-2 w-full p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
