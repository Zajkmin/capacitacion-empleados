"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ProjectView } from "@/components/project-view"
import { Training } from "./training"
import { Updates } from "@/components/updates"
import { Profile } from "@/components/profile"
import { AdminPanel } from "@/components/admin-panel"
import { MobileNav } from "@/components/mobile-nav"
import { type Permission, type UserRole } from "@/lib/roles-permissions"
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

export function DashboardLayout({ user, onLogout, onUserUpdate }: DashboardLayoutProps) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

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
    if (currentView !== "updates" || !user.id) return

    markNotificationsSeen(user.id)
      .then(() => setHasUnreadNotifications(false))
      .catch(() => setHasUnreadNotifications(false))
  }, [currentView, user.id])

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId)
    setCurrentView("project")
  }

  const handleBackToDashboard = () => {
    setSelectedProject(null)
    setCurrentView("dashboard")
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
            onNavigate={setCurrentView}
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
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          hasUnreadNotifications={hasUnreadNotifications}
        />
      </div>
      
      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + selectedProject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav 
          currentView={currentView} 
          onNavigate={setCurrentView}
          onLogout={onLogout}
          hasUnreadNotifications={hasUnreadNotifications}
        />
      </main>
    </div>
  )
}
