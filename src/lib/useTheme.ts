import { useCallback, useEffect, useState } from 'react'

import { applyTheme, getStoredTheme, getSystemTheme, storeTheme, type Theme } from '@/lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light'
      storeTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
