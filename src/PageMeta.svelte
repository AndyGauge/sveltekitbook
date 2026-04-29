<script>
  /**
   * Emits Open Graph + Twitter Card meta tags so that pasting a page URL
   * into Slack, iMessage, Discord, etc. unfurls with the page title and
   * a tldr/description preview.
   *
   * Drop into a page's <svelte:head>:
   *
   *   <PageMeta
   *     title={section.title}
   *     description={section.tldr}
   *     url={canonical}
   *     siteName={TITLE}
   *   />
   *
   * Pages prerender to static HTML, so the tags land in the prerendered
   * <head> of each route — exactly what link-unfurlers fetch.
   *
   * Props:
   *   title       — page title (required for a usable preview)
   *   description — the tldr; also rendered as <meta name="description">
   *   url         — canonical page URL (used for og:url; recommended)
   *   siteName    — book title (og:site_name)
   *   image       — absolute URL to a preview image; flips Twitter card
   *                 to summary_large_image when present
   *   imageAlt    — alt text for the preview image
   *   type        — og:type, defaults to 'article'
   *   twitterCard — override the Twitter card type
   */
  let {
    title,
    description,
    url,
    siteName,
    image,
    imageAlt,
    type = 'article',
    twitterCard
  } = $props();

  let card = $derived(twitterCard ?? (image ? 'summary_large_image' : 'summary'));
</script>

<svelte:head>
  {#if description}
    <meta name="description" content={description} />
  {/if}

  {#if title}
    <meta property="og:title" content={title} />
  {/if}
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  {#if url}
    <meta property="og:url" content={url} />
    <link rel="canonical" href={url} />
  {/if}
  {#if siteName}
    <meta property="og:site_name" content={siteName} />
  {/if}
  <meta property="og:type" content={type} />
  {#if image}
    <meta property="og:image" content={image} />
    {#if imageAlt}
      <meta property="og:image:alt" content={imageAlt} />
    {/if}
  {/if}

  <meta name="twitter:card" content={card} />
  {#if title}
    <meta name="twitter:title" content={title} />
  {/if}
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  {#if image}
    <meta name="twitter:image" content={image} />
    {#if imageAlt}
      <meta name="twitter:image:alt" content={imageAlt} />
    {/if}
  {/if}
</svelte:head>
