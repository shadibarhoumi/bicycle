import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBook,
  faPencilRuler,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import UnstyledButton from '@components/UnstyledButton'
import styled from 'styled-components'
import TextEditor from '@components/TextEditor'
import NotesEditor from '@components/NotesEditor'
import ResearchBar from '@components/ResearchBar/ResearchBar'
import firebase from '@lib/firebase'
import { useUserData } from '@lib/hooks/useUserData'
import { ThemeNameContext } from '@styles/ThemeNameContext'
import { useWorkspace } from '@features/editor/hooks/useWorkspace'

export default function LearnPage() {
  const [selection, setSelection] = useState<{ text: string; type: string }>({
    text: '',
    type: '',
  })
  const [notesOpen, setNotesOpen] = useState<boolean>(false)
  const [researchQuery, setResearchQuery] = useState<string>()
  const [charsToIncrement, setCharsToIncrement] = useState<{ chars: number }>({
    chars: 0,
  })
  const [researchBarOpen, setResearchBarOpen] = useState<boolean>(false)
  const { userDataRef } = useUserData()
  const { themeName, setThemeName } = useContext(ThemeNameContext)
  const { workspaceSnapshot, workspaceRef } = useWorkspace()

  // used to track number of chars synthesized
  useEffect(() => {
    if (userDataRef && charsToIncrement.chars > 0) {
      const increment = firebase.firestore.FieldValue.increment(
        charsToIncrement.chars,
      )
      userDataRef?.update({ synthesizedChars: increment })
    }
  }, [charsToIncrement, userDataRef])

  // open research bar when a new research query is set
  useEffect(() => {
    if (researchQuery) {
      setResearchBarOpen(true)
    }
  }, [researchQuery])

  useEffect(() => {
    if (workspaceSnapshot) {
      const workspaceData = workspaceSnapshot?.data()
      const loadedNotesOpen = workspaceData?.notesOpen || false
      setNotesOpen(loadedNotesOpen)
    }
  }, [workspaceSnapshot, setNotesOpen])

  return (
    <Wrapper>
      <TextEditor
        setSelection={setSelection}
        setResearchQuery={setResearchQuery}
        incrementSynthesizedChars={(chars: number) => {
          setCharsToIncrement({ chars })
        }}
      />
      <NotesEditor selection={selection} isOpen={notesOpen} />
      <Link href="/workspaces">
        <HomeButton>
          <FontAwesomeIcon icon={faHome} size="lg" color="inherit" />
        </HomeButton>
      </Link>
      <NotesButton
        onClick={() => {
          const updatedValue = !notesOpen
          setNotesOpen(updatedValue)
          workspaceRef?.update({ notesOpen: updatedValue })
        }}
      >
        <FontAwesomeIcon icon={faPencilRuler} size="lg" color="inherit" />
      </NotesButton>
      <ResearchBarButton onClick={() => setResearchBarOpen((open) => !open)}>
        <FontAwesomeIcon icon={faBook} size="lg" color="inherit" />
      </ResearchBarButton>
      <ThemeButton
        onClick={() => setThemeName(themeName === 'light' ? 'dark' : 'light')}
      >
        {themeName === 'light' ? (
          <FontAwesomeIcon icon={faMoon} size="lg" color="inherit" />
        ) : (
          <FontAwesomeIcon icon={faSun} size="lg" color="inherit" />
        )}
      </ThemeButton>
      <ResearchBar
        researchQuery={researchQuery}
        onClose={() => setResearchBarOpen(false)}
        isOpen={researchBarOpen}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  height: 100%;
`

const ToolbarButton = styled(UnstyledButton)`
  position: absolute;
  left: calc();
  cursor: pointer;
  padding: 8px;
  color: var(--color-gray-400);
  transition: color 100ms ease;
  --button-height: 40px;
  --button-top-margin: 8px;

  &:hover {
    color: var(--color-primary);
  }
`

const HomeButton = styled(ToolbarButton)`
  top: var(--button-top-margin);
`

const NotesButton = styled(ToolbarButton)`
  top: calc(
    var(--button-top-margin) + var(--button-height) + var(--button-top-margin)
  );
`

const ResearchBarButton = styled(ToolbarButton)`
  top: calc(
    var(--button-top-margin) * 2 + var(--button-height) * 2 +
      var(--button-top-margin)
  );
`

const ThemeButton = styled(ToolbarButton)`
  top: calc(
    var(--button-top-margin) * 3 + var(--button-height) * 3 +
      var(--button-top-margin)
  );
`
