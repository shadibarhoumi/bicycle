import { Plugin } from 'prosemirror-state'
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faBook,
  faVolumeUp,
  faQuoteRight,
} from '@fortawesome/free-solid-svg-icons'
import type { Speaker } from '@features/speaker/Speaker'
import type { EditorView } from 'prosemirror-view'
import { TextSelection, EditorState } from 'prosemirror-state'
import { toggleMark } from 'prosemirror-commands'
import { textSchema } from '@features/editor/schemas/textSchema'

library.add(faArrowRight, faBook, faVolumeUp, faQuoteRight)

export default function toolbarPlugin(
  setSelection: (selection: { text: string; type: string }) => void,
  setResearchQuery: (researchQuery: string) => void,
  speaker: Speaker,
) {
  return new Plugin({
    view(editorView) {
      return new InsertNoteView(
        editorView,
        setSelection,
        setResearchQuery,
        speaker,
      )
    },
  })
}

const HEAD_ABOVE_SPACING = 10
const HEAD_BENEATH_SPACING = 74
class InsertNoteView {
  speaker: Speaker
  toolbar: HTMLDivElement

  constructor(
    view: EditorView,
    setSelection: (selection: { text: string; type: string }) => void,
    setResearchQuery: (researchQuery: string) => void,
    speaker: Speaker,
  ) {
    this.speaker = speaker
    // create tooltip
    this.toolbar = document.createElement('div')
    this.toolbar.className = 'toolbar'

    // insert button
    const insertButton = document.createElement('button')
    insertButton.className = 'toolbar-button'
    const insertIcon = document.createElement('i')
    insertIcon.innerHTML = (icon({
      prefix: 'fas',
      iconName: 'arrow-right',
    }).html as unknown) as string
    insertButton.appendChild(insertIcon)
    insertButton.addEventListener('mouseup', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const sel = view.state.selection
      const text = view.state.doc.textBetween(sel.from, sel.to, ' ')
      setSelection({ text, type: 'Selection' })
      this.toolbar.style.display = 'none'
    })
    this.toolbar.appendChild(insertButton)

