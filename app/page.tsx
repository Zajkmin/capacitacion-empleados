"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { type UserRole } from "@/lib/roles-permissions"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: UserRole } | null>(null)

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // Simulated login
    setUser({
      name: "Carlos Mendoza",
      email,
      role
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardLayout user={user!} onLogout={handleLogout} />
}
