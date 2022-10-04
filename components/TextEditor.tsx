import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { Handle } from 'use-prosemirror'
import toolbarPlugin from '@features/editor/plugins/toolbarPlugin'
import { basePlugins } from '@features/editor'
import { textSchema } from '@features/editor/schemas/textSchema'
import highlightSpokenWordPlugin from '@features/editor/plugins/highlightSpokenWordPlugin'
import Editor from './Editor'
import { Speaker } from '@features/speaker/Speaker'
import SpeechControls from './SpeechControls'
import { HEAD_LENGTH } from '@features/speaker/Speaker'
import { placeholderPlugin } from '@features/editor/plugins/placeholderPlugin'

interface Props {
  setSelection: (selection: { text: string; type: string }) => void
  setResearchQuery: (researchQuery: string) => void
  incrementSynthesizedChars: (chars: number) => void
}

const getConfig = (
  setSelection: Props['setSelection'],
  setResearchQuery: Props['setResearchQuery'],
  speaker: Speaker,
) => {
  const textEditorPlugins = [
    ...basePlugins,
    toolbarPlugin(setSelection, setResearchQuery, speaker),
    highlightSpokenWordPlugin,
    placeholderPlugin('Add your text here...'),
  ]
  return {
    schema: textSchema,
    plugins: textEditorPlugins,
  }
}

const TextEditor: React.FC<Props> = ({
  setSelection,
  setResearchQuery,
  incrementSynthesizedChars,
}) => {
  // editor state
  const viewRef = useRef<Handle>(null)
  // Google TTS audio
  const googleAudioRef = useRef<HTMLAudioElement>(null)
  // speech state
  const [playing, setPlaying] = useState<boolean>(false)
  const [speechOffset, setSpeechOffset] = useState<number>(0)
  const [speechLength, setSpeechLength] = useState<number>(0)

  const speakerRef = useRef(
    new Speaker(
      setPlaying,
      incrementSynthesizedChars,
      googleAudioRef,
      setSpeechOffset,
      setSpeechLength,
    ),
  )
  const intervalRef = useRef<NodeJS.Timeout>()
  // plugin for scrolling with speech
  const [currentWordYPosition, setCurrentWordYPosition] = useState<number>(0)

  // focus TextEditor on initial render
  useEffect(() => {
    viewRef.current?.view.focus()
  }, [])

  // play / pause speaker when user presses play / pause hardware key
  useEffect(() => {
    navigator.mediaSession.setActionHandler('play', function () {
      speakerRef.current.play()
    })
    navigator.mediaSession.setActionHandler('pause', function () {
      speakerRef.current.pause()
    })
  })

  useEffect(() => {
    if (playing && viewRef.current && speechLength > 0) {
      // dispatch transaction sending offset and length to plugin
      viewRef?.current?.view.dispatch(
        viewRef?.current?.view.state.tr.setMeta(
          'highlightSpokenWordPlugin-Google',
          { speechOffset, speechLength },
        ),
      )
    }
  }, [speechOffset, speechLength, playing])

  // scroll word into view if offscreen
  useEffect(() => {
    const wordCoords = viewRef.current?.view.coordsAtPos(speechOffset)
    if (wordCoords) {
      setCurrentWordYPosition(wordCoords.bottom)
    }
  }, [speechOffset])

  // when playing, dispatch transaction with updated word boundary data to Editor
  // every 50 ms
  useEffect(() => {
    if (playing && viewRef.current && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (speakerRef.current.wordBoundaries.length) {
          const currentTime = speakerRef.current.player?.currentTime || 0
          let boundary
          for (const e of speakerRef.current.wordBoundaries) {
            if (currentTime * 1000 > e.privAudioOffset / 10000) {
              boundary = e
            } else {
              break
            }
          }
          if (!boundary) return
          // dispatch transaction sending boundary event to plugin
          viewRef?.current?.view.dispatch(
            viewRef?.current?.view.state.tr.setMeta(
              highlightSpokenWordPlugin,
              boundary,
            ),
          )
          // scroll word into view if offscreen
          const wordCoords = viewRef.current?.view.coordsAtPos(
            boundary.privTextOffset - HEAD_LENGTH,
          )
          if (wordCoords) {
            setCurrentWordYPosition(wordCoords.bottom)
          }
        }
      }, 50)
    }
    if (!playing && intervalRef.current) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [playing, speakerRef, viewRef])

  // pause on unmount
  useEffect(() => {
    return () => speakerRef.current.pause()
  }, [])

  return (
    <>
      <Editor
        viewRef={viewRef}
        config={getConfig(setSelection, setResearchQuery, speakerRef.current)}
        field="text"
        editable={!playing}
        scrollPos={currentWordYPosition}
        onInitialStateLoad={(state) => {
          speakerRef.current.text =
            ' ' + state.doc.textBetween(0, state.doc.content.size, '  ')
        }}
        onDocChange={(state) => {
          speakerRef.current.text =
            ' ' + state.doc.textBetween(0, state.doc.content.size, '  ')
        }}
        extraControls={
          <SpeechControls playing={playing} speakerRef={speakerRef} />
        }
      />
      <audio ref={googleAudioRef} src={''} />
    </>
  )
}
export default TextEditor
