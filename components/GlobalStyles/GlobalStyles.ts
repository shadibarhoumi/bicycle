import { createGlobalStyle } from 'styled-components'
import { COLORS } from '@styles/BaseTheme'
import { ProsemirrorStyles } from '@styles/ProsemirrorStyles'

const GlobalStyles = createGlobalStyle`
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
  font-size: 100%;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

/* FONTS */
 @font-face {
	 font-family: 'OpenDyslexic';
	 src: url('/fonts/opendyslexic-regular-webfont.woff2') format('woff2');
	 font-weight: 500;
	 font-style: normal;
 }
 
 @font-face {
	 font-family: 'OpenDyslexic';
	 src: url('/fonts/opendyslexic-bold-webfont.woff2') format('woff2');
	 font-weight: 700;
	 font-style: normal;
 }

 @font-face {
	 font-family: 'OpenDyslexic';
	 src: url('/fonts/opendyslexic-bolditalic-webfont.woff2') format('woff2');
	 font-weight: 700;
	 font-style: italic;
 }

 @font-face {
	 font-family: 'OpenDyslexic';
	 src: url('/fonts/opendyslexic-italic-webfont.woff2') format('woff2');
	 font-weight: 500;
	 font-style: italic;
 }


/* GLOBAL STYLES */
*,
*:before,
*:after {
  box-sizing: border-box;
  line-height: 1.5;
	font-family: var(--font-sans);

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
}

#__next {
  /*
    Create a stacking context, without a z-index.
    This ensures that all portal content (modals and tooltips) will
    float above the app.
  */
  isolation: isolate;
}

html {
  --color-white: hsl(${COLORS.white});
  --color-black: hsl(${COLORS.black});
  --color-primary: hsl(${COLORS.primary});
  --color-secondary: hsl(${COLORS.secondary});
  --color-gray-100: hsl(${COLORS.gray[100]});
  --color-gray-200: hsl(${COLORS.gray[200]});
  --color-gray-300: hsl(${COLORS.gray[300]});
  --color-gray-400: hsl(${COLORS.gray[400]});
  --color-gray-500: hsl(${COLORS.gray[500]});
  --color-gray-600: hsl(${COLORS.gray[600]});
  --color-gray-700: hsl(${COLORS.gray[700]});
  --color-gray-900: hsl(${COLORS.gray[900]});
	--color-text: var(--color-gray-900);
  --color-backdrop: hsl(${COLORS.gray[700]} / 0.8);
  --color-research-background: hsl(0deg 0% 97%);
	--color-book-background: hsl(36deg 29% 90%);
	--color-text-editor-background: var(--white);
	--color-toolbar-text: #c1c7cd;
	--font-mono: 'JetBrains Mono', courier;
	--font-sans: -apple-system, system-ui, sans-serif;
	/* --font-sans: 'DM Sans', sans-serif; */
	--font-serif: Georgia, 'Times New Roman', Times, serif;
	--font-dyslexic: 'OpenDyslexic', sans-serif;
	--border-toolbar: '1px solid black';
	--text-editor-max-width: 550px;
  /*
    Silence the warning about missing Reach Dialog styles
  */
  --reach-dialog: 1;
}

html, body, #__next {
  height: 100%;
	color: var(--color-text);
	background-color: var(--color-background);
}

/* Prosmirror plugin styles */

.snippet-text {
  border-bottom: 1px solid var(--color-primary);
  transition: background-color 100ms ease-out;
	transition-delay: 150ms;

	&:hover {
		cursor: pointer;
		background-color:  ${({ theme }) => theme.colors.highlightWord};
		transition-delay: 0ms;
	}
}


.snippet-note {
  font-size: 1.125rem;
  border-left: 3px solid var(--color-primary);
  padding-left: 16px;
  font-family: var(--font-serif);

  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  margin-top: 2px;

	&:before {
		content: '“';
	}

	&:after {
		content: '“';
	}
}

${ProsemirrorStyles}
`

export default GlobalStyles
