/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Columns block (columns32)'];

  // Get the main card element (the first .itinerary-card inside .search_results__container)
  const container = element.querySelector('.search_results__container');
  let mainCard = container ? container.querySelector('.itinerary-card') : null;

  if (!mainCard) {
    // Fallback: just replace with nothing if the structure is not as expected
    return;
  }

  // Extract left and right columns (all visual and text content)
  // Left: .itinerary-card__information (image, title, subtitle, etc.)
  // Right: .itinerary-info (ship info, departure/arrival, action button)
  const leftColElem = mainCard.querySelector('.itinerary-card__information');
  const rightColElem = mainCard.querySelector('.itinerary-info');

  // To ensure all text content is present, use a wrapper div and append all children of the respective column
  function wrapColumnContent(srcElem) {
    if (!srcElem) return '';
    const wrapper = document.createElement('div');
    Array.from(srcElem.childNodes).forEach((node) => {
      wrapper.appendChild(node);
    });
    return wrapper.childNodes.length ? wrapper : '';
  }

  const leftCol = wrapColumnContent(leftColElem);
  const rightCol = wrapColumnContent(rightColElem);

  // Compose the table as in the example (header row, then [left, right])
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}