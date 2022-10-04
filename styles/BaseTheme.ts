import { Theme } from './Theme'
import { css } from 'styled-components'

const BREAKPOINTS = {
  phone: 600,
  tablet: 950,
  laptop: 1300,
}

export const COLORS = {
  gray: {
    100: '185deg 5% 95%',
    200: '188deg 5% 87%',
    300: '190deg 5% 80%',
    400: '193deg 4% 70%',
    500: '196deg 4% 60%',
    600: '205deg 4% 50%',
    700: '220deg 5% 40%',
    900: '220deg 3% 20%',
  },
  white: '0deg 0% 100%',
  black: '0deg 0% 0%',
  primary: '340deg 88% 57%',
  secondary: '240deg 60% 63%',
  toolbarText: 'hsl(210deg 11% 78%)',
}

export const baseColors = {
  gray: {
    100: `hsl(${COLORS.gray[100]})`,
    200: `hsl(${COLORS.gray[200]})`,
    300: `hsl(${COLORS.gray[300]})`,
    400: `hsl(${COLORS.gray[400]})`,
    500: `hsl(${COLORS.gray[500]})`,
    600: `hsl(${COLORS.gray[600]})`,
    700: `hsl(${COLORS.gray[700]})`,
    900: `hsl(${COLORS.gray[900]})`,
  },

  // colors that don't change with theme
  white: `hsl(${COLORS.white})`,
  black: `hsl(${COLORS.black})`,
  primary: `hsl(${COLORS.primary})`,
  secondary: `hsl(${COLORS.secondary})`,
}

export const BaseTheme: Pick<
  Theme,
  'breakpoints' | 'queries' | 'weights' | 'transitions'
> = {
  breakpoints: {
    ...BREAKPOINTS,
  },
  queries: {
    phoneAndSmaller: `(max-width: ${BREAKPOINTS.phone / 16}rem)`,
    tabletAndSmaller: `(max-width: ${BREAKPOINTS.tablet / 16}rem)`,
    laptopAndSmaller: `(max-width: ${BREAKPOINTS.laptop / 16}rem)`,
  },
  weights: {
    thin: 300,
    normal: 500,
    medium: 600,
    bold: 800,
  },
  transitions: {
    themeSwitch: css`
      transition-property: background-color, color;
      transition-duration: 200ms;
    `,
  },
}
