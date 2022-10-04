import React from 'react'
import { auth } from '@lib/firebase'

export default function SignOut(): React.ReactElement | null {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
}
