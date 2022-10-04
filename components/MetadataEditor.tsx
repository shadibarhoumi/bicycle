import React, { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useTheme } from 'styled-components'
import debounce from 'lodash.debounce'
import type { Handle } from 'use-prosemirror'
import { useState } from 'react'
import { ListLoader } from '@components/ListLoader'
import { DocRef } from '@lib/firebase'
import Workspace from '@models/Workspace'

interface Props {
  viewRef: React.RefObject<Handle>
  workspaceRef: DocRef
}

const MetadataEditor: React.FC<Props> = ({ viewRef, workspaceRef }) => {
  const [title, setTitle] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const authorInputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const loadData = async () => {
      if (workspaceRef) {
        const { title, author } = (await (
          await workspaceRef.get()
        ).data()) as Workspace
        setTitle(title)
        setAuthor(author)
        setLoading(false)
      }
    }
    loadData()
  }, [workspaceRef])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const syncMetadata = useCallback(
    debounce(async (dataToSync: { title?: string; author?: string }) => {
      if (workspaceRef) {
        workspaceRef.update(dataToSync)
      }
    }, 500),
    [workspaceRef],
  )

  if (loading) return <ListLoader uniqueKey="metadataLoader" />

  return (
    <Wrapper>
      <TitleWrapper
        style={{
          '--color': theme.colors.gray[900],
          '--font-size': 'calc(32 / 16 * 1rem)',
          '--margin-bottom': '8px',
        }}
      >
        <TitleInput
          value={title}
          placeholder="Title here"
          onChange={(e) => {
            setTitle(e.target.value)
            syncMetadata({ title: e.target.value })
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
              authorInputRef.current?.focus()
            }
          }}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const target = e.target as HTMLInputElement
            target.select()
          }}
          type="text"
        />
      </TitleWrapper>
      <AuthorWrapper
        style={{
          '--font-size': 'calc(18 / 16 * 1rem)',
          '--margin-bottom': '48px',
        }}
      >
        <AuthorInput
          ref={authorInputRef}
          value={author}
          placeholder="Author here"
          onChange={(e) => {
            setAuthor(e.target.value)
            syncMetadata({ author: e.target.value })
          }}
          onClick={(e) => {
            e.stopPropagation()
            const target = e.target as HTMLInputElement
            target.select()
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
              viewRef.current?.view.focus()
            }
          }}
          type="text"
        />
      </AuthorWrapper>
    </Wrapper>
  )
}
export default MetadataEditor

const Wrapper = styled.div`
  background-color: var(--color-text-editor-background);
  color: ${({ theme }) => theme.colors.text};
`

const TitleWrapper = styled.div``
const AuthorWrapper = styled.div``

const BaseInput = styled.input`
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  width: 100%;
  background-color: var(--color-text-editor-background);
`

const TitleInput = styled(BaseInput)`
  font-weight: ${({ theme }) => theme.weights.thin};
  font-size: var(--font-size);
  margin-bottom: var(--margin-bottom);
  color: inherit;
`

const AuthorInput = styled(BaseInput)`
  font-size: var(--font-size);
  margin-bottom: var(--margin-bottom);
  color: inherit;
`
