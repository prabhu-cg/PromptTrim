import { Globe, ListChecks, Lock, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Reason {
  icon: LucideIcon
  title: string
  body: string
}

const REASONS: Reason[] = [
  {
    icon: ListChecks,
    title: 'Keeps what matters',
    body: 'Preserves requirements, constraints and exclusions — cuts only the fluff.',
  },
  {
    icon: Globe,
    title: 'Works everywhere',
    body: 'Plain text output. Paste it into any AI model or tool.',
  },
  {
    icon: Lock,
    title: 'Nothing stored',
    body: 'Your prompt is never logged or saved.',
  },
  {
    icon: Zap,
    title: 'Free, no sign-up',
    body: 'No account, no API key. Just paste and go.',
  },
]

export function WhySection() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:mt-16 sm:grid-cols-2 sm:pt-10 lg:grid-cols-4">
      {REASONS.map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex flex-col gap-2">
          <Icon className="size-5 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          <p className="text-sm text-text-muted">{body}</p>
        </div>
      ))}
    </div>
  )
}
