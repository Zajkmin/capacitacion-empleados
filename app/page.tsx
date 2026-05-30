"use client"

import { useEffect, useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  getCurrentAppUser,
  signInAsGuestDemo,
  signInWithPassword,
  signOut,
  type AppUser,
} from "@/lib/supabase/auth"

export default function Home() {
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    let isMounted = true

    getCurrentAppUser()
      .then((currentUser) => {
        if (!isMounted || !currentUser) return
        setUser(currentUser)
        setIsLoggedIn(true)
      })
      .catch(() => {
        setUser(null)
        setIsLoggedIn(false)
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    const authenticatedUser = await signInWithPassword(email, password)
    setUser(authenticatedUser)
    setIsLoggedIn(true)
  }

  const handleGuestLogin = async () => {
    const demoUser = await signInAsGuestDemo()
    setUser(demoUser)
    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)
  }

  const handleUserUpdate = (updates: Partial<AppUser>) => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, ...updates } : currentUser,
    )
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Verificando sesion...
        </div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
  }

  return (
    <DashboardLayout
      user={user!}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
    />
  )
}
