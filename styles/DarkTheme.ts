import { Theme } from './Theme'
import { BaseTheme, baseColors, COLORS } from './BaseTheme'

const darkColors = {
  // used for researchBar, toolbar, speechControls in dark mode
  controlBackground: 'hsl(210deg 46% 15%)',
  background: 'hsl(206deg 32% 5%)',
}

export const DarkTheme: Theme = {
  name: 'dark',
  ...BaseTheme,
  colors: {
    ...baseColors,
    background: darkColors.background,
    text: baseColors.gray[200],
    highlightWord: `hsl(${COLORS.primary} / 0.6)`,
    toolbarBackground: darkColors.controlBackground,
    toolbarText: COLORS.toolbarText,
    speechControlsBackground: darkColors.controlBackground,
    speechControlsText: COLORS.toolbarText,
    researchBarBackground: darkColors.background,
    loaderBackground: baseColors.gray[900],
    loaderForeground: baseColors.gray[700],
  },
  light: false,
}
