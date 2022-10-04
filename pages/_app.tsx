import React from 'react'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import GlobalStyles from '@components/GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { LightTheme } from '@styles/LightTheme'
import { DarkTheme } from '@styles/DarkTheme'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@lib/firebase'
import { UserContext } from '@features/user/UserContext'
import { ThemeNameContext } from '@styles/ThemeNameContext'
import { useThemeName } from '@styles/useThemeName'

export default function MyApp({
  Component,
  pageProps,
}: AppProps): React.ReactElement {
  const [user] = useAuthState(auth)
  const { themeName, setThemeName } = useThemeName()
  return (
    <ThemeNameContext.Provider value={{ themeName, setThemeName }}>
      <ThemeProvider theme={themeName === 'light' ? LightTheme : DarkTheme}>
        <UserContext.Provider value={user ?? null}>
          <Component {...pageProps} />
        </UserContext.Provider>
        <Toaster />
        <GlobalStyles />
      </ThemeProvider>
    </ThemeNameContext.Provider>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }
