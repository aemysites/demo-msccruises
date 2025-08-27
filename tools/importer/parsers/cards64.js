/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const cells = [['Cards (cards64)']];
  // Cards are .itinerary-card elements
  const cards = element.querySelectorAll('.itinerary-card');
  cards.forEach(card => {
    // 1st column: main visible image (not map or logo)
    let imageElem = card.querySelector('.itinerary-card__corporate-poster');
    // fallback if not found
    if (!imageElem) imageElem = card.querySelector('img');

    // 2nd column: all visible, meaningful text content from the card (information + info)
    const contentParts = [];
    // Card info content (titles, durations, available dates, etc.)
    const infoContent = card.querySelector('.itinerary-card__information-content');
    if (infoContent) {
      // Reference the element directly, not cloning (for resilience)
      contentParts.push(infoContent);
    }
    // Ship info, leaving from, disembarkation
    const infoPanel = card.querySelector('.itinerary-info');
    if (infoPanel) {
      contentParts.push(infoPanel);
    }
    // Map image (add only if src is non-empty)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && mapImg.src && mapImg.src.trim() !== '') {
      contentParts.push(mapImg);
    }
    // Ocean Cay logo if present
    const oceanLogo = card.querySelector('.itinerary-card-ocean-cay__logo');
    if (oceanLogo) {
      contentParts.push(oceanLogo);
    }
    // CTA button if present
    const ctaBtn = card.querySelector('.itinerary-info__btn-wrap .button');
    if (ctaBtn) {
      contentParts.push(ctaBtn);
    }
    // Only push rows that contain at least image or text
    if (imageElem || contentParts.length > 0) {
      cells.push([imageElem, contentParts]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
