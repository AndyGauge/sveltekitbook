# sveltekitbook

Runtime helpers for SvelteKit books scaffolded with
[`create-sveltekitbook`](https://github.com/AndyGauge/create-sveltekitbook).

**See it in use:** [sveltekitbook-tour](https://andygauge.github.io/sveltekitbook-tour/) —
a sample book that explains this format. ([source](https://github.com/AndyGauge/sveltekitbook-tour))

**Sibling project:** [`create-sveltekitslides`](https://www.npmjs.com/package/create-sveltekitslides) —
the slide-deck scaffolder. Same scroll model and `outline.js` philosophy,
different chrome (presentation timer, pace bar, QR per slide, /presenter
popout, optional phone↔laptop sync).

Small on purpose. The bulk of each book (routes, cover, contents, per-page
layout) is scaffolded *into* the book as editable starter files, not hidden
behind a component API. This package only holds the parts that are truly
shared and stable:

| Export | What it is |
| ------ | ---------- |
| `sveltekitbook/gestures` | `createPager({ onNext, onPrev, setOffset })` — wheel + touch-drag → page nav. |
| `sveltekitbook/md` | `md(text, { glossary, glossaryBase })` — inline `**bold**`, `*em*`, `[[term]]` → glossary link. |
| `sveltekitbook/palette` | `makeSpectrum({ ramp, inverted })` → `{ paletteFor, styleFor, modeFor }` for spectrum books. |
| `sveltekitbook/Giscus.svelte` | Giscus comments mounted by props (`repo`, `repoId`, `category`, `categoryId`, `term`, `mode`). |

Consumed directly by projects generated via `npm create sveltekitbook`.
You usually don't install it by hand.
