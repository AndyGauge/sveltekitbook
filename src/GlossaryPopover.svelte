<!--
  @component
  A hover/focus popover that explains glossary terms in place.

  Place ONCE in your root layout, alongside your routed children:

  ```svelte
  <script>
    import { GLOSSARY } from '$lib/glossary.js';
    import GlossaryPopover from 'sveltekitbook/GlossaryPopover.svelte';
  </script>
  {@render children()}
  <GlossaryPopover glossary={GLOSSARY} />
  ```

  Every `<a class="hw-glossary-link" data-term="...">` on the page becomes
  hoverable.  The base md/mdBlock renderer emits these automatically for
  `[[term]]` references when you pass `glossary` in opts; you can also
  generate them yourself in a downstream renderer (see norp's auto-linker).

  Glossary entry shape (matches the format the base md renderer accepts):

  ```js
  export const GLOSSARY = {
    'term name': 'plain definition',
    'other':     { definition: 'rich markdown', see: ['related', 'terms'] },
  };
  ```

  Props:
  - `glossary` — required.  The same object passed to md / mdBlock.
  - `base`     — optional base path for the "Open in glossary" link.
                 Default `/glossary`.
  - `show_delay_ms` — cold-start delay before the popover appears.  Default 80.
  - `hide_delay_ms` — grace period before hiding when the cursor leaves.
                       Default 120.  Long enough to move into the popover.
-->
<script>
  import { onMount } from 'svelte';
  import { md as baseMd, mdBlock, slug } from './md.js';

  let {
    glossary,
    base = '/glossary',
    show_delay_ms = 80,
    hide_delay_ms = 120
  } = $props();

  let popover = $state(null);   // { canonical, body, see, x, y, slug }
  let popoverEl = $state();
  let showTimer;
  let hideTimer;

  // ── Event delegation on document so any link anywhere on the page
  //    triggers the popover.  No wrapper element required.
  onMount(() => {
    const onOver = (e) => {
      const link = e.target?.closest?.('.hw-glossary-link');
      if (link) showFor(link);
    };
    const onOut = (e) => {
      const link = e.target?.closest?.('.hw-glossary-link');
      if (!link) return;
      const next = e.relatedTarget;
      if (next instanceof Node) {
        if (next.closest?.('.hw-glossary-link')) return;
        if (popoverEl && popoverEl.contains(next)) return;
      }
      hide();
    };
    const onFocusIn = (e) => {
      const link = e.target?.closest?.('.hw-glossary-link');
      if (link) showFor(link);
    };
    const onFocusOut = (e) => {
      const link = e.target?.closest?.('.hw-glossary-link');
      if (!link) return;
      const next = e.relatedTarget;
      if (next instanceof Node) {
        if (next.closest?.('.hw-glossary-link')) return;
        if (popoverEl && popoverEl.contains(next)) return;
      }
      hide();
    };
    const onScroll = () => hideNow();
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && popover) hideNow();
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('scroll', onScroll, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  function placePopover(rect) {
    const POP_W = 360;
    const POP_H_EST = 200;
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = rect.left;
    if (x + POP_W > vw - margin) x = vw - POP_W - margin;
    if (x < margin) x = margin;
    let y = rect.bottom + 8;
    if (y + POP_H_EST > vh - margin && rect.top > POP_H_EST + 12) {
      y = rect.top - POP_H_EST - 8;
    }
    return { x, y };
  }

  function showFor(link) {
    const term = link.dataset.term;
    if (!term || !glossary) return;
    const entry = glossary[term];
    if (!entry) return;

    clearTimeout(hideTimer);
    clearTimeout(showTimer);

    const body = typeof entry === 'string' ? entry : entry.definition;
    const see = (typeof entry === 'object' && entry.see) || [];

    const update = () => {
      const { x, y } = placePopover(link.getBoundingClientRect());
      popover = {
        canonical: term,
        body,
        see,
        x,
        y,
        slug: slug(term)
      };
    };
    if (popover) update();
    else showTimer = setTimeout(update, show_delay_ms);
  }

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { popover = null; }, hide_delay_ms);
  }

  function hideNow() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    popover = null;
  }

  function onPopoverEnter() { clearTimeout(hideTimer); }
  function onPopoverLeave() { hide(); }
</script>

{#if popover}
  <div
    bind:this={popoverEl}
    class="glossary-popover"
    style:left="{popover.x}px"
    style:top="{popover.y}px"
    onmouseenter={onPopoverEnter}
    onmouseleave={onPopoverLeave}
    role="tooltip"
  >
    <div class="popover-head">
      <span class="popover-term">{popover.canonical}</span>
      {#if popover.see.length}
        <span class="popover-aliases">see: {popover.see.join(' · ')}</span>
      {/if}
    </div>
    <div class="popover-body">{@html mdBlock(popover.body, { glossary, glossaryBase: base })}</div>
    <a class="popover-link" href="{base}#{popover.slug}">
      Open in glossary →
    </a>
  </div>
{/if}

<style>
  .glossary-popover {
    position: fixed;
    z-index: 1000;
    width: 360px;
    max-width: calc(100vw - 24px);
    background: var(--bg, #faf7f2);
    border: 1px solid var(--rule, rgba(20, 17, 13, 0.15));
    box-shadow: 0 6px 24px rgba(20, 17, 13, 0.18);
    padding: 0.9rem 1.1rem 0.8rem;
    font-family: var(--serif, Georgia, serif);
    color: var(--ink, #14110d);
    pointer-events: auto;
    animation: pop-in 120ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
  }
  @keyframes pop-in {
    from { opacity: 0; transform: translateY(-4px); }
  }

  .popover-head {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border-bottom: 1px dotted var(--rule, rgba(20, 17, 13, 0.15));
    padding-bottom: 0.5rem;
    margin-bottom: 0.55rem;
  }
  .popover-term {
    font-style: italic;
    font-weight: 400;
    font-size: 1.05rem;
    color: var(--ink, #14110d);
  }
  .popover-aliases {
    font-family: var(--sans, system-ui, sans-serif);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted, rgba(20, 17, 13, 0.5));
  }

  .popover-body {
    font-weight: 300;
    font-size: 0.92rem;
    line-height: 1.5;
  }
  .popover-body :global(p) { margin: 0 0 0.5em; }
  .popover-body :global(p:last-child) { margin-bottom: 0; }
  .popover-body :global(strong) { font-weight: 500; }
  .popover-body :global(code) {
    font-family: var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
    font-size: 0.86em;
    background: rgba(20, 17, 13, 0.06);
    padding: 0.05rem 0.3rem;
    border-radius: 2px;
  }
  .popover-body :global(a.hw-glossary-link) {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--accent, rgba(20, 17, 13, 0.4));
  }

  .popover-link {
    display: inline-block;
    margin-top: 0.7rem;
    font-family: var(--sans, system-ui, sans-serif);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--accent, rgba(20, 17, 13, 0.5));
    border-bottom: 1px solid transparent;
    transition: border-bottom-color 160ms ease;
  }
  .popover-link:hover { border-bottom-color: var(--accent, rgba(20, 17, 13, 0.5)); }

  /* Hide on touch-only devices — there's no hover affordance there. */
  @media (hover: none) and (pointer: coarse) {
    .glossary-popover { display: none; }
  }
</style>
