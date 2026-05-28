"use client"

import { useRef, useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ConfirmActionOptions = {
  title: string
  description: string
  confirmLabel?: string
  requiredText?: string
}

type PendingConfirm = ConfirmActionOptions & {
  typedText: string
}

export function useConfirmAction() {
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null)
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null)

  const closeConfirm = (confirmed: boolean) => {
    resolverRef.current?.(confirmed)
    resolverRef.current = null
    setPendingConfirm(null)
  }

  const confirmAction = (options: ConfirmActionOptions) =>
    new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
      setPendingConfirm({ ...options, typedText: "" })
    })

  const requiredText = pendingConfirm?.requiredText ?? ""
  const canConfirm =
    !requiredText || pendingConfirm?.typedText.trim() === requiredText

  const confirmDialog = (
    <Dialog
      open={Boolean(pendingConfirm)}
      onOpenChange={(open) => {
        if (!open) closeConfirm(false)
      }}
    >
      <DialogContent showCloseButton={false}>
        {pendingConfirm ? (
          <>
            <DialogHeader>
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle>{pendingConfirm.title}</DialogTitle>
              <DialogDescription>{pendingConfirm.description}</DialogDescription>
            </DialogHeader>

            {requiredText ? (
              <div className="grid gap-2">
                <label htmlFor="confirm-required-text" className="text-sm font-medium">
                  Escribe <span className="font-semibold text-foreground">{requiredText}</span> para confirmar
                </label>
                <Input
                  id="confirm-required-text"
                  value={pendingConfirm.typedText}
                  onChange={(event) =>
                    setPendingConfirm((current) =>
                      current
                        ? { ...current, typedText: event.target.value }
                        : current,
                    )
                  }
                  autoComplete="off"
                  autoFocus
                />
              </div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeConfirm(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => closeConfirm(true)}
                disabled={!canConfirm}
              >
                {pendingConfirm.confirmLabel ?? "Confirmar"}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )

  return { confirmAction, confirmDialog }
}
