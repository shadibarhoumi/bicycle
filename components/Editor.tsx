import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import EditorUI from './EditorUI'
import { ProseMirror, useProseMirror, Handle } from 'use-prosemirror'
import debounce from 'lodash.debounce'
import { EditorState } from 'prosemirror-state'
import type { Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import { useTextAndNotes } from '@features/editor/hooks/useTextAndNotes'

interface Props {
  field: 'notes' | 'text'
  config: {
    schema: Schema<any, any>
    plugins?: Plugin<any, Schema<any, any>>[] | null | undefined
  }
  viewRef: React.RefObject<Handle>
  scrollPos?: number
  extraControls?: React.ReactNode
  editable?: boolean
  onInitialStateLoad?: (state: EditorState) => void
  onDocChange?: (state: EditorState) => void
  isOpen?: boolean
}

const Editor: React.FC<Props> = ({
  config,
  field,
  viewRef,
  extraControls,
  editable = true,
  onInitialStateLoad,
  scrollPos,
  onDocChange,
  isOpen = true,
}) => {
  const [state, setState] = useProseMirror(config)
  const [saving, setSaving] = useState<boolean>(false)
  const [edited, setEdited] = useState<boolean>(false)
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)
  const { workspaceRef, dataRef, dataSnapshot } = useTextAndNotes(field)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const syncState = useCallback(
    debounce(async (state: EditorState) => {
      if (dataRef && dataRef.hasOwnProperty) {
        dataRef.set(JSON.stringify(state.toJSON()))
        setSaving(false)
      }
    }, 1000),
    [dataRef],
  )

  useEffect(() => {
    const parseState = async () => {
      if (dataSnapshot && !initialLoadDone) {
        const data = await dataSnapshot?.val()
        if (data) {
          const parsedState = EditorState.fromJSON(config, JSON.parse(data))
          setState(parsedState)
          if (onInitialStateLoad) {
            onInitialStateLoad(parsedState)
          }
        }
        setInitialLoadDone(true)
      }
    }
    parseState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSnapshot, initialLoadDone])

  if (!isOpen) return null

  return (
    <EditorUI
      scrollPos={scrollPos}
      type={field}
      extraControls={extraControls}
      viewRef={viewRef}
      workspaceRef={workspaceRef}
      saving={saving}
      loading={!initialLoadDone}
      edited={edited}
    >
      <ProseMirror
        ref={viewRef}
        state={state}
        editable={() => editable}
        className={field + '-editor'}
        onChange={(newState) => {
          const oldState = state
          setState(newState)
          if (newState.doc !== oldState.doc) {
            syncState(newState)
            if (onDocChange) {
              onDocChange(newState)
            }
            setSaving(true)
          }
          setEdited(true)
        }}
        // handleClickOn={(view, pos, node, nodePos, event, direct) => {
        // console.log(view.state.doc.resolve(pos).marks())
        // return false
        // }}
        style={{
          // position toolbar absolutely within this parent
          position: 'relative',
          // prevent floating UI elements that overflow from editor from adding horizontal scroll to editor
          overflowY: 'hidden',
        }}
      />
    </EditorUI>
  )
}
export default Editor
