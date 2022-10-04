import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'

export function getSentenceFocusPlugin() {
  return new Plugin({
    state: {
      init() {
        return { deco: DecorationSet.empty, commit: null }
      },
      apply(tr, prev, oldState, state) {
        if (tr.selection.empty) {
          const pos = tr.selection.from

          //extract text from parent node (paragraph)
          let txt = tr.selection.$from.parent.textBetween(
            0,
            tr.selection.$from.parent.content.size,
            '%',
          )

          //get the start position of the parent node (paragraph)
          const startp = tr.selection.$from.start()

          //regular expression to test for sentences [TODO: refine to match all use cases]
          const reg = new RegExp(/[(.|?|!|]/, 'gi')

          //switch variable for the matches below
          let match = null

          //empty array in which to store matched positions
          let stcpositions = []

          //loop over matches and add the indices to stcpositions
          while ((match = reg.exec(txt))) {
            stcpositions.push(match.index + 1)
          }

          //add the start position of the parent node (paragraph) to all matches elements
          //add start position to the array, so that the first sentence can be matched as well
          //add cursor position to the array so that we may filter on it
          //sort the array in ascending order to have all positions correctly positioned (haha!)
          stcpositions = [
            startp,
            ...stcpositions.map((idx) => startp + idx),
            pos,
          ].sort((a, b) => {
            if (a > b) return 1
            if (a < b) return -1
            return 0
          })

          //take the two positions immediately to the left and right of the cursor position, which gives us the sentence delimiter
          const limits = stcpositions
            .map((p, i) => {
              if (i === stcpositions.indexOf(pos) - 1) return p
              if (i === stcpositions.indexOf(pos) + 1) return p
              else return null
            })
            .filter((d) => d !== null)

          //add decorations between the limits
          const deco = Decoration.inline(limits[0], limits[1] + 1, {
            class: 'highlight',
          })

          return { deco: DecorationSet.create(state.doc, [deco]) }
        } else return prev
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).deco
      },
    },
  })
}
