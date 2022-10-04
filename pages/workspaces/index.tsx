import styled from 'styled-components'
import AppLayout from '@components/AppLayout'
import PageWrapper from '@components/PageWrapper'
import { UserContext } from '@features/user/UserContext'
import { useContext } from 'react'
import UnstyledButton from '@components/UnstyledButton'
import { useRouter } from 'next/router'
import { firestore } from '@lib/firebase'
import WorkspaceList from '@components/WorkspaceList'
import Workspace from '@models/Workspace'

const createWorkspace = async (userId?: string) => {
  const workspace = await firestore
    .collection('users')
    .doc(userId)
    .collection('workspaces')
    .add({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: '',
      author: '',
      notesScrollTop: 0,
      textScrollTop: 0,
      textPercentComplete: 0,
    } as Omit<Workspace, 'id'>)
  return workspace.id
}

export default function WorkspacesPage() {
  const user = useContext(UserContext)
  const router = useRouter()

  return (
    <AppLayout>
      <PageWrapper>
        <TopBar>
          <Heading>Documents</Heading>
          <AddButton
            onClick={async () => {
              const workspaceId = await createWorkspace(user?.uid)
              router.push(`/workspaces/${workspaceId}`)
            }}
          >
            + New Document
          </AddButton>
        </TopBar>
        <WorkspaceList />
      </PageWrapper>
    </AppLayout>
  )
}

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 36px;
`

const Heading = styled.h1`
  font-size: ${24 / 16}rem;
  font-weight: ${({ theme }) => theme.weights.normal};
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[700] : theme.colors.gray[300]};
`

const AddButton = styled(UnstyledButton)`
  color: var(--color-white);
  background-color: var(--color-primary);
  font-weight: ${({ theme }) => theme.weights.medium};
  padding: 6px 12px;
  border-radius: 4px;
  transition: filter 50ms;

  &:hover {
    filter: brightness(110%);
  }
`
