import { createContext } from 'react'
import type firebase from 'firebase/app'

export const UserContext = createContext<firebase.User | null>(null)
