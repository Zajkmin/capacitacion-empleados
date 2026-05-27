"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { SectionType } from "@/lib/roles-permissions"

export interface ProjectRecord {
  id: string
  name: string
  bgColor: string
  textColor: string
  coverImage?: string
}

export interface CountryRecord {
  id: string
  name: string
  projects: ProjectRecord[]
}

export interface ProjectSectionRecord {
  id: string
  title: string
  description: string
  type: SectionType
  content?: string
  color: string
}

const sectionColors: Record<SectionType, string> = {
  rules: "bg-primary",
  exceptions: "bg-amber-500",
  "visual-learning": "bg-violet-500",
  library: "bg-slate-500",
  photos: "bg-emerald-500",
  errors: "bg-rose-500",
  updates: "bg-cyan-500",
}

const defaultProjectSections: Array<{
  title: string
  description: string
  type: SectionType
  color: string
}> = [
  {
    title: "Reglas del Proyecto",
    description: "Normativas y procedimientos a seguir",
    type: "rules",
    color: "bg-primary",
  },
  {
    title: "Excepciones",
    description: "Casos especiales y permisos",
    type: "exceptions",
    color: "bg-amber-500",
  },
  {
    title: "Aprendizaje Visual",
    description: "Comparativas y ejemplos ilustrados",
    type: "visual-learning",
    color: "bg-violet-500",
  },
  {
    title: "Biblioteca",
    description: "Recursos y documentos del proyecto",
    type: "library",
    color: "bg-slate-500",
  },
  {
    title: "Fotos Guia",
    description: "Referencias visuales de ejecucion",
    type: "photos",
    color: "bg-emerald-500",
  },
  {
    title: "Errores Frecuentes",
    description: "Que evitar en campo",
    type: "errors",
    color: "bg-rose-500",
  },
  {
    title: "Actualizaciones",
    description: "Cambios y novedades recientes",
    type: "updates",
    color: "bg-cyan-500",
  },
]

function mapProject(project: {
  id: string
  name: string
  bg_color: string
  text_color: string
  cover_image: string | null
}): ProjectRecord {
  return {
    id: project.id,
    name: project.name,
    bgColor: project.bg_color,
    textColor: project.text_color,
    coverImage: project.cover_image ?? undefined,
  }
}

export async function listCountriesWithProjects() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("countries")
    .select(
      "id, name, projects(id, name, bg_color, text_color, cover_image, sort_order)",
    )
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "projects", ascending: true })

  if (error) throw new Error(error.message)

  return data.map((country) => ({
    id: country.id,
    name: country.name,
    projects: (country.projects ?? []).map(mapProject),
  }))
}

export async function saveCountry(input: { id?: string; name: string; sortOrder?: number }) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("countries")
    .upsert({
      ...(input.id ? { id: input.id } : {}),
      name: input.name,
      sort_order: input.sortOrder ?? 0,
    })
    .select("id, name")
    .single()

  if (error) throw new Error(error.message)

  return { id: data.id, name: data.name, projects: [] }
}

export async function deleteCountry(countryId: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("countries").delete().eq("id", countryId)
  if (error) throw new Error(error.message)
}

export async function saveProject(input: {
  id?: string
  countryId: string
  name: string
  bgColor: string
  textColor?: string
  coverImage?: string
  sortOrder?: number
}) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("projects")
    .upsert({
      ...(input.id ? { id: input.id } : {}),
      country_id: input.countryId,
      name: input.name,
      bg_color: input.bgColor,
      text_color: input.textColor ?? "text-white",
      cover_image: input.coverImage ?? null,
      sort_order: input.sortOrder ?? 0,
    })
    .select("id, name, bg_color, text_color, cover_image")
    .single()

  if (error) throw new Error(error.message)

  if (!input.id) {
    const { error: sectionsError } = await supabase
      .from("project_sections")
      .insert(
        defaultProjectSections.map((section, index) => ({
          project_id: data.id,
          title: section.title,
          description: section.description,
          type: section.type,
          color: section.color,
          sort_order: index,
        })),
      )

    if (sectionsError) throw new Error(sectionsError.message)
  }

  return mapProject(data)
}

export async function deleteProject(projectId: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("projects").delete().eq("id", projectId)
  if (error) throw new Error(error.message)
}

function mapProjectSection(section: {
  id: string
  title: string
  description: string
  type: string
  content: string | null
  color: string
}): ProjectSectionRecord {
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    type: section.type as SectionType,
    content: section.content ?? undefined,
    color: section.color,
  }
}

export async function listProjectSections(projectId: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("project_sections")
    .select("id, title, description, type, content, color")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })

  if (error) throw new Error(error.message)

  return data.map(mapProjectSection)
}

export async function saveProjectSection(input: {
  id?: string
  projectId: string
  title: string
  description: string
  type: SectionType
  content?: string
  sortOrder?: number
  userId?: string
}) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("project_sections")
    .upsert({
      ...(input.id ? { id: input.id, updated_by: input.userId ?? null } : { created_by: input.userId ?? null }),
      project_id: input.projectId,
      title: input.title,
      description: input.description,
      type: input.type,
      content: input.content ?? null,
      color: sectionColors[input.type] ?? "bg-primary",
      sort_order: input.sortOrder ?? 0,
    })
    .select("id, title, description, type, content, color")
    .single()

  if (error) throw new Error(error.message)

  return mapProjectSection(data)
}

export async function deleteProjectSection(sectionId: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from("project_sections")
    .delete()
    .eq("id", sectionId)

  if (error) throw new Error(error.message)
}
