"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  Library as LibraryIcon,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
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
  { id: "dashboard" as ViewType, icon: LayoutDashboard, label: "Inicio" },
  { id: "library" as ViewType, icon: LibraryIcon, label: "Biblioteca" },
  { id: "updates" as ViewType, icon: Bell, label: "Actualizaciones" },
  { id: "profile" as ViewType, icon: Settings, label: "Mi Perfil" },
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
      className="fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border z-40 flex flex-col"
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">FO</span>
              </div>
              <span className="font-semibold text-foreground">FieldOps Pro</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">FO</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-primary" : "group-hover:text-primary"
                    }`}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-accent/30 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <User className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.role}
              </p>
            </motion.div>
          )}
        </div>

        <button
          onClick={onLogout}
          className={`mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm">Cerrar Sesion</span>}
        </button>
      </div>
    </motion.aside>
  )
}
