"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/roles-permissions"
import { searchDemoContent } from "@/lib/demo-data"
import { isDemoMode } from "@/lib/demo-mode"

export type GlobalSearchResultType =
  | "rule"
  | "exception"
  | "photo"
  | "error"
  | "update"
  | "library"
  | "visual-learning"
  | "training"

export interface GlobalSearchResult {
  id: string
  type: GlobalSearchResultType
  title: string
  description: string
  content?: string
  imageUrl?: string
  sourceUrl?: string
  projectId?: string
  projectName?: string
  sectionId?: string
  sectionTitle?: string
  contextLabel: string
}

function normalizeSearchText(value: unknown): string {
  if (value == null) return ""
  if (Array.isArray(value)) return value.map(normalizeSearchText).join(" ")
  if (typeof value === "object") return Object.values(value).map(normalizeSearchText).join(" ")
  return String(value)
}

function includesQuery(result: GlobalSearchResult, query: string) {
  const haystack = [
    result.title,
    result.description,
    result.content,
    result.projectName,
    result.sectionTitle,
    result.contextLabel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query.toLowerCase())
}

function mapSectionResult(item: any): GlobalSearchResult {
  const section = item.project_sections
  const project = section?.projects
  const metadataText = normalizeSearchText(item.metadata)

  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? "",
    content: [item.content, metadataText].filter(Boolean).join("\n"),
    imageUrl: item.image_url ?? item.metadata?.correctImageUrl ?? item.metadata?.incorrectImageUrl,
    sourceUrl: item.source_url,
    projectId: section?.project_id,
    projectName: project?.name,
    sectionId: item.section_id,
    sectionTitle: section?.title,
    contextLabel: [project?.name, section?.title].filter(Boolean).join(" / "),
  }
}

function mapTrainingResult(topic: any): GlobalSearchResult {
  return {
    id: topic.id,
    type: "training",
    title: topic.title,
    description: topic.summary ?? "",
    content: topic.body ?? "",
    imageUrl: topic.content_type === "photo" ? topic.media_url ?? undefined : undefined,
    sourceUrl: topic.media_url ?? undefined,
    contextLabel: `Capacitacion / ${topic.category}`,
  }
}

export async function globalSearch(input: {
  query: string
  userRole: UserRole
  limit?: number
}) {
  const query = input.query.trim()
  if (query.length < 2) return []
  if (isDemoMode()) return searchDemoContent(query).slice(0, input.limit ?? 40)

  const supabase = getSupabaseBrowserClient()
  const fetchLimit = 1000

  const [sectionItemsResponse, trainingResponse] = await Promise.all([
    supabase
      .from("section_items")
      .select(
        "id, section_id, type, title, description, content, image_url, source_url, metadata, updated_at, project_sections(id, project_id, title, type, projects(id, name))",
      )
      .order("updated_at", { ascending: false })
      .limit(fetchLimit),
    supabase
      .from("training_topics")
      .select("id, title, category, summary, body, content_type, media_url, updated_at")
      .order("updated_at", { ascending: false })
      .limit(fetchLimit),
  ])

  if (sectionItemsResponse.error) throw new Error(sectionItemsResponse.error.message)
  if (trainingResponse.error) throw new Error(trainingResponse.error.message)

  return [
    ...(sectionItemsResponse.data ?? []).map(mapSectionResult),
    ...(trainingResponse.data ?? []).map(mapTrainingResult),
  ]
    .filter((result) => includesQuery(result, query))
    .slice(0, input.limit ?? 40)
}
