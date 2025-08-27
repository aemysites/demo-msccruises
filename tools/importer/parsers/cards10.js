/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract the first <img> in a <picture>
  function getImage(picture) {
    if (!picture) return null;
    const img = picture.querySelector('img');
    return img || picture; // prefer <img>, fallback to <picture> for robustness
  }

  // Helper: Compose text block for each card
  function getTextContent(headerDiv) {
    const frag = document.createDocumentFragment();
    // Try to find overtitle and title
    const overtitle = headerDiv.querySelector('.tile__overtitle');
    const title = headerDiv.querySelector('.tile__title');
    if (overtitle) {
      // Use <strong> for overtitle, per example
      const strong = document.createElement('strong');
      strong.textContent = overtitle.textContent;
      frag.appendChild(strong);
    }
    if (title) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(document.createTextNode(title.textContent));
    }
    return frag;
  }

  // Helper: Compose CTA link for each card
  function getCTA(headerDiv) {
    // The CTA button is inside .tile-cta-button .button, but only the text and link matter
    const ctaButton = headerDiv.querySelector('.tile-cta-button .button');
    if (!ctaButton) return null;
    let text = '';
    let href = '';
    const span = ctaButton.querySelector('span');
    if (span) text = span.textContent;
    // Get link from parent anchor
    const anchor = headerDiv.closest('a');
    if (anchor && anchor.getAttribute('href')) {
      href = anchor.getAttribute('href');
    } else if (ctaButton.getAttribute('onclick')) {
      // fallback to onclick if anchor is absent
      const match = ctaButton.getAttribute('onclick').match(/window.location.href='([^']+)'/);
      if (match) href = match[1];
    }
    if (!href || !text) return null;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank';
    return link;
  }

  // Find all direct child tiles
  const tiles = element.querySelectorAll(':scope > .tile');
  const rows = [['Cards (cards10)']]; // Header exactly as in example

  tiles.forEach((tile) => {
    const a = tile.querySelector('a');
    // Image extraction
    const picture = a && a.querySelector('picture');
    const imageEl = getImage(picture);
    // Text block
    const header = a && a.querySelector('header');
    let textFrag = document.createDocumentFragment();
    if (header) {
      // The card's info is inside the first div in <header>
      const contentDiv = header.querySelector('div');
      if (contentDiv) {
        textFrag.appendChild(getTextContent(contentDiv));
      }
      // CTA
      const cta = getCTA(header);
      if (cta) {
        textFrag.appendChild(document.createElement('br'));
        textFrag.appendChild(cta);
      }
    }
    rows.push([
      imageEl,
      textFrag
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
