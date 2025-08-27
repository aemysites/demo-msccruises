/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match exactly, one column only
  const headerRow = ['Cards (cards60)'];
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));
  const cells = [headerRow];

  // For each card, create a row with [image, text] content
  cards.forEach(card => {
    // --- IMAGE CELL ---
    // First image in the card visually represents the card
    let imgCell = card.querySelector('.itinerary-card__corporate-poster');

    // --- TEXT CELL ---
    // Gather all info from info and info-content blocks
    const infoContent = card.querySelector('.itinerary-card__information-content');
    const itineraryInfo = card.querySelector('.itinerary-info');
    let textCellItems = [];

    // Get all visible child nodes (not display:none)
    if (infoContent) {
      // Include all children of infoContent to ensure all text is present
      textCellItems.push(...Array.from(infoContent.childNodes));
    }
    if (itineraryInfo) {
      textCellItems.push(itineraryInfo);
    }
    // If both are missing, fallback to all children except image
    if (textCellItems.length === 0) {
      textCellItems = Array.from(card.children).filter(child => child !== imgCell);
    }

    // Remove any empty text nodes from collection
    textCellItems = textCellItems.filter(node => {
      return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
    });

    // If only one item, use it directly, else use array
    let textCell = textCellItems.length === 1 ? textCellItems[0] : textCellItems;

    cells.push([imgCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
