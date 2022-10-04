import * as CSS from 'csstype'

declare module 'csstype' {
  interface Properties {
    // allow any property (to allow for passing CSS custom properties into styled-components)
    [index: string]: any
  }
}
