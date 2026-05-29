"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app keeps working normally if registration is blocked.
      })
    })
  }, [])

  return null
}
