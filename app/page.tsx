"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  const handleLogin = (email: string, password: string) => {
    // Simulated login
    setUser({
      name: "Carlos Mendoza",
      email,
      role: "Supervisor de Campo"
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
