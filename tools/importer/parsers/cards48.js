/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards48)'];
  // Gather each card
  const cardRows = [];
  // Select all direct children with class 'tile'
  const tiles = element.querySelectorAll(':scope > .tile');
  tiles.forEach(tile => {
    // Find the image for the card (always a <picture> element)
    let picture = tile.querySelector('picture');
    let imageEl = picture;
    // Compose the text cell
    let header = tile.querySelector('header');
    const textContentElements = [];
    if (header) {
      // Overtitle (top line, normal text)
      const overtitle = header.querySelector('.tile__overtitle');
      if (overtitle && overtitle.textContent.trim()) {
        const div = document.createElement('div');
        div.textContent = overtitle.textContent;
        textContentElements.push(div);
      }
      // Title (next line, bold)
      const title = header.querySelector('.tile__title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textContentElements.push(strong);
      }
      // CTA Button
      const ctaButton = header.querySelector('.tile-cta-button .button');
      if (ctaButton) {
        let btnText = '';
        let btnLink = null;
        // The text may be in a <span> inside button
        const span = ctaButton.querySelector('span');
        if (span && span.textContent.trim()) {
          btnText = span.textContent.trim();
        } else if (ctaButton.textContent.trim()) {
          btnText = ctaButton.textContent.trim();
        }
        // Find link
        // Case 1: wrapping <a> (like second card)
        let wrappingLink = tile.closest('a[href]') || tile.querySelector('a[href]');
        if (wrappingLink && wrappingLink.getAttribute('href')) {
          btnLink = wrappingLink.getAttribute('href');
        }
        // Case 2: button with onclick="window.location.href='...'"
        if (!btnLink && ctaButton.getAttribute('onclick')) {
          const onclick = ctaButton.getAttribute('onclick');
          const m = onclick.match(/window.location.href\s*=\s*'([^']+)'/);
          if (m && m[1]) btnLink = m[1];
        }
        if (btnText && btnLink) {
          const a = document.createElement('a');
          a.href = btnLink;
          a.textContent = btnText;
          textContentElements.push(a);
        } else if (btnText) {
          const spanEl = document.createElement('span');
          spanEl.textContent = btnText;
          textContentElements.push(spanEl);
        }
      }
    }
    // Add row: [image, text content]
    cardRows.push([imageEl, textContentElements]);
  });
  // Assemble table structure
  const cells = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
