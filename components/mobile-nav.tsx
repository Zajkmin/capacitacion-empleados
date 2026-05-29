"use client"

import {
  Bell,
  BookOpen,
  LayoutDashboard,
  Lock,
  LogOut,
  Search,
  User,
} from "lucide-react"
import type { ViewType } from "@/components/dashboard-layout"

interface MobileNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
  hasUnreadNotifications?: boolean
  canAccessAdmin?: boolean
  onOpenSearch?: () => void
}

const navItems = [
  { id: "dashboard" as ViewType, icon: LayoutDashboard, label: "Inicio" },
  { id: "training" as ViewType, icon: BookOpen, label: "Capac." },
  { id: "updates" as ViewType, icon: Bell, label: "Notif." },
  { id: "profile" as ViewType, icon: User, label: "Perfil" },
]

export function MobileNav({
  currentView,
  onNavigate,
  onLogout,
  hasUnreadNotifications,
  canAccessAdmin = false,
  onOpenSearch,
}: MobileNavProps) {
  const visibleNavItems = canAccessAdmin
    ? [...navItems, { id: "admin" as ViewType, icon: Lock, label: "Admin" }]
    : navItems
  const totalItems = visibleNavItems.length + 2

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-secondary/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
      <div
        className="grid items-stretch gap-1"
        style={{ gridTemplateColumns: `repeat(${totalItems}, minmax(0, 1fr))` }}
      >
        {visibleNavItems.map((item) => {
          const isActive =
            currentView === item.id ||
            (item.id === "dashboard" && currentView === "project")

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <item.icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {item.id === "updates" && hasUnreadNotifications ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-secondary" />
                ) : null}
              </span>
              <span className="max-w-full truncate text-[10px] font-medium leading-none">
                {item.label}
              </span>
              {isActive ? (
                <div className="absolute -top-2 h-1 w-8 rounded-full bg-primary" />
              ) : null}
            </button>
          )
        })}

        <button
          type="button"
          onClick={onOpenSearch}
          className="relative flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-muted-foreground transition-all duration-200 hover:text-primary"
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <Search className="h-5 w-5" />
          </span>
          <span className="max-w-full truncate text-[10px] font-medium leading-none">
            Buscar
          </span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="relative flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-muted-foreground transition-all duration-200 hover:text-red-400"
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <LogOut className="h-5 w-5" />
          </span>
          <span className="max-w-full truncate text-[10px] font-medium leading-none">
            Salir
          </span>
        </button>
      </div>
    </nav>
  )
}
