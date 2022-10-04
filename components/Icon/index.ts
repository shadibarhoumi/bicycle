import { SVGAttributes } from 'react'

export { Mouth } from './icons/Mouth'
export { PersonSpeaking } from './icons/PersonSpeaking'

export interface IconProps extends SVGAttributes<SVGElement> {
  color?: string
  size?: string | number
}
