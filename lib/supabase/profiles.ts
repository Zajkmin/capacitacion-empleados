"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Permission, User, UserRole } from "@/lib/roles-permissions"
import {
  createDemoProfileUser,
  listDemoProfiles,
  saveDemoUserProjectAssignments,
  updateDemoOwnProfileName,
  updateDemoProfile,
} from "@/lib/demo-data"
import { isDemoMode } from "@/lib/demo-mode"

function mapProfileToUser(profile: {
  id: string
  name: string
  email: string
  role: string
  extra_permissions: string[]
  created_at: string
  assignedProjectIds?: string[]
}): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    createdAt: profile.created_at.split("T")[0],
    extraPermissions: profile.extra_permissions as Permission[],
    assignedProjectIds: profile.assignedProjectIds ?? [],
  }
}

export async function listProfiles() {
  if (isDemoMode()) return listDemoProfiles()

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, extra_permissions, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("project_assignments")
    .select("user_id, project_id")

  if (assignmentsError) {
    throw new Error(assignmentsError.message)
  }

  const assignmentsByUser = new Map<string, string[]>()
  assignments.forEach((assignment) => {
    const currentIds = assignmentsByUser.get(assignment.user_id) ?? []
    assignmentsByUser.set(assignment.user_id, [
      ...currentIds,
      assignment.project_id,
    ])
  })

  return data.map((profile) =>
    mapProfileToUser({
      ...profile,
      assignedProjectIds: assignmentsByUser.get(profile.id) ?? [],
    }),
  )
}

export async function updateProfile(input: {
  id: string
  name: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  if (isDemoMode()) return updateDemoProfile(input)

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

export async function updateOwnProfileName(input: {
  name: string
}) {
  if (isDemoMode()) return updateDemoOwnProfileName(input.name.trim())

  const supabase = getSupabaseBrowserClient()
  const trimmedName = input.name.trim()

  if (!trimmedName) {
    throw new Error("El nombre no puede estar vacio.")
  }

  const { data, error } = await supabase.rpc("update_own_profile_name", {
    new_name: trimmedName,
  })

  if (error) {
    throw new Error(error.message)
  }

  const profile = data?.[0]
  if (!profile) {
    throw new Error("No se pudo actualizar el perfil.")
  }

  await supabase.auth.updateUser({
    data: { name: profile.name, full_name: profile.name },
  })

  return mapProfileToUser(profile)
}

export async function saveUserProjectAssignments(input: {
  userId: string
  projectIds: string[]
  assignedBy?: string
}) {
  if (isDemoMode()) return saveDemoUserProjectAssignments(input)

  const supabase = getSupabaseBrowserClient()

  const { error: deleteError } = await supabase
    .from("project_assignments")
    .delete()
    .eq("user_id", input.userId)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  if (!input.projectIds.length) return []

  const { data, error } = await supabase
    .from("project_assignments")
    .insert(
      input.projectIds.map((projectId) => ({
        user_id: input.userId,
        project_id: projectId,
        assigned_by: input.assignedBy ?? null,
      })),
    )
    .select("project_id")

  if (error) {
    throw new Error(error.message)
  }

  return data.map((item) => item.project_id)
}

export async function createProfileUser(input: {
  name: string
  email: string
  password: string
  role: UserRole
  extraPermissions: Permission[]
}) {
  if (isDemoMode()) return createDemoProfileUser(input)

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
