import styled, { keyframes, useTheme } from 'styled-components'
import type { Handle } from 'use-prosemirror'
import MetadataEditor from './MetadataEditor'
import type { DocRef } from '@lib/firebase'
import { ListLoader } from '@components/ListLoader'
import formatter from '@lib/formatter'
import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import Workspace from '@models/Workspace'
import toast from 'react-hot-toast'
import { ScrollbarStyles } from '@styles/ScrollbarStyles'

interface Props {
  viewRef: React.RefObject<Handle>
  workspaceRef: DocRef
  saving: boolean
  edited: boolean
  scrollPos?: number
  loading: boolean
  type: 'text' | 'notes'
  extraControls: React.ReactNode
}

const EditorUI: React.FC<Props> = ({
  viewRef,
  workspaceRef,
  loading,
  type,
  extraControls,
  scrollPos,
  children,
}) => {
  const [scrollPercent, setScrollPercent] = useState<number>(0)
  const [barCenter, setBarCenter] = useState<number>(8)
  const [scrollPercentVisible, setScrollPercentVisible] = useState<boolean>(
    false,
  )
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const scrollPercentageRef = useRef<HTMLSpanElement>(null)
  const fadeOutRef = useRef<NodeJS.Timeout>()
  const scrolling = useRef<boolean>(false)
  const theme = useTheme()

  // load scroll state
  useEffect(() => {
    const loadData = async () => {
      if (workspaceRef && !loading) {
        const workspace = (await (await workspaceRef.get()).data()) as Workspace
        const scrollTop =
          type === 'text' ? workspace.textScrollTop : workspace.notesScrollTop
        if (editorWrapperRef.current) {
          editorWrapperRef.current?.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
        if (
          type === 'text' &&
          (workspace.textScrollTop > 0 || workspace.notesScrollTop > 0)
        ) {
          toast('Resuming at your most recent position.', {
            style: {
              border: theme.colors.gray[700],
              backgroundColor: theme.colors.toolbarBackground,
              color: theme.colors.toolbarText,
            },
          })
        }
      }
    }
    loadData()
  }, [workspaceRef, loading, type])

  useEffect(() => {
    if (scrollPos && editorWrapperRef.current && !scrolling.current) {
      const scrollTop = editorWrapperRef.current?.scrollTop
      const clientHeight = editorWrapperRef.current?.clientHeight
      if (scrollPos < 0 || scrollPos > clientHeight * 0.4) {
        const scrollTo = scrollTop + scrollPos - clientHeight * 0.25
        editorWrapperRef.current?.scrollTo({
          top: scrollTo,
          behavior: 'smooth',
        })
        scrolling.current = true
        setTimeout(() => {
          scrolling.current = false
        }, 3000)
      }
    }
  }, [scrollPos, editorWrapperRef, scrolling])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFadeOut = useCallback(
    debounce(async () => {
      if (fadeOutRef.current) {
        clearTimeout(fadeOutRef.current)
      }
      fadeOutRef.current = setTimeout(() => {
        setScrollPercentVisible(false)
      }, 1000)
    }, 800),
    [fadeOutRef],
  )

  const syncScrollState = useCallback(
    debounce(async (scrollTop: number) => {
      if (workspaceRef) {
        workspaceRef.update({ [type + 'ScrollTop']: scrollTop })
      }
    }, 250),
    [workspaceRef],
  )

  return (
    <Pane
      onClick={() => {
        viewRef.current?.view.focus()
      }}
    >
      {type === 'text' && (
        <ScrollPercent
          ref={scrollPercentageRef}
          visible={scrollPercentVisible}
          style={{
            '--top': scrollPercentageRef.current
              ? barCenter - scrollPercentageRef.current?.clientHeight / 2 + 'px'
              : barCenter,
            '--opacity': scrollPercentVisible ? '1' : '0',
          }}
        >
          {formatter.format(scrollPercent)}
        </ScrollPercent>
      )}
      <EditorWrapper
        ref={editorWrapperRef}
        onScroll={(e) => {
          const el = e.target as HTMLDivElement
          const scrollPercent =
            el.scrollTop / (el.scrollHeight - el.clientHeight)
          setScrollPercent(scrollPercent)
          let barHeight = (el.clientHeight / el.scrollHeight) * el.clientHeight
          if (barHeight < 16) {
            barHeight = 16
          }
          const barTop = scrollPercent * (el.clientHeight - barHeight)
          setBarCenter(barTop + barHeight / 2)
          setScrollPercentVisible(true)
          setFadeOut()
          syncScrollState(el.scrollTop)
        }}
        style={{
          '--left-padding': type === 'text' ? '48px' : '48px',
          '--right-padding': type === 'notes' ? '96px' : '48px',
        }}
      >
        {type === 'text' && (
          <div
            style={{
              maxWidth: 'var(--text-editor-max-width)',
              margin: '0 auto',
            }}
          >
            <MetadataEditor viewRef={viewRef} workspaceRef={workspaceRef} />
          </div>
        )}
        {loading ? <ListLoader uniqueKey={`${type}Loader`} /> : children}
      </EditorWrapper>
      {/* <StatusMessage>
        {loading
          ? 'Loading...'
          : edited
          ? saving
            ? 'Saving your work...'
            : 'Saved just now'
          : 'Standing By...'}
      </StatusMessage> */}
      {extraControls}
    </Pane>
  )
}
export default EditorUI

const Pane = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.transitions.themeSwitch};
  flex: 1;
  width: 0px;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
`
const EditorWrapper = styled.div`
  overflow: auto;
  height: 100%;
  padding-top: 78px;
  padding-left: var(--left-padding);
  padding-right: var(--right-padding);

  ${ScrollbarStyles};
`

const fadeIn = keyframes`
  from { opacity: 0; }
	to { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const ScrollPercent = styled.span<{ visible: boolean }>`
  color: var(--color-primary);
  width: 48px;
  visibility: ${(p) => (p.visible ? 'visible' : 'hidden')};
  animation: ${(p) => (p.visible ? fadeIn : fadeOut)} 200ms ease;
  transition: visibility 200ms ease;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weights.medium};
  position: absolute;
  top: var(--top);
  right: 8px;
  pointer-events: none;
`
