/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards56)'];

  // Find all cards
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));
  const rows = cards.map(card => {
    // 1. First column: main card image
    const img = card.querySelector('img.itinerary-card__corporate-poster');
    if (!img) return null;

    // 2. Second column: collect all text and content, including info, destination, duration, dates, ship, ports, includes, cta
    const parts = [];

    // Card info section (destination, duration, dates, map)
    const infoSection = card.querySelector('.itinerary-card__information-content');
    if (infoSection) parts.push(infoSection);

    // Card itinerary-info (ship, ports, cta)
    const itineraryInfo = card.querySelector('.itinerary-info');
    if (itineraryInfo) parts.push(itineraryInfo);

    // Map image (if not already included in infoSection)
    // (The map is inside .itinerary-card-media, but only add if not present in infoSection)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && !(infoSection && infoSection.contains(mapImg))) parts.push(mapImg);

    // Details (ports, always included) are in a hidden div immediately after the card
    let details = card.nextElementSibling;
    if (details && details.style && details.style.display === 'none') {
      // Only push relevant sub-sections for clarity
      const portsSection = details.querySelector('.itinerary-options--ports');
      if (portsSection) parts.push(portsSection);
      const includedSection = details.querySelector('.itinerary-options--included');
      if (includedSection) parts.push(includedSection);
    }

    // Defensive: If nothing, put empty string
    return [img, parts.length ? parts : ''];
  }).filter(Boolean);

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
