/**
 * Describes the special Nodes we handle in prosemirror as well as their attributes.
 */
import { Schema, NodeSpec, MarkSpec, NodeType } from 'prosemirror-model'

const snippet: NodeSpec = {
  content: 'inline*',
  group: 'block',
  toDOM() {
    return [
      'blockquote',
      {
        class: 'snippet-note',
      },
      0,
    ]
  },
}

// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0]
  },
}
// :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
const blockquote: NodeSpec = {
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0]
  },
}

// :: NodeSpec A horizontal rule (`<hr>`).
const horizontalRule: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return ['hr']
  },
}

// :: NodeSpec A heading textblock, with a `level` attribute that
// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
// `<h6>` elements.
const heading: NodeSpec = {
  attrs: { level: { default: 1 } },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } },
  ],
  toDOM(node) {
    return ['h' + node.attrs.level, 0]
  },
}

// :: NodeSpec A code listing. Disallows marks or non-text inline
// nodes by default. Represented as a `<pre>` element with a
// `<code>` element inside of it.
const codeBlock: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
  toDOM() {
    return ['pre', ['code', 0]]
  },
}

// :: NodeSpec An inline image (`<img>`) node. Supports `src`,
// `alt`, and `href` attributes. The latter two default to the empty
// string.
const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom: any) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
        }
      },
    },
  ],
  toDOM(node) {
    const { src, alt, title } = node.attrs
    return ['img', { src, alt, title }]
  },
}

// :: NodeSpec A hard line break, represented in the DOM as `<br>`.
const hardBreak: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br']
  },
}

// :: NodeSpec
// An ordered list [node spec](#model.NodeSpec). Has a single
// attribute, `order`, which determines the number at which the list
// starts counting, and defaults to 1. Represented as an `<ol>`
// element.
const orderedList: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  attrs: { order: { default: 1 } },
  parseDOM: [
    {
      tag: 'ol',
      getAttrs(dom: any) {
        return {
          order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1,
        }
      },
    },
  ],
  toDOM(node: any) {
    return node.attrs.order == 1
      ? ['ol', 0]
      : ['ol', { start: node.attrs.order }, 0]
  },
}

// :: NodeSpec
// A bullet list node spec, represented in the DOM as `<ul>`.
const bulletList: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ['ul', 0]
  },
}

// :: NodeSpec
// A list item (`<li>`) spec.
const listItem: NodeSpec = {
  content: 'paragraph block*',
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0]
  },
  defining: true,
}

const nodes = {
  doc: { content: 'block+' },
  paragraph,
  snippet,
  blockquote,
  horizontalRule,
  heading,
  codeBlock,
  text: { group: 'inline' },
  image,
  hardBreak,
  orderedList,
  bulletList,
  listItem,
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
      getAttrs(dom: any) {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
        }
      },
    },
  ],
  toDOM(node) {
    const { href, title } = node.attrs
    return ['a', { href, title }, 0]
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

// :: MarkSpec Code font mark. Represented as a `<code>` element.
const code: MarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code', 0]
  },
}

const underline: MarkSpec = {
  toDOM() {
    return ['u', 0]
  },
}

const highlight: MarkSpec = {
  toDOM() {
    return ['span', { class: 'highlight' }, 0]
  },
}

const marks = {
  link,
  em,
  strong,
  code,
  underline,
  highlight,
}

// Define our own type StrictSchema to make schema.nodes.foobar a type error for unknown foobar
type StrictSchema<S extends Schema> = S extends Schema<infer N, infer M>
  ? // eslint-disable-next-line no-unused-vars
    Omit<S, 'nodes'> & { nodes: { [n in N]: NodeType<Schema<N, M>> } }
  : never

const s = new Schema({ nodes, marks })

export const schema: StrictSchema<typeof s> = s
