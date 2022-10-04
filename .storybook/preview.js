import { THEME } from '../lib/constants'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from '@components/GlobalStyles'

export const decorators = [
  (Story) => (
    <ThemeProvider theme={THEME}>
      <Story />
      <GlobalStyles />
    </ThemeProvider>
  ),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
