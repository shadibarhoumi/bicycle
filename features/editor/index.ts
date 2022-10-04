import { schema } from '@features/editor/schemas/notesSchema'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules } from '@features/editor/config/inputRules'
import { buildKeymap } from '@features/editor/config/keymap'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'
import type { useProseMirror } from 'use-prosemirror'

export type ProseMirrorConfig = Parameters<typeof useProseMirror>[0]

export const basePlugins = [
  history(),
  buildInputRules(schema),
  keymap(buildKeymap(schema)),
  keymap(baseKeymap),
  dropCursor(),
  gapCursor(),
]

export { schema as notesSchema } from '@features/editor/schemas/notesSchema'
