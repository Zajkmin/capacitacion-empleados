import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Permission, UserRole } from "@/lib/roles-permissions"

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) return null

  return authorization.slice("Bearer ".length)
}

function getRequestClient(token: string) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const requestClient = getRequestClient(token)
    const {
      data: { user: requester },
      error: requesterError,
    } = await requestClient.auth.getUser(token)

    if (requesterError || !requester) {
      return NextResponse.json({ error: "Sesion invalida." }, { status: 401 })
    }

    const adminClient = getSupabaseAdminClient()
    const { data: requesterProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single()

    if (profileError || requesterProfile?.role !== "admin") {
      return NextResponse.json({ error: "Requiere rol admin." }, { status: 403 })
    }

    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
      role?: UserRole
      extraPermissions?: Permission[]
    }

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password ?? ""
    const role = body.role ?? "encuestador"
    const extraPermissions = role === "admin" ? [] : body.extraPermissions ?? []

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, correo y contrasena son obligatorios." },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 6 caracteres." },
        { status: 400 },
      )
    }

    const { data: createdUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
        },
      })

    if (createError || !createdUser.user) {
      return NextResponse.json(
        { error: createError?.message ?? "No se pudo crear el usuario." },
        { status: 400 },
      )
    }

    const { data: profile, error: upsertError } = await adminClient
      .from("profiles")
      .upsert({
        id: createdUser.user.id,
        name,
        email,
        role,
        extra_permissions: extraPermissions,
      })
      .select("id, name, email, role, extra_permissions, created_at")
      .single()

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        createdAt: profile.created_at.split("T")[0],
        extraPermissions: profile.extra_permissions,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear el usuario.",
      },
      { status: 500 },
    )
  }
}
