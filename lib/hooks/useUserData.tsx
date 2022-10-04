import { useState, useContext, useEffect } from 'react'
import { UserContext } from '@features/user/UserContext'
import { DocRef, firestore } from '@lib/firebase'

export const useUserData = () => {
  const user = useContext(UserContext)
  const [userDataRef, setUserDataRef] = useState<DocRef | null>(null)

  useEffect(() => {
    if (user) {
      setUserDataRef(firestore.collection('users').doc(user?.uid))
    }
  }, [user])

  return { userDataRef }
}
