# Changelog

All notable changes to `sveltekitbook` are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
