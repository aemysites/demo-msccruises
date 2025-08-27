/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const headerRow = ['Cards (cards71)'];
  const rows = [headerRow];

  // Each itinerary card is a card
  const cardElements = element.querySelectorAll('.itinerary-card');
  cardElements.forEach(cardEl => {
    // --- IMAGE CELL ---
    // Always use the first main image of the card
    let imgEl = cardEl.querySelector('.itinerary-card__corporate-poster');
    if (!imgEl) imgEl = cardEl.querySelector('img'); // fallback

    // --- TEXT CELL ---
    const textParts = [];

    // Title: destination + nights
    const destDur = cardEl.querySelector('.itinerary-card-detail__destination-and-search-duration');
    if (destDur) {
      // Use strong to retain semantic heading meaning
      const titleEl = document.createElement('strong');
      titleEl.textContent = destDur.textContent.trim();
      textParts.push(titleEl);
    }

    // Available departure dates
    const datesSlider = cardEl.querySelector('.available-dates-slider');
    if (datesSlider) {
      const label = datesSlider.querySelector('.available-dates-slider__header');
      const dateEls = datesSlider.querySelectorAll('.available-dates-slider__date');
      const dates = Array.from(dateEls).map(el => el.textContent.trim()).filter(Boolean);
      if (label || dates.length) {
        // Compose a block for available dates
        const datesDiv = document.createElement('div');
        if (label) {
          const labelSpan = document.createElement('span');
          labelSpan.textContent = label.textContent.trim();
          datesDiv.appendChild(labelSpan);
        }
        if (dates.length) {
          const list = document.createElement('ul');
          dates.forEach(dateStr => {
            const li = document.createElement('li');
            li.textContent = dateStr;
            list.appendChild(li);
          });
          datesDiv.appendChild(list);
        }
        textParts.push(datesDiv);
      }
    }

    // Ship name
    const shipLink = cardEl.querySelector('.itinerary-info__ship');
    if (shipLink) {
      const shipDiv = document.createElement('div');
      shipDiv.appendChild(document.createTextNode('Ship: '));
      shipDiv.appendChild(shipLink);
      textParts.push(shipDiv);
    }

    // Port info (leaving from, disembarkation)
    const infoRows = cardEl.querySelectorAll('.itinerary-info__row');
    infoRows.forEach(row => {
      const div = document.createElement('div');
      div.textContent = row.textContent.trim();
      textParts.push(div);
    });

    // Map image
    const mapImg = cardEl.querySelector('.itinerary-card-map__image');
    if (mapImg) {
      textParts.push(mapImg);
    }

    // CTA button
    const ctaBtn = cardEl.querySelector('.button__see-detail-text');
    if (ctaBtn && ctaBtn.textContent.trim()) {
      const ctaDiv = document.createElement('div');
      ctaDiv.textContent = ctaBtn.textContent.trim();
      textParts.push(ctaDiv);
    }

    // Add all text parts for the card
    rows.push([imgEl, textParts]);
  });

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
