/**
 * Location map — loads the Google Maps iframe only when the visitor asks.
 * Embedding it on page load added third-party cookies and ~100 KB of
 * scripts to every visit (Lighthouse: Best Practices and Performance).
 */
export function initMap(container = document.querySelector('[data-map]')) {
  if (!container) return;

  const button = container.querySelector('[data-map-load]');

  button?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = container.dataset.mapSrc;
    iframe.title = container.dataset.mapTitle;
    iframe.width = '600';
    iframe.height = '400';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;

    container.querySelector('.map-placeholder').replaceWith(iframe);
    // Keeps keyboard users where they were instead of dropping focus to <body>
    iframe.focus();
  });
}
