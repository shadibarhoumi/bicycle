import React from 'react'
import { useRef, useEffect } from 'react'
import { Handle } from 'use-prosemirror'
import { notesSchema, basePlugins } from '@features/editor'
import { placeholderPlugin } from '@features/editor/plugins/placeholderPlugin'
import Editor from './Editor'

interface Props {
  selection: { text: string; type: string }
  isOpen?: boolean
}

const plugins = [...basePlugins, placeholderPlugin('Add your notes here...')]

const NotesEditor: React.FC<Props> = ({ selection, isOpen }) => {
  const viewRef = useRef<Handle>(null)

  // create snippet node when new selection is passed
  useEffect(() => {
    const { text, type } = selection
    if (text.length) {
      const view = viewRef.current?.view
      if (view) {
        view.focus()
        const tr = view.state.tr
        if (type === 'Quote') {
          const snippet = notesSchema.nodes.snippet.create(
            undefined,
            notesSchema.text(text),
          )
          tr.insert(tr.selection.anchor - 1, snippet)
        } else if (type === 'Selection') {
          const snippet = notesSchema.nodes.paragraph.create(
            undefined,
            notesSchema.text(text),
          )
          tr.insert(tr.selection.anchor - 1, snippet)
        }
        // set selection to position after snippet
        // tr.setSelection(
        //   Selection.near(
        //     tr.doc.resolve(tr.selection.anchor + snippet.nodeSize),
        //   ),
        // )
        tr.scrollIntoView()
        view.dispatch(tr)
      }
    }
  }, [selection])

  // hack to re-focus notes view after clicking insert button in TextEditor
  useEffect(() => {
    const { text } = selection
    if (text.length) {
      setTimeout(() => {
        viewRef.current?.view.focus()
      }, 50)
    }
  }, [selection])

  return (
    <Editor
      viewRef={viewRef}
      config={{ schema: notesSchema, plugins }}
      field="notes"
      isOpen={isOpen}
    />
  )
}
export default NotesEditor
