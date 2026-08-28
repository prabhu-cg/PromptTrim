import fs from 'node:fs'
import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { extractPromptFromBody, runPromptOptimisation } from './server/optimisePrompt.ts'

// Generous headroom over the 10,000-character limit (worst case ~40KB at
// 4 bytes/char) plus JSON envelope overhead. Vercel's own platform-level
// body size limit is the equivalent guard in production.
const MAX_DEV_REQUEST_BYTES = 100_000

/**
 * Minimal, dependency-free ".env.local" reader for server-only secrets.
 * Reads fresh from disk on every call — Vite's own `loadEnv` is a poor fit
 * here since its cache doesn't reliably invalidate across the file-watch
 * restarts this dev-only middleware relies on.
 */
function readLocalEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}

  const values: Record<string, string> = {}
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[key] = value
  }
  return values
}

/**
 * Serves POST /api/optimise during `vite dev` so the full Paste → Optimise →
 * Copy flow works locally without needing `vercel dev` / a linked Vercel
 * project. In production this file isn't used at all — Vercel serves
 * api/optimise.ts directly as a serverless function.
 */
function promptTrimApiDevPlugin(): Plugin {
  return {
    name: 'prompttrim-api-optimise-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/optimise', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }))
          return
        }

        // Read fresh on every request — .env.local edits then take effect
        // without needing a dev-server restart.
        const localEnv = readLocalEnvFile(path.resolve(import.meta.dirname, '.env.local'))
        for (const [key, value] of Object.entries(localEnv)) {
          process.env[key] = value
        }

        try {
          const chunks: Buffer[] = []
          let totalBytes = 0
          for await (const chunk of req) {
            totalBytes += (chunk as Buffer).length
            if (totalBytes > MAX_DEV_REQUEST_BYTES) {
              res.statusCode = 413
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'Request too large.' }))
              return
            }
            chunks.push(chunk as Buffer)
          }
          const raw = Buffer.concat(chunks).toString('utf-8')
          const body: unknown = raw.length > 0 ? JSON.parse(raw) : {}
          const prompt = extractPromptFromBody(body)

          const outcome = await runPromptOptimisation(prompt)

          res.statusCode = outcome.success ? 200 : outcome.status
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify(
              outcome.success
                ? { success: true, result: outcome.result }
                : { success: false, error: outcome.error },
            ),
          )
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Invalid request.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), promptTrimApiDevPlugin()],
  // Vite's dev server enables permissive CORS by default. Production
  // (api/optimise.ts on Vercel) never sets any Access-Control-* header, so
  // this keeps local dev matching that same-origin-only behaviour.
  server: { cors: false },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
