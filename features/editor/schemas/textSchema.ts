/**
 * Describes the special Nodes we handle in prosemirror as well as their attributes.
 */
import { Schema, NodeSpec, NodeType, MarkSpec } from 'prosemirror-model'

// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  toDOM() {
    return ['p', 0]
  },
}

const selectedSnippet: MarkSpec = {
  toDOM() {
    return ['span', { class: 'snippet-text' }, 0]
  },
}

// :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
// Has parse rules that also match `<i>` and `font-style: italic`.
const em: MarkSpec = {
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['em', 0]
  },
}

// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
// also match `<b>` and `font-weight: bold`.
const strong: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    {
      tag: 'b',
      getAttrs: (node: any) => node.style.fontWeight != 'normal' && null,
    },
    {
      style: 'font-weight',
      getAttrs: (value: any) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
    },
  ],
  toDOM() {
    return ['strong', 0]
  },
}

// :: MarkSpec A link. Has `href` and `title` attributes. `title`
// defaults to the empty string. Rendered and parsed as an `<a>`
// element.
const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom) {
        return {
          href: (dom as HTMLAnchorElement).getAttribute('href'),
          title: (dom as HTMLAnchorElement).getAttribute('title'),
        }
      },
    },
  ],
  toDOM(node) {
    const { href, title } = node.attrs
    return ['a', { href, title }, 0]
  },
}

const nodes = {
  doc: { content: 'block+' },
  paragraph,
  text: { group: 'inline' },
}

const marks = {
  selectedSnippet,
  strong,
  em,
  link,
}

// Define our own type StrictSchema to make schema.nodes.foobar a type error for unknown foobar
type StrictSchema<S extends Schema> = S extends Schema<infer N, infer M>
  ? // eslint-disable-next-line no-unused-vars
    Omit<S, 'nodes'> & { nodes: { [n in N]: NodeType<Schema<N, M>> } }
  : never

const s = new Schema({ nodes, marks })

export const textSchema: StrictSchema<typeof s> = s
