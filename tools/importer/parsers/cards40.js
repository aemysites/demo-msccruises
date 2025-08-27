/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container that holds all cards
  const cardsContainer = element.querySelector('.search_results__container .tile-container--results');
  if (!cardsContainer) return;

  // Get all card elements
  const cardElements = Array.from(cardsContainer.querySelectorAll(':scope > .skeleton-itinerary-card'));

  // Create header row exactly as in the example
  const cells = [['Cards (cards40)']];

  cardElements.forEach(card => {
    // Card left (image/icon placeholder)
    const left = card.querySelector('.skeleton-itinerary-card__left');
    // Card right (text/CTA placeholder)
    const right = card.querySelector('.skeleton-itinerary-card__right');

    // Get all children for left (usually two .skeleton-itinerary-card__text)
    const leftContent = left ? Array.from(left.children) : [];
    // For block table, reference array if >1 else single element
    const leftCell = leftContent.length === 1 ? leftContent[0] : leftContent;

    // For right, the main content is in the first child div, which contains 3 children
    let rightContent = [];
    if (right) {
      const rightInner = right.querySelector(':scope > div');
      if (rightInner) {
        rightContent = Array.from(rightInner.children);
      } else {
        rightContent = Array.from(right.children);
      }
    }
    const rightCell = rightContent.length === 1 ? rightContent[0] : rightContent;

    cells.push([leftCell, rightCell]);
  });

  // Create and replace with table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
