import { InfoDrawer } from '@/components/layout/InfoDrawer'
import { Logo } from '@/components/layout/Logo'
import { GITHUB_URL, GROQ_PRIVACY_POLICY_URL } from '@/lib/links'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          <div className="flex justify-center sm:justify-start">
            <Logo className="h-8 w-auto" />
          </div>

          <p className="justify-self-center text-center text-xs text-text-muted">
            &copy; {CURRENT_YEAR} PromptTrim. AI Prompt Optimiser
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-5 text-xs text-text-muted sm:justify-self-end">
            <InfoDrawer
              label="About"
              title="About"
              description="What PromptTrim is, and who built it."
            >
              <p>
                PromptTrim turns long, messy AI prompts into short, direct instructions. Paste a
                prompt and it keeps the requirements, constraints and exclusions that matter while
                cutting the filler — so the result works in any AI tool or model, not just one.
              </p>
              <p>
                Built with React, TypeScript, Tailwind CSS and Groq. No accounts, no dashboards —
                paste a prompt and go.
              </p>
              <p>
                PromptTrim is an independent side project by Prabhu Raja. Questions or feedback:{' '}
                <a
                  href="mailto:prabhu_cg@proton.me"
                  className="underline underline-offset-2 hover:text-text"
                >
                  prabhu_cg@proton.me
                </a>
                .
              </p>
            </InfoDrawer>

            <InfoDrawer
              label="Privacy"
              title="Privacy"
              description="How PromptTrim handles your prompts."
            >
              <p>
                Your prompt is sent to Groq's API to generate the optimised version. It is not
                stored or logged by PromptTrim. See{' '}
                <a
                  href={GROQ_PRIVACY_POLICY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-text"
                >
                  Groq's privacy policy
                </a>{' '}
                for how they handle data.
              </p>
              <p>
                There are no accounts, no analytics and no cookies. The only thing PromptTrim
                saves locally in your browser is your light/dark theme preference.
              </p>
            </InfoDrawer>

            <InfoDrawer label="Terms" title="Terms" description="The short version.">
              <p>PromptTrim is provided as-is, free of charge, with no warranty of any kind.</p>
              <p>
                You're responsible for what you paste in and how you use the optimised output.
                Avoid pasting secrets, credentials or personal data you don't want processed by a
                third-party AI provider (Groq).
              </p>
              <p>The tool may change, break or go offline at any time without notice.</p>
            </InfoDrawer>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          Your prompt is sent to Groq to create your optimised prompt. It is not stored or logged.
        </p>
      </div>
    </footer>
  )
}
