import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@lib/firebase'
import type firebase from 'firebase/app'

export const useUser = (): firebase.User | null | undefined => {
  const [user] = useAuthState(auth)
  return user
}
