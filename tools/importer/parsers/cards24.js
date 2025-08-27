/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards24)'];
  const rows = [];
  // Find all card tiles
  const tiles = element.querySelectorAll(':scope > .tile');
  tiles.forEach(tile => {
    // Get image (first <img> inside <picture>)
    let imgEl = null;
    const picture = tile.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    // Compose text cell from .tile__title (includes title and description)
    let textContent = [];
    const titleDiv = tile.querySelector('header .tile__title');
    if (titleDiv) {
      // Use all child nodes (to preserve <p>, <em>, <span>, etc.)
      titleDiv.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          textContent.push(node);
        }
      });
    }
    // If nothing found in .tile__title, skip this card
    if (!imgEl && textContent.length === 0) return;
    rows.push([
      imgEl,
      textContent
    ]);
  });
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
