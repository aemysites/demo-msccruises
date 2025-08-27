/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const tableHeader = ['Cards (cards1)'];
  const rows = [];

  // Find all visible itinerary cards
  const itineraryCards = Array.from(element.querySelectorAll('.itinerary-card.tile--result-search'));
  itineraryCards.forEach(card => {
    // --- First cell: all relevant images (main image and map image) ---
    const images = [];
    const mainImg = card.querySelector('img.itinerary-card__corporate-poster');
    if (mainImg) images.push(mainImg);
    const mapImg = card.querySelector('img.itinerary-card-map__image');
    if (mapImg) images.push(mapImg);
    // Use array if there are images, empty string if none
    const imageCell = images.length > 0 ? images : '';

    // --- Second cell: all visible text content (destination, duration, dates, ship, ports, etc) ---
    // Approach: reference the whole block that contains all card info, to capture all possible text and structure
    // Priority: itinerary-card__information-content + itinerary-info + any always-included list
    const textCellItems = [];
    const infoContent = card.querySelector('.itinerary-card__information-content');
    if (infoContent) textCellItems.push(infoContent);
    const infoBlock = card.querySelector('.itinerary-info');
    if (infoBlock) textCellItems.push(infoBlock);
    // Always included services list: look for matching list in hidden details sibling
    let includedList = null;
    // Details block is always the next sibling (display:none)
    const detailsBlock = card.nextElementSibling;
    if (detailsBlock) {
      const servicesList = detailsBlock.querySelector('ul.itinerary-options__always-included');
      if (servicesList) includedList = servicesList;
    }
    // Fallback: if not found, try to find in card itself
    if (!includedList) {
      const fallbackList = card.querySelector('ul.itinerary-options__always-included');
      if (fallbackList) includedList = fallbackList;
    }
    if (includedList) textCellItems.push(includedList);
    // Defensive: if none found, put the card's info block
    if (textCellItems.length === 0) textCellItems.push(card);

    // Compose row
    rows.push([
      imageCell,
      textCellItems.length === 1 ? textCellItems[0] : textCellItems
    ]);
  });

  // Create table and replace element if cards were found
  if (rows.length > 0) {
    const tableData = [tableHeader, ...rows];
    const block = WebImporter.DOMUtils.createTable(tableData, document);
    element.replaceWith(block);
  }
}
