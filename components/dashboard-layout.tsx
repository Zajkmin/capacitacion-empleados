"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ProjectView } from "@/components/project-view"
import { Training } from "./training"
import { Updates } from "@/components/updates"
import { Profile } from "@/components/profile"
import { MobileNav } from "@/components/mobile-nav"

interface DashboardLayoutProps {
  user: { name: string; email: string; role: string }
  onLogout: () => void
}

export type ViewType = 
  | "dashboard" 
  | "project" 
  | "training" 
  | "updates" 
  | "profile"

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
          />
        )
      case "training":
        return <Training user={user} onBack={handleBackToDashboard} />
      case "updates":
        return <Updates onBack={handleBackToDashboard} />
      case "profile":
        return <Profile user={user} onBack={handleBackToDashboard} />
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
        />
      </main>
    </div>
  )
}
