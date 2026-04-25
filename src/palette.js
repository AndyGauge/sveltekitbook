// Palette factory for spectrum books.
//
// A book supplies:
//   - ramp: { [stop: number]: { bg, ink, muted, rule, accent, mode } }
//   - inverted (optional): a single palette used when a section has invert: true
//
// Factory returns paletteFor / styleFor / modeFor bound to that ramp.

const LIGHT_INK = '#f4efe3';
const DARK_INK = '#14110d';

/**
 * Build a spectrum palette from a ramp keyed by integer stops.
 * Values are clamped to [min, max] from the ramp keys.
 *
 * @param {{ ramp: Record<number, Palette>, inverted?: Palette }} opts
 * @typedef {{bg:string, ink:string, muted:string, rule:string, accent:string, mode:'dark'|'light'}} Palette
 */
export function makeSpectrum({ ramp, inverted }) {
  const stops = Object.keys(ramp)
    .map((k) => Number(k))
    .sort((a, b) => a - b);
  const min = stops[0];
  const max = stops[stops.length - 1];

  function paletteFor(spectrum, invert = false) {
    if (invert && inverted) return inverted;
    const s = Math.max(min, Math.min(max, Math.round(spectrum)));
    return ramp[s];
  }

  function styleFor(spectrum, invert = false) {
    const p = paletteFor(spectrum, invert);
    return (
      `--bg:${p.bg};` +
      `--ink:${p.ink};` +
      `--muted:${p.muted};` +
      `--rule:${p.rule};` +
      `--accent:${p.accent};`
    );
  }

  function modeFor(spectrum, invert = false) {
    return paletteFor(spectrum, invert).mode;
  }

  return { paletteFor, styleFor, modeFor, stops, min, max };
}

/** Convenience light-ink palette (dark background). */
export const DARK_PALETTE = Object.freeze({
  bg: '#14110d',
  ink: LIGHT_INK,
  muted: 'rgba(244,239,227,0.7)',
  rule: 'rgba(244,239,227,0.24)',
  accent: '#c49ad8',
  mode: /** @type {'dark'} */ ('dark')
});

/** Convenience light-background palette (dark ink). */
export const LIGHT_PALETTE = Object.freeze({
  bg: '#ece8df',
  ink: DARK_INK,
  muted: 'rgba(20,17,13,0.56)',
  rule: 'rgba(20,17,13,0.16)',
  accent: '#6a6a6a',
  mode: /** @type {'light'} */ ('light')
});

export { LIGHT_INK, DARK_INK };
