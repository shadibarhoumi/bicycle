import { ThemeName } from '@styles/Theme'
import { useState, useEffect } from 'react'
import { isBrowser } from '@lib/isBrowser'

const KEY = 'bicycle-themeName'

export const useThemeName = () => {
  const [themeName, setThemeNameRaw] = useState<ThemeName>('light')
  const setThemeName = (themeName: ThemeName) => {
    localStorage.setItem(KEY, themeName)
    setThemeNameRaw(themeName)
  }

  useEffect(() => {
    if (isBrowser()) {
      const loadedTheme = localStorage.getItem(KEY)
      if (loadedTheme) {
        setThemeName(loadedTheme as ThemeName)
      }
    }
  }, [])

  return { themeName, setThemeName }
}
