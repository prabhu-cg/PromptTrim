import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface InfoDrawerProps {
  label: string
  title: string
  description: string
  children: ReactNode
}

export function InfoDrawer({ label, title, description, children }: InfoDrawerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="transition-colors hover:text-text">
          {label}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-text-muted">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
