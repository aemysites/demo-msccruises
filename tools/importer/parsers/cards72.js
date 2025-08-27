/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell with exact block name
  const headerRow = ['Cards (cards72)'];

  // Find all immediate child tiles (cards)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div.tile'));

  const rows = cardDivs.map(card => {
    // Find the image (if present)
    let img = null;
    const anchor = card.querySelector('a');
    if (anchor) {
      const picture = anchor.querySelector('picture');
      img = picture && picture.querySelector('img');
    }

    // Collect all visible text in the card's header (including ribbon, title, button text)
    const textContentEls = [];
    // Ribbon (year label)
    const ribbon = card.querySelector('.msc-ribbon');
    if (ribbon && ribbon.textContent.trim()) {
      textContentEls.push(ribbon);
    }
    // Title text from .tile__title (if any)
    const tileTitle = card.querySelector('.tile__title');
    if (tileTitle && tileTitle.textContent.trim()) {
      // Use strong for semantic heading as example
      const strongTitle = document.createElement('strong');
      strongTitle.textContent = tileTitle.textContent.trim();
      textContentEls.push(strongTitle);
    }
    // If .tile__title is empty, fallback to image alt text
    if ((!tileTitle || !tileTitle.textContent.trim()) && img && img.getAttribute('alt')) {
      const altTitle = document.createElement('strong');
      altTitle.textContent = img.getAttribute('alt');
      textContentEls.push(altTitle);
    }
    // CTA button text (Browse)
    const ctaButton = card.querySelector('.tile-cta-button .button span');
    if (ctaButton && anchor && anchor.href) {
      // Create a link for CTA
      const ctaLink = document.createElement('a');
      ctaLink.href = anchor.href;
      ctaLink.textContent = ctaButton.textContent.trim();
      ctaLink.target = '_blank';
      textContentEls.push(ctaLink);
    }
    // If there are other relevant text nodes (i.e. .tile__overtitle, etc.)
    const overtitle = card.querySelector('.tile__overtitle');
    if (overtitle && overtitle.textContent.trim()) {
      const overtitleEl = document.createElement('div');
      overtitleEl.textContent = overtitle.textContent.trim();
      textContentEls.push(overtitleEl);
    }

    // For semantic meaning, preserve order: ribbon, overtitle, title (or alt), CTA
    // If all textContentEls empty, fallback to anchor's title/alt
    if (textContentEls.length === 0 && anchor && anchor.title) {
      const fallbackTitle = document.createElement('strong');
      fallbackTitle.textContent = anchor.title;
      textContentEls.push(fallbackTitle);
    }

    // Compose the card row: [image, text block]
    return [img || '', textContentEls];
  });

  // Compose final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
