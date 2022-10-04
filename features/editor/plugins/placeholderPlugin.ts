import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const placeholderPlugin = (text: string) => {
  return new Plugin({
    props: {
      decorations(state) {
        const doc = state.doc
        if (
          doc.childCount == 1 &&
          doc.firstChild?.isTextblock &&
          doc?.firstChild?.content.size == 0
        ) {
          const placeholder = document.createElement('span')
          placeholder.appendChild(document.createTextNode(text))
          placeholder.className = 'placeholderText'
          return DecorationSet.create(doc, [Decoration.widget(1, placeholder)])
        }
        return
      },
    },
  })
}
