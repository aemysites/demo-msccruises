/* global WebImporter */
export default function parse(element, { document }) {
  // The header for this block exactly as in example
  const headerRow = ['Cards (cards65)'];
  const rows = [];
  // Find all itinerary cards in the block (visible only!)
  const cards = element.querySelectorAll('.itinerary-card');
  cards.forEach(card => {
    // 1. IMAGE CELL: main card image (prefer .itinerary-card__corporate-poster, fallback to first img)
    let imgCell = null;
    let cardImg = card.querySelector('.itinerary-card__corporate-poster');
    if (!cardImg) cardImg = card.querySelector('img');
    if (cardImg) imgCell = cardImg;
    // 2. TEXT CELL: combine information-rich blocks
    const textCellElements = [];
    // Title: destination & nights (as <strong>text</strong>)
    const dest = card.querySelector('.itinerary-card-detail__destination');
    const nights = card.querySelector('.itinerary-card-detail__duration');
    if (dest && nights) {
      const title = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = dest.textContent.trim() + ', ' + nights.textContent.trim();
      title.appendChild(strong);
      textCellElements.push(title);
    }
    // Ship info link (if present)
    const ship = card.querySelector('.itinerary-info__ship');
    if (ship) {
      textCellElements.push(ship);
    }
    // Leaving from / Disembark info (as text)
    card.querySelectorAll('.itinerary-info__row').forEach(row => {
      // Each row contains a <b> label and <span> value
      textCellElements.push(row);
    });
    // Available dates as a simple text string
    const dates = Array.from(card.querySelectorAll('.available-dates-slider__date')).map(d=>d.textContent.trim()).filter(Boolean);
    if (dates.length) {
      const datesDiv = document.createElement('div');
      datesDiv.textContent = 'Available dates: ' + dates.join(', ');
      textCellElements.push(datesDiv);
    }
    // Map image (if present and has a src)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && mapImg.src && mapImg.src.trim() && !/itineraryMapUrl/i.test(mapImg.alt)) {
      textCellElements.push(mapImg);
    }
    // Special logo for cards with logo (eg. Ocean Cay)
    const logo = card.querySelector('.itinerary-card-ocean-cay__logo');
    if (logo) textCellElements.push(logo);
    // Call-to-action: button label (as plain text, since no href)
    const ctaBtn = card.querySelector('.itinerary-info__btn-wrap .button');
    if (ctaBtn) {
      const ctaDiv = document.createElement('div');
      ctaDiv.textContent = ctaBtn.textContent.trim();
      textCellElements.push(ctaDiv);
    }
    // If no info, fallback to all visible text in the card
    if (!textCellElements.length) {
      const fallback = document.createElement('div');
      fallback.textContent = card.textContent.trim();
      textCellElements.push(fallback);
    }
    rows.push([imgCell, textCellElements]);
  });
  // Compose the table as required
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
