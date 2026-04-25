<script>
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';

  /**
   * Props — all four are required for giscus to initialize. Get them from
   * https://giscus.app after enabling Discussions on the target repo and
   * installing the giscus app.
   *
   * term: unique per-page key (usually the section number/slug).
   * mode: 'light' | 'dark' — drives which CSS file giscus loads.
   */
  let {
    term,
    mode = 'light',
    repo,
    repoId,
    category = 'General',
    categoryId,
    themeLight = 'giscus.css',
    themeDark = 'giscus-dark.css'
  } = $props();

  let containerEl = $state();
  let currentTerm = $state(null);
  let currentMode = $state(null);

  function mount(t, m) {
    if (!containerEl) return;
    if (!repo || !repoId || !categoryId) return;
    containerEl.innerHTML = '';
    const themeFile = m === 'dark' ? themeDark : themeLight;
    const themeUrl = `${window.location.origin}${base}/${themeFile}`;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', repo);
    s.setAttribute('data-repo-id', repoId);
    s.setAttribute('data-category', category);
    s.setAttribute('data-category-id', categoryId);
    s.setAttribute('data-mapping', 'specific');
    s.setAttribute('data-term', t);
    s.setAttribute('data-strict', '1');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', themeUrl);
    s.setAttribute('data-lang', 'en');
    s.setAttribute('data-loading', 'lazy');
    s.crossOrigin = 'anonymous';
    s.async = true;
    containerEl.appendChild(s);
  }

  onMount(() => {
    currentTerm = term;
    currentMode = mode;
    mount(term, mode);
  });

  $effect(() => {
    if ((term !== currentTerm || mode !== currentMode) && containerEl) {
      currentTerm = term;
      currentMode = mode;
      mount(term, mode);
    }
  });

  onDestroy(() => {
    if (containerEl) containerEl.innerHTML = '';
  });
</script>

{#if repo && repoId && categoryId}
  <aside class="giscus-wrap">
    <div class="giscus-label">Responses</div>
    <div class="giscus-frame" bind:this={containerEl}></div>
  </aside>
{/if}

<style>
  .giscus-wrap {
    grid-column: 2;
    max-width: 60ch;
    margin-top: 2.4rem;
    padding-top: 1.2rem;
    padding-left: 1.3rem;
    border-top: 1px solid var(--ink, #14110d);
  }
  .giscus-label {
    font-family: var(--sans, 'Inter', sans-serif);
    font-size: 0.62rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--ink, #14110d);
    margin-bottom: 1rem;
  }
  .giscus-frame :global(.giscus) {
    width: 100%;
  }
  .giscus-frame :global(.giscus-frame) {
    width: 100%;
  }
  @media (max-width: 720px) {
    .giscus-wrap {
      grid-column: 1;
      max-width: none;
      padding-left: 1rem;
    }
  }
</style>
