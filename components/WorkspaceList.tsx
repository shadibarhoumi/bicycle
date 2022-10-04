import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { firestore } from '@lib/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { UserContext } from '@features/user/UserContext'
import { ListLoader } from '@components/ListLoader'
import Workspace from '@models/Workspace'
import Link from 'next/link'
import styled, { useTheme } from 'styled-components'
import UnstyledButton from '@components/UnstyledButton'

const WorkspaceList = () => {
  const user = useContext(UserContext)
  const workspacesRef = firestore
    .collection('users')
    .doc(user?.uid)
    .collection('workspaces')
  const query = workspacesRef.orderBy('createdAt', 'desc')
  const [workspaces, loading] = useCollectionData<Workspace>(query, {
    idField: 'id',
  })
  const theme = useTheme()

  if (loading)
    return (
      <ListLoader style={{ maxWidth: '500px' }} uniqueKey="workspaceLoader" />
    )

  return (
    <Wrapper>
      {workspaces?.map((workspace) => (
        <li key={workspace.id}>
          <Link href={`workspaces/${workspace.id}`}>
            <WorkspaceLink>
              <Left>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  size="2x"
                  color={theme.colors.gray[500]}
                />
                <Metadata>
                  <Title>{workspace.title || 'Untitled'}</Title>
                  <Author>{workspace.author}</Author>
                </Metadata>
              </Left>
              <Right>
                <TrashButton
                  onClick={(e) => {
                    e.preventDefault()
                    if (
                      confirm('Are you sure you want to delete this workspace?')
                    ) {
                      workspacesRef.doc(workspace.id).delete()
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" color="inherit" />
                </TrashButton>
              </Right>
            </WorkspaceLink>
          </Link>
        </li>
      ))}
    </Wrapper>
  )
}
export default WorkspaceList

const Wrapper = styled.ul``

const WorkspaceLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  padding: 20px 0;
  border-bottom: 2px solid
    ${({ theme }) =>
      theme.light ? theme.colors.gray[100] : theme.colors.gray[900]};
  display: flex;
  justify-content: space-between;
`

const Metadata = styled.div`
  margin-left: 24px;
`

const Title = styled.p`
  font-size: ${18 / 16}rem;
  ${WorkspaceLink}:hover & {
    color: var(--color-primary);
  }
`

const Author = styled.p`
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[700] : theme.colors.gray[500]};
  font-size: ${14 / 16}rem;
`

const Right = styled.div``

const Left = styled.div`
  display: flex;
  align-items: center;
`

const TrashButton = styled(UnstyledButton)`
  color: var(--color-gray-500);
  visibility: hidden;
  transition: color 150ms ease;

  ${WorkspaceLink}:hover & {
    visibility: visible;
  }

  &:hover {
    color: var(--color-primary);
  }
`
