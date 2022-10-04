import { Theme } from './Theme'
import { BaseTheme, baseColors, COLORS } from './BaseTheme'

export const LightTheme: Theme = {
  name: 'light',
  light: true,
  ...BaseTheme,
  colors: {
    ...baseColors,
    background: baseColors.white,
    text: baseColors.black,
    highlightWord: `hsl(${COLORS.primary} / 0.15)`,
    toolbarBackground: 'hsl(206deg 32% 15%)',
    toolbarText: COLORS.toolbarText,
    speechControlsBackground: baseColors.white,
    speechControlsText: baseColors.gray[700],
    researchBarBackground: baseColors.gray[100],
    loaderBackground: baseColors.gray[100],
    loaderForeground: baseColors.white,
  },
}
