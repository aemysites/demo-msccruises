/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell, even though the data rows have two cells.
  // So we build: cells = [[header]], [image, text], [image, text], ...]
  const cells = [['Cards (cards6)']];

  // Get all cards (itinerary-card)
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));
  // Get all details blocks (in order, matches visible cards)
  const detailsBlocks = Array.from(element.querySelectorAll('.itinerary-details'));

  cards.forEach((card, idx) => {
    // IMAGE CELL: Use referenced existing elements
    const infoImg = card.querySelector('img.itinerary-card__corporate-poster');
    const mapImg = card.querySelector('img.itinerary-card-map__image');
    const imageDiv = document.createElement('div');
    if (infoImg) imageDiv.appendChild(infoImg);
    if (mapImg) imageDiv.appendChild(mapImg);
    const imageCell = imageDiv.childNodes.length ? imageDiv : '';

    // TEXT CELL: reference as much content as possible, preserve semantic blocks
    const textParts = [];

    // Get the main info content (destination, nights, available dates)
    const infoContent = card.querySelector('.itinerary-card__information-content');
    if (infoContent) {
      textParts.push(infoContent);
    }
    // Get ship and port info
    const infoShip = card.querySelector('.itinerary-info');
    if (infoShip) {
      textParts.push(infoShip);
    }

    // Get details block for this card (by order)
    const details = detailsBlocks[idx];
    if (details) {
      // Always included features block (ul)
      const includedWrap = details.querySelector('.itinerary-options--included');
      if (includedWrap) {
        textParts.push(includedWrap);
      }
      // Ports list (with days and port names)
      const portsWrap = details.querySelector('.itinerary-options--ports');
      if (portsWrap) {
        textParts.push(portsWrap);
      }
    }

    // If nothing found, fall back to all card text
    let textCell;
    if (textParts.length) {
      const frag = document.createDocumentFragment();
      textParts.forEach(part => frag.appendChild(part));
      textCell = frag;
    } else {
      textCell = card.textContent.trim();
    }

    cells.push([imageCell, textCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
