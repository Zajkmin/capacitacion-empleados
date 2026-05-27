"use client"

import type { User as SupabaseAuthUser } from "@supabase/supabase-js"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Permission, UserRole } from "@/lib/roles-permissions"
import { getRolePermissions } from "@/lib/supabase/roles"

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
  extraPermissions: Permission[]
}

function getFallbackName(user: SupabaseAuthUser) {
  const fullName = user.user_metadata?.full_name
  const name = user.user_metadata?.name

  if (typeof fullName === "string" && fullName.trim()) return fullName.trim()
  if (typeof name === "string" && name.trim()) return name.trim()
  return user.email?.split("@")[0] ?? "Usuario"
}

async function getOrCreateProfile(user: SupabaseAuthUser): Promise<AppUser> {
  const supabase = getSupabaseBrowserClient()
  const email = user.email ?? ""

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, extra_permissions")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (profile) {
    const rolePermissions = await getRolePermissions(profile.role as UserRole)
    const extraPermissions = profile.extra_permissions as Permission[]

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as UserRole,
      permissions:
        profile.role === "admin"
          ? rolePermissions
          : Array.from(new Set([...rolePermissions, ...extraPermissions])),
      extraPermissions,
    }
  }

  const { data: createdProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      name: getFallbackName(user),
      email,
      role: "encuestador",
    })
    .select("id, name, email, role, extra_permissions")
    .single()

  if (createError) {
    throw new Error(createError.message)
  }

  const rolePermissions = await getRolePermissions(createdProfile.role as UserRole)
  const extraPermissions = createdProfile.extra_permissions as Permission[]

  return {
    id: createdProfile.id,
    name: createdProfile.name,
    email: createdProfile.email,
    role: createdProfile.role as UserRole,
    permissions: Array.from(new Set([...rolePermissions, ...extraPermissions])),
    extraPermissions,
  }
}

export async function getCurrentAppUser() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) return null

  return getOrCreateProfile(data.user)
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error("No se pudo obtener el usuario autenticado.")
  }

  return getOrCreateProfile(data.user)
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}
