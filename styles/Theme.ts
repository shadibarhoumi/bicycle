import type { FlattenSimpleInterpolation } from 'styled-components'

export type ThemeName = 'light' | 'dark'

interface ThemeColors {
  // base colors
  gray: {
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    900: string
  }

  white: string
  black: string
  primary: string
  secondary: string
  // themed colors
  background: string
  text: string
  highlightWord: string
  speechControlsBackground: string
  speechControlsText: string
  toolbarText: string
  toolbarBackground: string
  researchBarBackground: string
  loaderBackground: string
  loaderForeground: string
}

export interface Theme {
  name: ThemeName
  light: boolean
  colors: ThemeColors
  breakpoints: {
    phone: number
    tablet: number
    laptop: number
  }
  queries: {
    phoneAndSmaller: string
    tabletAndSmaller: string
    laptopAndSmaller: string
  }
  weights: {
    thin: number
    normal: number
    medium: number
    bold: number
  }
  transitions: {
    themeSwitch: FlattenSimpleInterpolation
  }
}
