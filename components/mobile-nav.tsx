"use client"

import {
  LayoutDashboard,
  BookOpen,
  Library as LibraryIcon,
  Bell,
  LogOut,
} from "lucide-react"
import type { ViewType } from "@/components/dashboard-layout"

interface MobileNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
}

const navItems = [
  { id: "dashboard" as ViewType, icon: LayoutDashboard, label: "Inicio" },
  { id: "library" as ViewType, icon: LibraryIcon, label: "Biblioteca" },
  { id: "updates" as ViewType, icon: Bell, label: "Alertas" },
]

export function MobileNav({ currentView, onNavigate, onLogout }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-lg border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id || 
            (item.id === "dashboard" && currentView === "project")
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
