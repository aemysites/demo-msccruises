/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly, single column
  const headerRow = ['Cards (cards55)'];

  // Get all itinerary cards
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));
  const rows = [];

  cards.forEach(card => {
    // First cell: main image (reference existing element)
    let mainImg = card.querySelector('.itinerary-card__corporate-poster');
    if (!mainImg) {
      mainImg = card.querySelector('img');
    }

    // Second cell: all card text and relevant content
    const textParts = [];

    // Title (destination and nights)
    const infoContent = card.querySelector('.itinerary-card__information-content');
    const detail = infoContent && infoContent.querySelector('.itinerary-card-detail__destination-and-search-duration');
    if (detail) {
      const dest = detail.querySelector('.itinerary-card-detail__destination_corporate');
      const nights = detail.querySelector('.itinerary-card-detail__duration_corporate');
      if (dest || nights) {
        const title = document.createElement('strong');
        title.textContent = [dest?.textContent.trim(), nights?.textContent.trim()].filter(Boolean).join(', ');
        textParts.push(title);
      }
    }

    // Available Date
    const dateEl = infoContent && infoContent.querySelector('.available-dates-slider__date');
    if (dateEl) {
      const dateTxt = document.createElement('div');
      dateTxt.textContent = 'Available date: ' + dateEl.textContent.trim();
      textParts.push(dateTxt);
    }

    // Map image (reference existing element)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg) {
      textParts.push(mapImg);
    }

    // Ship name & port details (all text from .itinerary-info)
    const infoBox = card.querySelector('.itinerary-info');
    if (infoBox) {
      // Ship name
      const ship = infoBox.querySelector('.itinerary-info__ship');
      if (ship) textParts.push(ship);
      // Info rows
      Array.from(infoBox.querySelectorAll('.itinerary-info__row')).forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.textContent = row.textContent.trim();
        textParts.push(rowDiv);
      });
    }

    // CTA (see detail button)
    const btnWrap = card.querySelector('.itinerary-info__btn-wrap');
    if (btnWrap) {
      const btn = btnWrap.querySelector('button');
      if (btn) {
        const ctaDiv = document.createElement('div');
        ctaDiv.textContent = btn.textContent.trim();
        textParts.push(ctaDiv);
      }
    }

    // Fallback: if no visible text, add all card text
    if (!textParts.length) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.textContent = card.textContent.trim();
      textParts.push(fallbackDiv);
    }

    rows.push([mainImg, textParts]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
