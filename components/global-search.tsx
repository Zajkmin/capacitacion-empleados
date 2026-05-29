"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BookOpen,
  Camera,
  FileText,
  FolderOpen,
  GraduationCap,
  Image,
  Lightbulb,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserRole } from "@/lib/roles-permissions"
import {
  globalSearch,
  type GlobalSearchResult,
  type GlobalSearchResultType,
} from "@/lib/supabase/search"

interface GlobalSearchProps {
  isOpen: boolean
  userRole: UserRole
  onClose: () => void
  onNavigateToResult: (result: GlobalSearchResult) => void
}

const typeLabels: Record<GlobalSearchResultType, string> = {
  rule: "Regla",
  exception: "Excepcion",
  photo: "Foto guia",
  error: "Error frecuente",
  update: "Actualizacion",
  library: "Biblioteca",
  "visual-learning": "Aprendizaje visual",
  training: "Capacitacion",
}

const typeIcons = {
  rule: BookOpen,
  exception: AlertTriangle,
  photo: Camera,
  error: AlertTriangle,
  update: RefreshCw,
  library: FolderOpen,
  "visual-learning": Lightbulb,
  training: GraduationCap,
}

function compactText(value?: string, maxLength = 180) {
  const cleanValue = value?.replace(/\s+/g, " ").trim()
  if (!cleanValue) return ""
  return cleanValue.length > maxLength
    ? `${cleanValue.slice(0, maxLength).trim()}...`
    : cleanValue
}

export function GlobalSearch({
  isOpen,
  userRole,
  onClose,
  onNavigateToResult,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GlobalSearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
      setSelectedResult(null)
      setErrorMessage("")
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const cleanQuery = query.trim()
    if (cleanQuery.length < 2) {
      setResults([])
      setSelectedResult(null)
      setIsLoading(false)
      return
    }

    let isCurrentSearch = true
    setIsLoading(true)
    setErrorMessage("")

    const timeoutId = window.setTimeout(() => {
      globalSearch({ query: cleanQuery, userRole })
        .then((searchResults) => {
          if (!isCurrentSearch) return
          setResults(searchResults)
          setSelectedResult((currentResult) =>
            currentResult &&
            searchResults.some((result) => result.id === currentResult.id)
              ? currentResult
              : searchResults[0] ?? null,
          )
        })
        .catch((error) => {
          if (!isCurrentSearch) return
          setErrorMessage(
            error instanceof Error ? error.message : "No se pudo buscar contenido.",
          )
          setResults([])
          setSelectedResult(null)
        })
        .finally(() => {
          if (isCurrentSearch) setIsLoading(false)
        })
    }, 250)

    return () => {
      isCurrentSearch = false
      window.clearTimeout(timeoutId)
    }
  }, [isOpen, query, userRole])

  const resultGroups = useMemo(() => {
    return results.reduce<Record<string, GlobalSearchResult[]>>((groups, result) => {
      const label = typeLabels[result.type]
      groups[label] = [...(groups[label] ?? []), result]
      return groups
    }, {})
  }, [results])

  if (!isOpen) return null

  const selectedIcon = selectedResult ? typeIcons[selectedResult.type] : Image
  const SelectedIcon = selectedIcon

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar regla, excepcion, foto guia o capacitacion"
              className="h-11 pl-9"
            />
          </div>
          <Button type="button" variant="outline" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {errorMessage ? (
          <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto border-b border-border lg:border-b-0 lg:border-r">
            {query.trim().length < 2 ? (
              <div className="p-6 text-sm text-muted-foreground">
                Escribi al menos dos letras para buscar en reglas, excepciones,
                fotos guia, biblioteca y capacitacion.
              </div>
            ) : isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Buscando...</div>
            ) : results.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No se encontraron coincidencias.
              </div>
            ) : (
              <div className="p-3">
                {Object.entries(resultGroups).map(([groupName, groupResults]) => (
                  <section key={groupName} className="mb-4 last:mb-0">
                    <h3 className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">
                      {groupName}
                    </h3>
                    <div className="space-y-1">
                      {groupResults.map((result) => {
                        const Icon = typeIcons[result.type]
                        const isSelected = selectedResult?.id === result.id

                        return (
                          <button
                            key={`${result.type}-${result.id}`}
                            type="button"
                            onClick={() => setSelectedResult(result)}
                            className={`flex w-full min-w-0 gap-3 rounded-lg p-3 text-left transition-colors ${
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-accent"
                            }`}
                          >
                            <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-card border border-border">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground">
                                {result.title}
                              </span>
                              <span className="mt-1 block truncate text-xs text-muted-foreground">
                                {result.contextLabel || typeLabels[result.type]}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </aside>

          <main className="min-h-0 overflow-y-auto p-4 sm:p-6">
            {selectedResult ? (
              <article className="mx-auto max-w-3xl">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SelectedIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary">
                      {typeLabels[selectedResult.type]}
                    </p>
                    <h2 className="break-words text-2xl font-semibold text-foreground [overflow-wrap:anywhere]">
                      {selectedResult.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedResult.contextLabel}
                    </p>
                  </div>
                </div>

                {selectedResult.imageUrl ? (
                  <div className="mb-5 overflow-hidden rounded-lg border border-border bg-card">
                    <img
                      src={selectedResult.imageUrl}
                      alt=""
                      className="max-h-[360px] w-full object-contain bg-black"
                    />
                  </div>
                ) : null}

                <div className="space-y-4 rounded-lg border border-border bg-card p-4">
                  {selectedResult.description ? (
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
                      {selectedResult.description}
                    </p>
                  ) : null}
                  {selectedResult.content ? (
                    <p className="whitespace-pre-line break-words border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                      {compactText(selectedResult.content, 900)}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {selectedResult.projectId && selectedResult.sectionId ? (
                    <Button
                      type="button"
                      onClick={() => {
                        onNavigateToResult(selectedResult)
                        onClose()
                      }}
                    >
                      Abrir seccion
                    </Button>
                  ) : null}
                  {selectedResult.sourceUrl ? (
                    <Button asChild type="button" variant="outline">
                      <a href={selectedResult.sourceUrl} target="_blank" rel="noreferrer">
                        Abrir recurso
                      </a>
                    </Button>
                  ) : null}
                </div>
              </article>
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center text-center text-sm text-muted-foreground">
                Selecciona un resultado para ver su detalle.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
