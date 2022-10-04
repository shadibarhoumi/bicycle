import { auth, firestore } from '@lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'
import type { Dispatch } from 'redux'
import { setUser, setUsername } from '@features/user/userSlice'
import { RootState } from '@features/store'
import { useSelector } from 'react-redux'

export const fetchUserData = (dispatch: Dispatch) => {
  const [user] = useAuthState(auth)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe
    if (user) {
      const { uid, displayName, photoURL } = user
      dispatch(setUser({ uid, displayName, photoURL }))
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        dispatch(setUsername(doc.data()?.username))
      })
    } else {
      dispatch(setUser(null))
      dispatch(setUsername(null))
    }
    return unsubscribe
  }, [user])
}

export const useUser = () => {
  const user = useSelector((state: RootState) => state.user)
  return user
}
