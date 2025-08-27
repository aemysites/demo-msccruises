/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare final table rows with correct header
  const rows = [['Cards (cards4)']];
  // Find all card blocks for cruises (each .itinerary-card)
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));

  cards.forEach(card => {
    // IMAGE cell: use the main cruise image (the first <img> inside the .itinerary-card__information picture)
    let img = card.querySelector('.itinerary-card__information picture img');
    if (!img) img = card.querySelector('img'); // fallback to any image
    // reference the element directly (do not clone)
    const imgCell = img || '';

    // TEXT cell: include all card info as a single block
    const textCell = document.createElement('div');

    // Title (destination and duration)
    const dest = card.querySelector('.itinerary-card-detail__destination');
    const duration = card.querySelector('.itinerary-card-detail__duration');
    if (dest || duration) {
      const h3 = document.createElement('h3');
      let title = '';
      if (dest) title += dest.textContent.trim();
      if (dest && duration) title += ', ';
      if (duration) title += duration.textContent.trim();
      h3.textContent = title;
      textCell.appendChild(h3);
    }

    // Departure dates: combine all date spans
    const dateSpans = Array.from(card.querySelectorAll('.available-dates-slider__date'));
    if (dateSpans.length > 0) {
      const dateDiv = document.createElement('div');
      dateDiv.textContent = 'Available departure date' + (dateSpans.length > 1 ? 's' : '') + ': ';
      for (let i = 0; i < dateSpans.length; i++) {
        const span = document.createElement('span');
        span.textContent = dateSpans[i].textContent.trim();
        dateDiv.appendChild(span);
        if (i < dateSpans.length - 1) dateDiv.append(', ');
      }
      textCell.appendChild(dateDiv);
    }

    // Ship info and port rows
    const ship = card.querySelector('.itinerary-info__ship');
    if (ship) {
      const shipDiv = document.createElement('div');
      shipDiv.textContent = 'Ship: ';
      shipDiv.appendChild(ship);
      textCell.appendChild(shipDiv);
    }
    const infoRows = card.querySelectorAll('.itinerary-info__row');
    infoRows.forEach(row => {
      textCell.appendChild(row);
    });

    // Map image (if present)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg) {
      textCell.appendChild(mapImg);
    }

    // See detail button (if present)
    const btn = card.querySelector('.itinerary-info__btn-wrap');
    if (btn) {
      textCell.appendChild(btn);
    }

    // Defensive: If text cell is still empty, fallback to all text from card
    if (!textCell.hasChildNodes()) {
      textCell.textContent = card.textContent.trim();
    }

    rows.push([imgCell, textCell]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
