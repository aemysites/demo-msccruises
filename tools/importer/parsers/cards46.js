/* global WebImporter */
export default function parse(element, { document }) {
  // Get the cards container
  const container = element.querySelector('.search_results__container');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll(':scope > div.itinerary-card'));
  if (!cards.length) return;

  const rows = [['Cards (cards46)']]; // Header row, matches the example exactly

  // Helper to get all images for the left cell
  function getLeftCell(card) {
    const leftCell = [];
    // Card image
    const mainImg = card.querySelector('img.itinerary-card__corporate-poster');
    if (mainImg) leftCell.push(mainImg);
    // Map image within the card
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && mapImg.src) leftCell.push(mapImg);
    // Ocean Cay logo if present
    const oceanLogo = card.querySelector('.itinerary-card-ocean-cay__logo');
    if (oceanLogo) leftCell.push(oceanLogo);
    // If no images, the cell is empty
    if (leftCell.length === 0) {
      return '';
    } else if (leftCell.length === 1) {
      return leftCell[0];
    } else {
      return leftCell;
    }
  }

  // Helper for right cell: ensure all relevant text content is captured
  function getRightCell(card) {
    const frag = document.createDocumentFragment();

    // Extract all major content blocks
    // 1. Itinerary info (ship, leaving/disembark, CTA)
    const infoSection = card.querySelector('.itinerary-info');
    if (infoSection) frag.appendChild(infoSection);

    // 2. Main card info (destination, duration, available dates)
    const infoContent = card.querySelector('.itinerary-card__information-content');
    if (infoContent) frag.appendChild(infoContent);

    // 3. Always included services
    const alwaysIncluded = card.querySelector('.itinerary-options--included');
    if (alwaysIncluded) frag.appendChild(alwaysIncluded);

    // 4. Hidden details block for ports, etc.
    let detailsBlock = null;
    let nextEl = card.nextElementSibling;
    while (nextEl) {
      const details = nextEl.querySelector?.('.itinerary-details--corporate');
      if (details) {
        detailsBlock = details;
        break;
      }
      nextEl = nextEl.nextElementSibling;
    }
    if (detailsBlock) frag.appendChild(detailsBlock);

    // 5. If nothing was appended, fallback to all text from card
    if (!frag.childNodes.length) {
      frag.appendChild(document.createTextNode(card.textContent.trim()));
    }
    return frag;
  }

  // Build all card rows
  cards.forEach(card => {
    rows.push([
      getLeftCell(card),
      getRightCell(card)
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
