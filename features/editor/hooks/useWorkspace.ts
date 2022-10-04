import { useContext, useState, useEffect } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'
import { firestore } from '@lib/firebase'
import { UserContext } from '@features/user/UserContext'
import { useRouter } from 'next/router'

export const useWorkspace = () => {
  const router = useRouter()
  const { workspaceId } = router.query
  const user = useContext(UserContext)
  const [workspaceRef, setWorkspaceRef] = useState<any>(null)
  const [workspaceSnapshot, loadingWorkspace] = useDocumentOnce(workspaceRef)

  useEffect(() => {
    if (user && workspaceId) {
      setWorkspaceRef(
        firestore
          .collection('users')
          .doc(user?.uid)
          .collection('workspaces')
          .doc(workspaceId as string),
      )
    }
  }, [user, workspaceId])

  return {
    loadingWorkspace,
    workspaceRef,
    workspaceSnapshot,
  }
}
