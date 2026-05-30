"use client"

export const DEMO_SESSION_KEY = "nexo-demo-session"
export const DEMO_NOTICE_MESSAGE =
  "Modo demo: los cambios se simulan localmente y no se guardan de forma permanente."

export function isDemoMode() {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(DEMO_SESSION_KEY) === "active"
}

export function startDemoMode() {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(DEMO_SESSION_KEY, "active")
}

export function stopDemoMode() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(DEMO_SESSION_KEY)
}

export function notifyDemoWrite() {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent("nexo-demo-notice", {
      detail: DEMO_NOTICE_MESSAGE,
    }),
  )
}
