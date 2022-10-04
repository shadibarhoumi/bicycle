import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import { HEAD_LENGTH } from '@features/speaker/Speaker'

const highlightSpokenWordPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, previous, _, state) {
      if (tr.getMeta(highlightSpokenWordPlugin)) {
        const boundaryEvent = tr.getMeta(highlightSpokenWordPlugin)
        const textOffset = boundaryEvent.privTextOffset - HEAD_LENGTH
        const deco = Decoration.inline(
          textOffset,
          textOffset + boundaryEvent.privWordLength,
          {
            class: 'highlightWord',
          },
        )
        tr.scrollIntoView()
        return DecorationSet.create(state.doc, [deco])
      } else if (tr.getMeta('highlightSpokenWordPlugin-Google')) {
        const { speechOffset, speechLength } = tr.getMeta(
          'highlightSpokenWordPlugin-Google',
        )
        const deco = Decoration.inline(
          speechOffset,
          speechOffset + speechLength,
          {
            class: 'highlightWord',
          },
        )
        tr.scrollIntoView()
        return DecorationSet.create(state.doc, [deco])
      } else return previous
    },
  },
  props: {
    decorations(state) {
      return this.getState(state)
    },
  },
})
export default highlightSpokenWordPlugin
