import { HelpCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const HELP_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is PromptTrim?',
    answer: 'PromptTrim turns long or messy AI prompts into clear, concise prompts.',
  },
  {
    question: 'What does it preserve?',
    answer: 'Requirements, constraints, exclusions and important context.',
  },
  {
    question: 'Can I use the result with different AI tools?',
    answer:
      'Yes. PromptTrim produces universal prompts that can be pasted into different AI models and AI applications.',
  },
  {
    question: 'Does PromptTrim work offline?',
    answer:
      'The interface works in the browser, but AI optimisation requires an internet connection.',
  },
  {
    question: 'Is my prompt stored?',
    answer:
      'No. Your prompt is sent to Gemini to generate the optimised result and is not stored or logged.',
  },
]

export function HelpDrawer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <HelpCircle aria-hidden="true" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
          <DialogDescription>A quick guide to PromptTrim.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {HELP_ITEMS.map((item) => (
            <div key={item.question}>
              <h3 className="text-sm font-semibold text-text">{item.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{item.answer}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
