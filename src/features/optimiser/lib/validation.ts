import { z } from 'zod'

export const PROMPT_MAX_LENGTH = 10_000

/** Character count at which the counter switches to a "near limit" warning. */
export const PROMPT_WARNING_LENGTH = 9_000

export const promptSchema = z
  .string()
  .max(PROMPT_MAX_LENGTH, {
    message: `Prompt exceeds the ${PROMPT_MAX_LENGTH.toLocaleString()}-character limit.`,
  })
  .refine((value) => value.trim().length > 0, {
    message: 'Enter a prompt before optimising.',
  })

export function validatePrompt(value: string): string | null {
  const result = promptSchema.safeParse(value)
  if (result.success) {
    return null
  }
  return result.error.issues[0]?.message ?? 'Enter a valid prompt.'
}
