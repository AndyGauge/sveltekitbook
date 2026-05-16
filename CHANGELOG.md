# Changelog

All notable changes to `sveltekitbook` are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.1] — 2026-05-16

### Fixed
- `createPager` no longer hijacks wheel/touch gestures that originate
  inside a horizontally-scrollable element (a wide code block, an
  embedded table). Previously, shift-wheeling or trackpad-swiping
  inside a `<pre>` with `overflow-x: auto` would turn the page
  instead of scrolling the block. The pager now walks up from the
  event target and bails out when it finds an ancestor whose
  `scrollWidth > clientWidth` and whose computed `overflow-x` is
  `auto` or `scroll`, leaving the browser's native scroll alone.

## [0.4.0] — 2026-05-02

### Added
- `md()` and `mdBlock()` now render backtick code spans —
  `` `code` `` becomes `<code>code</code>`. Code spans are pulled
  out to placeholders before other transforms run, so their
  contents render literally (CommonMark behavior — `` `**not
  bold**` `` stays as `**not bold**` inside `<code>`, links and
  glossary syntax inside backticks are left alone). HTML chars
  inside code spans are still escaped.

## [0.3.0] — 2026-05-01

### Added
- `mdBlock(text, opts)` exported from `sveltekitbook/md` — paragraph-aware
  block renderer. Splits trusted markdown text on blank lines and emits
  one `<p>` per paragraph with `md()` applied for inline transforms. Use
  this for any field that may contain multiple paragraphs (section bodies,
  ELI5 blocks, chapter intros) and render the result inside a `<div>`
  wrapper — never inside a `<p>`, which collapses paragraphs into one block.

## [0.2.0] — 2026-04-29

### Added
- `sveltekitbook/PageMeta.svelte` — drops Open Graph + Twitter Card
  meta tags into `<svelte:head>` so per-page URLs unfurl with a tldr
  in Slack / iMessage / Discord. Props: `title`, `description`, `url`,
  `siteName`, `image`, `imageAlt`, `type`, `twitterCard`.

## [0.1.1] — 2026-04-25

### Fixed
- README: dead link to `create-sveltekitbook` corrected.

### Added
- README: sibling-project section pointing at `create-sveltekitslides`.

## [0.1.0] — 2026-04-25

### Added
- Initial publish. Runtime helpers consumed by books scaffolded with
  `create-sveltekitbook`.
- `sveltekitbook/gestures` — `createPager({ onNext, onPrev, setOffset })`
  for wheel + touch-drag page navigation.
- `sveltekitbook/md` — trusted inline markdown renderer: `**bold**`,
  `*em*`, `[text](url)` (http/https/mailto/relative only), and
  `[[term]]` glossary auto-linking when a `glossary` option is passed.
- `sveltekitbook/palette` — `makeSpectrum({ ramp, inverted })` returning
  `{ paletteFor, styleFor, modeFor }` for spectrum books.
- `sveltekitbook/Giscus.svelte` — Giscus comments component mounted by
  props (`repo`, `repoId`, `category`, `categoryId`, `term`, `mode`).
