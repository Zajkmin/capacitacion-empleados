"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isDemoMode, notifyDemoWrite } from "@/lib/demo-mode"

export type AppStorageBucket =
  | "project-covers"
  | "section-images"
  | "documents"
  | "training-media"

function sanitizePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()
  if (fromName && fromName !== file.name) {
    return sanitizePathPart(fromName)
  }

  return file.type.split("/").pop() ?? "bin"
}

export async function uploadPublicFile({
  bucket,
  file,
  folder,
}: {
  bucket: AppStorageBucket
  file: File
  folder: string
}) {
  if (isDemoMode()) {
    notifyDemoWrite()
    const extension = getFileExtension(file)
    const safeFolder = sanitizePathPart(folder) || "uploads"
    const path = `${safeFolder}/demo-${crypto.randomUUID()}.${extension}`

    return {
      path,
      publicUrl: URL.createObjectURL(file),
    }
  }

  const supabase = getSupabaseBrowserClient()
  const extension = getFileExtension(file)
  const safeFolder = sanitizePathPart(folder) || "uploads"
  const fileName = `${crypto.randomUUID()}.${extension}`
  const path = `${safeFolder}/${fileName}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return {
    path,
    publicUrl: data.publicUrl,
  }
}
