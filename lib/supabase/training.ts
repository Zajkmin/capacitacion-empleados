"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/roles-permissions"
import {
  deleteDemoTrainingTopic,
  listDemoTrainingTopics,
  saveDemoTrainingTopic,
} from "@/lib/demo-data"
import { isDemoMode } from "@/lib/demo-mode"

export type TrainingContentType = "text" | "photo" | "video" | "link" | "pdf"

export interface TrainingTopicRecord {
  id: string
  title: string
  category: UserRole | "general"
  order: number
  summary: string
  body: string
  contentType: TrainingContentType
  mediaUrl?: string
  visibleTo: UserRole[]
  updatedAt: string
}

function mapTrainingTopic(topic: {
  id: string
  title: string
  category: string
  summary: string
  body: string
  content_type: string
  media_url: string | null
  visible_to: string[]
  sort_order: number
  updated_at: string
}): TrainingTopicRecord {
  return {
    id: topic.id,
    title: topic.title,
    category: topic.category as UserRole | "general",
    order: topic.sort_order,
    summary: topic.summary,
    body: topic.body,
    contentType: topic.content_type as TrainingContentType,
    mediaUrl: topic.media_url ?? undefined,
    visibleTo: topic.visible_to as UserRole[],
    updatedAt: topic.updated_at.split("T")[0],
  }
}

export async function listTrainingTopics() {
  if (isDemoMode()) return listDemoTrainingTopics()

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("training_topics")
    .select(
      "id, title, category, summary, body, content_type, media_url, visible_to, sort_order, updated_at",
    )
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })

  if (error) throw new Error(error.message)

  return data.map(mapTrainingTopic)
}

export async function saveTrainingTopic(input: {
  id?: string
  title: string
  category: UserRole | "general"
  order: number
  summary: string
  body: string
  contentType: TrainingContentType
  mediaUrl?: string
  visibleTo: UserRole[]
  userId?: string
}) {
  if (isDemoMode()) return saveDemoTrainingTopic(input)

  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("training_topics")
    .upsert({
      ...(input.id
        ? { id: input.id, updated_by: input.userId ?? null }
        : { created_by: input.userId ?? null }),
      title: input.title,
      category: input.category,
      summary: input.summary,
      body: input.body,
      content_type: input.contentType,
      media_url: input.mediaUrl ?? null,
      visible_to: input.visibleTo,
      sort_order: input.order,
    })
    .select(
      "id, title, category, summary, body, content_type, media_url, visible_to, sort_order, updated_at",
    )
    .single()

  if (error) throw new Error(error.message)

  return mapTrainingTopic(data)
}

export async function deleteTrainingTopic(topicId: string) {
  if (isDemoMode()) {
    deleteDemoTrainingTopic(topicId)
    return
  }

  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase
    .from("training_topics")
    .delete()
    .eq("id", topicId)

  if (error) throw new Error(error.message)
}