    // quote button
    const quoteButton = document.createElement('button')
    quoteButton.className = 'toolbar-button'
    const quoteIcon = document.createElement('i')
    quoteIcon.innerHTML = (icon({
      prefix: 'fas',
      iconName: 'quote-right',
    }).html as unknown) as string
    quoteButton.appendChild(quoteIcon)
    quoteButton.addEventListener('mouseup', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const sel = view.state.selection
      const text = view.state.doc.textBetween(sel.from, sel.to, ' ')
      toggleMark(textSchema.marks.selectedSnippet)(view.state, view.dispatch)
      setSelection({ text, type: 'Quote' })
      this.toolbar.style.display = 'none'
    })
    this.toolbar.appendChild(quoteButton)

    // bold button
    // const boldButton = document.createElement('button')
    // const boldIcon = document.createElement('i')
    // boldIcon.innerText = 'B'
    // boldIcon.className = 'bold-icon'
    // boldButton.className = 'toolbar-button'
    // boldButton.appendChild(boldIcon)
    // boldButton.addEventListener('mouseup', (e) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   toggleMark(restrictedSchema.marks.strong)(view.state, view.dispatch)
    //   this.toolbar.style.display = 'none'
    // })
    // this.toolbar.appendChild(boldButton)

    // research button
    const researchButton = document.createElement('button')
    researchButton.className = 'toolbar-button'
    const researchIcon = document.createElement('i')
    researchIcon.innerHTML = (icon({
      prefix: 'fas',
      iconName: 'book',
    }).html as unknown) as string
    researchButton.appendChild(researchIcon)
    researchButton.addEventListener('mouseup', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const sel = view.state.selection
      const txt = view.state.doc.textBetween(sel.from, sel.to, ' ')
      setResearchQuery(txt)
      this.toolbar.style.display = 'none'
    })
    this.toolbar.appendChild(researchButton)

    // speech button
    const speechButton = document.createElement('button')
    speechButton.className = 'toolbar-button'
    const speechIcon = document.createElement('i')
    speechIcon.innerHTML = (icon({
      prefix: 'fas',
      iconName: 'volume-up',
    }).html as unknown) as string
    speechButton.appendChild(speechIcon)
    this.toolbar.appendChild(speechButton)

    speechButton.addEventListener('mouseup', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const sel = view.state.selection
      // const txt = view.state.doc.textBetween(sel.from, sel.to, ' ')
      // setSpeechOffset(sel.from ?? 0)
      this.speaker.playFromOffset(sel.from)
      // un-highlight selected word
      view.dispatch(
        view.state.tr.setSelection(
          TextSelection.create(view.state.doc, sel.from, sel.from),
        ),
      )
      this.toolbar.style.display = 'none'
    })
    view.dom.parentNode!.appendChild(this.toolbar)
    this.update(view, null)
  }

  update(view: EditorView, lastState: EditorState | null) {
    const state = view.state
    // Do not display on document load
    if (lastState === null) {
      return
    }

    // Do not display if document/selection didn't change
    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    )
      return

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.toolbar.style.display = 'none'
      return
    }

    // Otherwise, reposition tooltip
    this.toolbar.style.display = ''
    const { head, anchor } = state.selection
    // get coordinates of head and anchor
    const headCoords = view.coordsAtPos(head)
    const anchorCoords = view.coordsAtPos(anchor)
    let headX = headCoords.left
    let headY = headCoords.top
    // if head is beneath anchor (selecting from top to bottom)
    let headBeneath = headCoords.bottom > anchorCoords.bottom
    // these vars are used to account for edge case where highlighted
    // region extends to right edge of editor, but selection head is actually
    // on the beginning of the next line
    // get coords of root node, left / right dimensions equal to entire editor
    const rootNodeCoords = view.coordsAtPos(0)
    // see whether the head is at the very left edge of the editor
    const headAtLeftEdge = headX === rootNodeCoords.left

    // if we are in the far-right-edge edge case
    if (headAtLeftEdge && headBeneath) {
      // calculate position of head position moved one unit back
      const backedUpHeadCoords = view.coordsAtPos(head - 1)
      // use these head coords in positioning calculation
      headX = backedUpHeadCoords.left
      headY = backedUpHeadCoords.top
      // set headBeneath to false if the backed-up head is now on
      // the same line as the anchor
      if (anchorCoords.top === backedUpHeadCoords.top) {
        headBeneath = false
      }
    }
    const headOnTopLine = headY - rootNodeCoords.top < 15
    // if head is on top line, place tooltip beneath head
    // if placed above, it'll be above the editor and out of bounds
    if (headOnTopLine) {
      headBeneath = true
    }
    // The box in which the tooltip is positioned, to use as base
    const box = this.toolbar.offsetParent!.getBoundingClientRect()
    // get tooltip dimensions
    // const tooltipHeight = this.toolbar.clientHeight
    const tooltipWidth = this.toolbar.clientWidth
    // render tooltip below selection if head is beneath anchor
    // and render above selection is head is above anchor
    let bottomY = headBeneath
      ? headY + HEAD_BENEATH_SPACING
      : headY - HEAD_ABOVE_SPACING
    // if tooltip running off bottom of entire editor, flip it above head
    if (headBeneath && bottomY > box.bottom) {
      bottomY = headY - HEAD_ABOVE_SPACING
    }
    // translate absolute headX value to relative value
    // stick tooltip to right edge if too far to right
    if (headX + tooltipWidth / 2 > box.right) {
      this.toolbar.style.left = box.right - box.left - tooltipWidth / 2 + 'px'
    } else if (headX - tooltipWidth / 2 < box.left) {
      // stick tooltip to left edge if too far to left
      this.toolbar.style.left = tooltipWidth / 2 + 'px'
    } else {
      // else position tooltip normally
      this.toolbar.style.left = headX - box.left + 'px'
    }
    // translate absolute bottomY value to relative value
    this.toolbar.style.bottom = box.bottom - bottomY + 'px'
  }

  destroy() {
    this.toolbar.remove()
  }
}
