"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ProjectView } from "@/components/project-view"
import { Training } from "./training"
import { Updates } from "@/components/updates"
import { Profile } from "@/components/profile"
import { AdminPanel } from "@/components/admin-panel"
import { MobileNav } from "@/components/mobile-nav"
import { GlobalSearch } from "@/components/global-search"
import { type Permission, type UserRole } from "@/lib/roles-permissions"
import type { GlobalSearchResult } from "@/lib/supabase/search"
import {
  getLatestActivityTime,
  getNotificationSeenAt,
  markNotificationsSeen,
} from "@/lib/supabase/projects"

interface DashboardLayoutProps {
  user: {
    id?: string
    name: string
    email: string
    role: UserRole
    permissions?: Permission[]
  }
  onLogout: () => void
  onUserUpdate: (updates: { name?: string }) => void
}

export type ViewType = 
  | "dashboard" 
  | "project" 
  | "training" 
  | "updates" 
  | "profile"
  | "admin"

type NavigationState = {
  view: ViewType
  projectId?: string | null
  sectionId?: string | null
}

function parseNavigationHash(): NavigationState {
  if (typeof window === "undefined") return { view: "dashboard" }

  const hash = window.location.hash.replace(/^#\/?/, "")
  const params = new URLSearchParams(hash)
  const view = params.get("view") as ViewType | null
  const projectId = params.get("project")
  const sectionId = params.get("section")

  if (view === "project" && projectId) {
    return { view: "project", projectId, sectionId }
  }

  if (view && ["dashboard", "training", "updates", "profile", "admin"].includes(view)) {
    return { view }
  }

  return { view: "dashboard" }
}

function buildNavigationHash(state: NavigationState) {
  const params = new URLSearchParams()
  params.set("view", state.view)

  if (state.projectId) params.set("project", state.projectId)
  if (state.sectionId) params.set("section", state.sectionId)

  return `#${params.toString()}`
}

export function DashboardLayout({ user, onLogout, onUserUpdate }: DashboardLayoutProps) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false)
  const isNavigatingHistory = useRef(false)

  const applyNavigationState = (state: NavigationState) => {
    setCurrentView(state.view)
    setSelectedProject(state.view === "project" ? state.projectId ?? null : null)
    setSelectedSection(state.view === "project" ? state.sectionId ?? null : null)
  }

  const navigateTo = (state: NavigationState, mode: "push" | "replace" = "push") => {
    applyNavigationState(state)

    if (typeof window === "undefined" || isNavigatingHistory.current) return

    const url = buildNavigationHash(state)
    const historyState = { nexo: true, ...state }

    if (mode === "replace") {
      window.history.replaceState(historyState, "", url)
    } else {
      window.history.pushState(historyState, "", url)
    }
  }

  const navigateView = (view: ViewType) => {
    navigateTo({ view })
  }

  const refreshUnreadNotifications = async () => {
    if (!user.id) return

    try {
      const latestActivityTime = await getLatestActivityTime()
      if (!latestActivityTime) {
        setHasUnreadNotifications(false)
        return
      }

      const lastSeen = await getNotificationSeenAt(user.id)
      setHasUnreadNotifications(
        !lastSeen || new Date(latestActivityTime).getTime() > new Date(lastSeen).getTime(),
      )
    } catch {
      setHasUnreadNotifications(false)
    }
  }

  useEffect(() => {
    refreshUnreadNotifications()
    const intervalId = window.setInterval(refreshUnreadNotifications, 60000)

    return () => window.clearInterval(intervalId)
  }, [user.id])

  useEffect(() => {
    const initialState = parseNavigationHash()
    navigateTo(initialState, "replace")

    const handlePopState = (event: PopStateEvent) => {
      isNavigatingHistory.current = true
      const nextState = event.state?.nexo
        ? (event.state as NavigationState)
        : parseNavigationHash()

      applyNavigationState(nextState)
      window.setTimeout(() => {
        isNavigatingHistory.current = false
      }, 0)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (currentView !== "updates" || !user.id) return

    markNotificationsSeen(user.id)
      .then(() => setHasUnreadNotifications(false))
      .catch(() => setHasUnreadNotifications(false))
  }, [currentView, user.id])

  const handleProjectSelect = (projectId: string) => {
    navigateTo({ view: "project", projectId })
  }

  const handleBackToDashboard = () => {
    navigateTo({ view: "dashboard" }, "replace")
  }

  const handleSectionSelect = (sectionId: string) => {
    if (!selectedProject) return
    navigateTo({ view: "project", projectId: selectedProject, sectionId })
  }

  const handleBackToProject = () => {
    if (!selectedProject) {
      navigateTo({ view: "dashboard" }, "replace")
      return
    }

    navigateTo({ view: "project", projectId: selectedProject }, "replace")
  }

  const handleGlobalSearchResult = (result: GlobalSearchResult) => {
    if (!result.projectId || !result.sectionId) {
      if (result.type === "training") navigateTo({ view: "training" })
      return
    }

    navigateTo({
      view: "project",
      projectId: result.projectId,
      sectionId: result.sectionId,
    })
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard user={user} onProjectSelect={handleProjectSelect} />
      case "project":
        return (
          <ProjectView 
            projectId={selectedProject!} 
            onBack={handleBackToDashboard}
            activeSection={selectedSection}
            onSectionSelect={handleSectionSelect}
            onSectionBack={handleBackToProject}
            user={user}
          />
        )
      case "training":
        return <Training user={user} onBack={handleBackToDashboard} />
      case "updates":
        return <Updates onBack={handleBackToDashboard} />
      case "profile":
        return (
          <Profile
            user={user}
            onBack={handleBackToDashboard}
            onLogout={onLogout}
            onUserUpdate={onUserUpdate}
          />
        )
      case "admin":
        return <AdminPanel onBack={handleBackToDashboard} />
      default:
        return <Dashboard user={user} onProjectSelect={handleProjectSelect} />
    }
  }

  return (
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={navigateView}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          hasUnreadNotifications={hasUnreadNotifications}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
        />
      </div>
      
      {/* Main Content */}
      <main className={`min-w-0 flex-1 overflow-x-hidden pb-24 transition-all duration-300 lg:pb-0 ${
        sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + selectedProject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full min-w-0 overflow-x-hidden"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav 
          currentView={currentView} 
          onNavigate={navigateView}
          onLogout={onLogout}
          hasUnreadNotifications={hasUnreadNotifications}
          canAccessAdmin={user.role === "admin"}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
        />
      </main>

      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        userRole={user.role}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigateToResult={handleGlobalSearchResult}
      />
    </div>
  )
}
