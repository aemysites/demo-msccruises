/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as in the example
  const headerRow = ['Cards (cards68)'];
  const rows = [headerRow];

  // Select all card elements
  const cards = Array.from(element.querySelectorAll('.itinerary-card_corporate'));

  cards.forEach(card => {
    // --- Column 1: Images ---
    const images = [];
    // Main card image (first in .itinerary-card__information)
    const mainImg = card.querySelector('.itinerary-card__information img');
    if (mainImg) images.push(mainImg);
    // Map image
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && mapImg !== mainImg) images.push(mapImg);
    const imageCell = images.length === 1 ? images[0] : images;

    // --- Column 2: Text content ---
    const textEls = [];
    // 1. Destination and Duration as Heading (strong)
    const dest = card.querySelector('.itinerary-card-detail__destination');
    const duration = card.querySelector('.itinerary-card-detail__duration');
    if (dest && duration) {
      const strong = document.createElement('strong');
      strong.textContent = `${dest.textContent.trim()}, ${duration.textContent.trim()}`;
      textEls.push(strong);
    }

    // 2. Available date(s) (all text from .available-dates-slider__date)
    const dateDivs = card.querySelectorAll('.available-dates-slider__date');
    dateDivs.forEach(dateDiv => {
      const p = document.createElement('p');
      p.textContent = dateDiv.textContent.trim();
      textEls.push(p);
    });

    // 3. Ship Info
    const infoDiv = card.querySelector('.itinerary-info > div');
    if (infoDiv) {
      // Ship name (as link)
      const shipLink = infoDiv.querySelector('.itinerary-info__ship');
      if (shipLink) {
        textEls.push(shipLink);
      }
      // Info rows (Leaving from, Disembarkation port)
      const rowsEls = infoDiv.querySelectorAll('.itinerary-info__row');
      rowsEls.forEach(row => textEls.push(row));
    }

    // 4. 'Always included' list (find in the hidden sibling div)
    let alwaysIncludedList = null;
    let detailsBlock = card.nextElementSibling;
    if (detailsBlock && detailsBlock.querySelector) {
      alwaysIncludedList = detailsBlock.querySelector('.itinerary-options__always-included');
    }
    if (alwaysIncludedList) {
      textEls.push(alwaysIncludedList);
    }

    // 5. If no structured text found, fall back to all visible card text
    if (textEls.length === 0) {
      // This should only occur if HTML structure changes
      textEls.push(card.textContent.trim());
    }

    rows.push([imageCell, textEls]);
  });

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
