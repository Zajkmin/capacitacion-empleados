"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Permission, UserRole } from "@/lib/roles-permissions"
import {
  deleteDemoRole,
  getDemoRolePermissions,
  listDemoRoles,
  saveDemoRole,
} from "@/lib/demo-data"
import { isDemoMode } from "@/lib/demo-mode"

export interface RoleConfig {
  id: UserRole
  label: string
  description: string
  color: string
  permissions: Permission[]
  locked?: boolean
}

function mapRole(role: {
  id: string
  label: string
  description: string
  color: string
  permissions: string[]
  locked: boolean
}): RoleConfig {
  return {
    id: role.id as UserRole,
    label: role.label,
    description: role.description,
    color: role.color,
    permissions: role.permissions as Permission[],
    locked: role.locked,
  }
}

export async function listRoles() {
  if (isDemoMode()) return listDemoRoles()

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("roles")
    .select("id, label, description, color, permissions, locked")
    .order("created_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data.map(mapRole)
}

export async function getRolePermissions(roleId: UserRole) {
  if (isDemoMode()) return getDemoRolePermissions(roleId)

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("roles")
    .select("permissions")
    .eq("id", roleId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data?.permissions ?? []) as Permission[]
}

export async function saveRole(role: RoleConfig) {
  if (isDemoMode()) return saveDemoRole(role)

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("roles")
    .upsert({
      id: role.id,
      label: role.label,
      description: role.description,
      color: role.color,
      permissions: role.locked ? role.permissions : role.permissions,
      locked: role.locked ?? false,
    })
    .select("id, label, description, color, permissions, locked")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapRole(data)
}

export async function deleteRole(roleId: UserRole, fallbackRole: UserRole) {
  if (isDemoMode()) {
    deleteDemoRole(roleId, fallbackRole)
    return
  }

  const supabase = getSupabaseBrowserClient()

  const { error: profilesError } = await supabase
    .from("profiles")
    .update({ role: fallbackRole, extra_permissions: [] })
    .eq("role", roleId)

  if (profilesError) {
    throw new Error(profilesError.message)
  }

  const { error } = await supabase.from("roles").delete().eq("id", roleId)

  if (error) {
    throw new Error(error.message)
  }
}
