/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exact match to example
  const headerRow = ['Cards (cards62)'];

  // Select all main card elements
  let cardNodes = [];
  if (element.classList.contains('search-result')) {
    cardNodes = Array.from(element.querySelectorAll(':scope .itinerary-card'));
  } else {
    cardNodes = Array.from(element.querySelectorAll(':scope > .itinerary-card'));
  }

  const rows = cardNodes.map(card => {
    // --- IMAGE CELL ---
    let img = card.querySelector('.itinerary-card__corporate-poster');
    if (!img) {
      img = card.querySelector('img');
    }

    // --- TEXT CELL ---
    // Combine all relevant content for the card, referencing existing elements
    const infoParts = [];
    // Title: destination + duration
    const dest = card.querySelector('.itinerary-card-detail__destination');
    const duration = card.querySelector('.itinerary-card-detail__duration');
    if (dest || duration) {
      const strong = document.createElement('strong');
      let title = '';
      if (dest) title += dest.textContent.trim();
      if (duration) title += ', ' + duration.textContent.trim();
      strong.textContent = title;
      infoParts.push(strong);
    }
    // Available dates
    const datesHeader = card.querySelector('.available-dates-slider__header');
    if (datesHeader) {
      infoParts.push(datesHeader);
    }
    const dates = Array.from(card.querySelectorAll('.available-dates-slider__date'));
    if (dates.length) {
      const dateDiv = document.createElement('div');
      dates.forEach((d, i) => {
        dateDiv.appendChild(document.createTextNode(d.textContent.trim()));
        if (i < dates.length - 1) dateDiv.appendChild(document.createTextNode(', '));
      });
      infoParts.push(dateDiv);
    }
    // Map image within media (use element reference if present)
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg && mapImg.src && mapImg.src.trim() !== '') {
      infoParts.push(mapImg);
    }
    // Ship and port info (reference the entire .itinerary-info block for full text)
    const infoBlock = card.querySelector('.itinerary-info');
    if (infoBlock) {
      infoParts.push(infoBlock);
    }
    // CTA button ("See detail")
    const ctaBtn = card.querySelector('.itinerary-info__btn-wrap');
    if (ctaBtn) {
      infoParts.push(ctaBtn);
    }
    // Hidden next sibling: details (ports, always included)
    let detailsDiv = card.nextElementSibling;
    if (detailsDiv && detailsDiv.style && detailsDiv.style.display === 'none') {
      // Ports
      const ports = detailsDiv.querySelector('.itinerary-ports');
      if (ports && ports.children.length) {
        infoParts.push(ports);
      }
      // Always included list
      const alwaysInc = detailsDiv.querySelector('.itinerary-options--included');
      if (alwaysInc) {
        infoParts.push(alwaysInc);
      }
    }
    // Fallback: if infoParts missing, use all text content
    if (infoParts.length === 0) {
      let txt = card.textContent.trim();
      if (txt) infoParts.push(txt);
    }
    // Only include rows that have both image and some text content
    if (img && infoParts.length > 0 && infoParts.some(part => (part.textContent || (typeof part === 'string' && part)))) {
      return [img, infoParts];
    } else {
      return null;
    }
  }).filter(Boolean);

  // Build and replace table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
