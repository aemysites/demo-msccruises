/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const cells = [['Cards (cards38)']];

  // Find the container holding the cards
  const tileContainer = element.querySelector('.tile-container');
  if (!tileContainer) return;

  const tiles = tileContainer.querySelectorAll(':scope > .tile--news-blog');

  tiles.forEach(tile => {
    // Get image (first <img> inside <picture>)
    let img = null;
    const picture = tile.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }
    // If no img, leave cell empty
    const imageCell = img ? img : '';

    // Get title content
    let titleText = '';
    const titleDiv = tile.querySelector('.tile__title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) titleText = h3.textContent.trim();
    }

    // Get description paragraphs (skip empty ones)
    let descElements = [];
    const descDiv = tile.querySelector('.tile--news-blog__description');
    if (descDiv) {
      descElements = Array.from(descDiv.querySelectorAll('p')).filter(p => p.textContent.trim() !== '');
    }

    // Get CTA
    let cta = null;
    const flexContainer = tile.querySelector('.flex-container');
    if (flexContainer) {
      cta = flexContainer.querySelector('a');
    }

    // Assemble text content for cell
    const textCellContent = [];
    if (titleText) {
      // Use <strong> for bold title as is common in cards block
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = titleText;
      textCellContent.push(titleStrong);
    }
    descElements.forEach(p => textCellContent.push(p));
    if (cta) textCellContent.push(cta);

    // If only one element, use directly; else use array
    const textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

    cells.push([imageCell, textCell]);
  });

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
