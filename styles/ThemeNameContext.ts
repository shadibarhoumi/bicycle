import { createContext } from 'react'
import { ThemeName } from './Theme'

export const ThemeNameContext = createContext<{
  themeName: ThemeName
  setThemeName: (name: ThemeName) => void
}>({
  themeName: 'light',
  setThemeName: () => {
    return undefined
  },
})
