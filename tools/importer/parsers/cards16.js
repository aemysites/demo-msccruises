/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards16)'];
  const rows = [];

  // Get all direct child .tile elements
  const tiles = element.querySelectorAll(':scope > .tile');

  tiles.forEach(tile => {
    // Find anchor containing most card content
    const anchor = tile.querySelector('a');
    if (!anchor) return;

    // --- Image Cell ---
    let imageCell = '';
    const picture = anchor.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) imageCell = img;
    }
    // If there is a ribbon, prepend it above image
    const ribbon = anchor.querySelector('.msc-ribbon');
    if (ribbon) {
      // Use the ribbon and image together as a new div
      const wrapper = document.createElement('div');
      wrapper.appendChild(ribbon);
      if (imageCell) {
        wrapper.appendChild(imageCell);
      }
      imageCell = wrapper;
    }

    // --- Text Cell ---
    const textParts = [];
    // Get header
    const header = anchor.querySelector('header');
    if (header) {
      // Find .tile__overtitle (as title or subheading)
      const overtitle = header.querySelector('.tile__overtitle');
      if (overtitle && overtitle.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = overtitle.textContent.trim();
        textParts.push(strong);
      }
      // Find .tile__title (as description)
      const title = header.querySelector('.tile__title');
      if (title && title.textContent.trim()) {
        const desc = document.createElement('div');
        desc.textContent = title.textContent.trim();
        textParts.push(desc);
      }
      // Find CTA button text (if present)
      const ctaButton = header.querySelector('.tile-cta-button .button');
      if (ctaButton) {
        const ctaSpan = ctaButton.querySelector('span');
        if (ctaSpan && ctaSpan.textContent.trim()) {
          const ctaLink = document.createElement('a');
          ctaLink.href = anchor.href;
          ctaLink.textContent = ctaSpan.textContent.trim();
          textParts.push(ctaLink);
        }
      }
    }
    // Wrap textParts in a single div for semantic grouping
    const textCell = document.createElement('div');
    textParts.forEach(part => textCell.appendChild(part));

    rows.push([imageCell, textCell]);
  });

  // Build the final table structure
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
