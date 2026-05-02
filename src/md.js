// Inline markdown for trusted (hardcoded) text.
//   `code`         → <code>
//   **bold**       → <strong>
//   *em*           → <em>
//   [text](url)    → <a href="url">text</a>  (http/https/mailto/relative only)
//   [[term]]       → <a href="{glossaryBase}#term-slug">term</a>  (when glossary is enabled)
//
// Order matters: code spans are pulled out to placeholders first so their
// contents don't get re-processed (CommonMark — code spans are literal),
// then bold/em, then external links, then glossary linking, so hrefs aren't
// escaped and `[[term]]` can't collide with `[t](u)`. Code spans are
// substituted back at the end wrapped in `<code>`.

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPE[c]);

const slug = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Render trusted inline markdown.
 *
 * @param {string} text
 * @param {{ glossary?: Record<string, unknown>, glossaryBase?: string }} [opts]
 *   glossary: keyed by term. Any [[term]] in the text becomes a link into
 *   `${glossaryBase}#${slug(term)}`. Case-insensitive match.
 *   glossaryBase defaults to '/glossary'.
 */
export function md(text, opts = {}) {
  if (!text) return '';
  const glossary = opts.glossary;
  const glossaryBase = opts.glossaryBase ?? '/glossary';

  const codeSpans = [];
  let out = escape(text).replace(/`([^`]+)`/g, (_, content) => {
    codeSpans.push(content);
    return `\x00CODE${codeSpans.length - 1}\x00`;
  });

  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

  // [text](url) — external links. Restrict to safe schemes; reject anything
  // that looks like javascript: or data: even after entity-escape.
  out = out.replace(/(^|[^!\[])\[([^\]]+)\]\(([^)\s]+)\)/g, (_, lead, label, href) => {
    const safe = /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|#)/i.test(href);
    if (!safe) return `${lead}[${label}](${href})`;
    const external = /^https?:/i.test(href);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `${lead}<a href="${href}"${attrs}>${label}</a>`;
  });

  if (glossary) {
    const lookup = new Map();
    for (const key of Object.keys(glossary)) {
      lookup.set(key.toLowerCase(), key);
    }
    out = out.replace(/\[\[([^\]]+)\]\]/g, (_, raw) => {
      const term = raw.trim();
      const canonical = lookup.get(term.toLowerCase());
      if (!canonical) return term; // unknown term → plain text, no broken link
      return `<a class="hw-glossary-link" href="${glossaryBase}#${slug(canonical)}">${term}</a>`;
    });
  } else {
    // Strip [[ ]] if no glossary so the syntax never leaks through.
    out = out.replace(/\[\[([^\]]+)\]\]/g, '$1');
  }

  out = out.replace(/\x00CODE(\d+)\x00/g, (_, i) => `<code>${codeSpans[+i]}</code>`);

  return out;
}

/**
 * Render trusted block-level markdown — paragraphs only.
 *
 * Splits `text` on blank lines (one or more `\n\n`) and emits one `<p>` per
 * paragraph, with inline transforms (`md`) applied per paragraph. Use this
 * for any field that may contain multiple paragraphs (section bodies, ELI5
 * blocks, chapter intros) and render the result inside a `<div>` wrapper.
 *
 * Do NOT wrap the output in a `<p>` — that produces nested `<p>` tags, which
 * the browser auto-closes, collapsing every paragraph into one block.
 *
 * @param {string} text
 * @param {{ glossary?: Record<string, unknown>, glossaryBase?: string }} [opts]
 * @returns {string} HTML string of `<p>...</p>` paragraphs joined together.
 */
export function mdBlock(text, opts = {}) {
  if (!text) return '';
  return String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${md(p, opts)}</p>`)
    .join('');
}

export { slug };
