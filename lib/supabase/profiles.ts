"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Permission, User, UserRole } from "@/lib/roles-permissions"

function mapProfileToUser(profile: {
  id: string
  name: string
  email: string
  role: string
  extra_permissions: string[]
  created_at: string
}): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    createdAt: profile.created_at.split("T")[0],
    extraPermissions: profile.extra_permissions as Permission[],
  }
}

export async function listProfiles() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, extra_permissions, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data.map(mapProfileToUser)
}

export async function updateProfile(input: {
  id: string
  name: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: input.name,
      role: input.role,
      extra_permissions: input.extraPermissions,
    })
    .eq("id", input.id)
    .select("id, name, email, role, extra_permissions, created_at")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapProfileToUser(data)
}

export async function createProfileUser(input: {
  name: string
  email: string
  password: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  const supabase = getSupabaseBrowserClient()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new Error("Debes iniciar sesion como admin para crear usuarios.")
  }

  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  const payload = (await response.json()) as {
    user?: User
    error?: string
  }

  if (!response.ok || !payload.user) {
    throw new Error(payload.error ?? "No se pudo crear el usuario.")
  }

  return payload.user
}
