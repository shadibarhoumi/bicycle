import { useState, useEffect } from 'react'
import { database } from '@lib/firebase'
import { useObject } from 'react-firebase-hooks/database'
import { useWorkspace } from './useWorkspace'

export const useTextAndNotes = (field: 'text' | 'notes') => {
  const { workspaceRef, workspaceSnapshot } = useWorkspace()
  const [dataRef, setDataRef] = useState<any>(null)
  const [dataSnapshot] = useObject(dataRef)

  useEffect(() => {
    const loadText = async () => {
      if (workspaceSnapshot) {
        setDataRef(database.ref(field + '-' + workspaceSnapshot?.id))
      }
    }
    loadText()
  }, [workspaceSnapshot, field])

  return {
    dataSnapshot,
    dataRef,
    workspaceRef,
  }
}
