import { css } from 'styled-components'

export const ProsemirrorStyles = css`
  /* Main editor styles */
  .ProseMirror {
    isolation: isolate;
    position: relative;
    outline: none;
    /* padding: 48px; */
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
  }

  .ProseMirror pre {
    white-space: pre-wrap;
  }

  .ProseMirror li {
    position: relative;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }
  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }
  .ProseMirror-hideselection {
    caret-color: transparent;
  }

  .ProseMirror-selectednode {
    /* outline: 2px solid #8cf; */
  }

  /* Make sure li selections wrap around markers */

  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 30px;
    list-style: revert;
  }

  /* .ProseMirror blockquote {
  border-left: 3px solid #eee;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
} */

  .ProseMirror blockquote {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 500;
    color: ${({ theme }) =>
      theme.light ? theme.colors.gray[700] : theme.colors.gray[500]};
    font-style: italic;
  }

  /* ADDITIONAL EDITOR STYLES */

  .text-editor p,
  .text-editor p *,
  .text-editor {
    font-family: var(--font-serif);
    /* range: 8 - 36px */
    font-size: calc(18 / 16 * 1rem);
    /* Book-like color */
    /* Dyslexic Font Styles */
    /* font-family: var(--font-dyslexic);
		letter-spacing: 0.02ch;
		line-height: 1.8; */
    max-width: var(--text-editor-max-width);
    margin: 0 auto;
  }

  .text-editor p {
    margin: 20px 0;
    text-indent: 2rem;
    text-align: justify;
  }

  /* PROSEMIRROR PLUGINS */
  /* Selection toolbar */
  .toolbar {
    position: absolute;
    background-color: ${({ theme }) => theme.colors.toolbarBackground};
    color: var(--color-toolbar-text);
    border: 1px solid black;
    border-radius: 4px;
    border: none;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    font-size: calc(18 / 16 * 1rem);
    display: flex;
  }

  .toolbar-button {
    background-color: ${({ theme }) => theme.colors.toolbarBackground};
    color: #c1c7cd;
    border: var(--border-toolbar);
    border-radius: 4px;
    border: none;
    cursor: pointer;
    text-align: center;
    width: 36px;
    height: 36px;
  }

  .bold-icon {
    font-size: 18px;
    position: relative;
    top: -1px;
    font-style: unset;
    font-weight: 500;
  }

  .toolbar-button:hover {
    color: white;
  }

  /* TTS Word-Highlighting Plugin */
  .text-editor .highlightWord {
    background-color: ${({ theme }) => theme.colors.highlightWord};
    ${({ theme }) => theme.transitions.themeSwitch};
    padding: 0px 0;
    border-radius: 4px;
  }

  .placeholderText {
    color: ${({ theme }) => theme.colors.gray[700]};
    font-style: italic;
  }

  em,
  strong {
    font-family: inherit;
  }
`
