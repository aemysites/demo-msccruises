/* global WebImporter */
export default function parse(element, { document }) {
  // Setup header row exactly as example
  const cells = [['Cards (cards49)']];

  // Find all itinerary cards; each is a Card
  const cardNodes = Array.from(element.querySelectorAll('.itinerary-card'));

  cardNodes.forEach(card => {
    // --- IMAGE cell ---
    let img = null;
    // Find the main card image: always present in .itinerary-card__information picture img
    const infoImg = card.querySelector('.itinerary-card__information picture img');
    if (infoImg && infoImg.src && infoImg.src.trim()) {
      img = infoImg;
    } else {
      // fallback: first img in card
      const fallbackImg = card.querySelector('img');
      if (fallbackImg && fallbackImg.src && fallbackImg.src.trim()) {
        img = fallbackImg;
      }
    }

    // --- TEXT cell ---
    const frag = document.createDocumentFragment();

    // 1. Title (destination + nights) as heading
    const destDur = card.querySelector('.itinerary-card-detail__destination-and-search-duration');
    if (destDur) {
      const titleSpan = destDur.querySelector('.itinerary-card-detail__destination');
      const durationSpan = destDur.querySelector('.itinerary-card-detail__duration');
      if (titleSpan || durationSpan) {
        const h = document.createElement('strong');
        let txt = '';
        if (titleSpan) txt += titleSpan.textContent.trim();
        if (durationSpan) txt += (txt ? ', ' : '') + durationSpan.textContent.trim();
        h.textContent = txt;
        frag.appendChild(h);
        frag.appendChild(document.createElement('br'));
      }
    }

    // 2. Departure dates block
    const availableDatesBlock = card.querySelector('.available-dates-slider');
    if (availableDatesBlock) {
      const header = availableDatesBlock.querySelector('.available-dates-slider__header');
      const dates = Array.from(availableDatesBlock.querySelectorAll('.available-dates-slider__date')).map(d => d.textContent.trim()).filter(Boolean);
      if (header && dates.length) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(header.textContent.trim() + ': ' + dates.join(', ')));
        frag.appendChild(div);
      }
    }

    // 3. Map image (route) if present and not the main image
    // If there's a second image (map), display it after the dates
    const mapImg = card.querySelector('.itinerary-card-map img');
    if (mapImg && mapImg !== img && mapImg.src && mapImg.src.trim()) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(mapImg);
    }

    // 4. Ship info and embark/disembark ports
    const infoBlock = card.querySelector('.itinerary-info');
    if (infoBlock) {
      // Ship name
      const shipA = infoBlock.querySelector('.itinerary-info__ship');
      if (shipA) {
        const shipDiv = document.createElement('div');
        shipDiv.innerHTML = 'Ship: ';
        shipDiv.appendChild(shipA);
        frag.appendChild(shipDiv);
      }
      // Leaving and disembarkation
      const infoRows = Array.from(infoBlock.querySelectorAll('.itinerary-info__row'));
      infoRows.forEach(row => {
        frag.appendChild(row);
      });
    }

    // 5. Ports list from related hidden details (by order)
    // Grab the .itinerary-details near this card
    let detailsBlock = null;
    let nextSib = card.nextElementSibling;
    while (nextSib) {
      if (nextSib.classList && nextSib.classList.contains('itinerary-details')) {
        detailsBlock = nextSib;
        break;
      }
      nextSib = nextSib.nextElementSibling;
    }
    // If not found, fallback: search for any hidden details parent
    if (!detailsBlock) {
      detailsBlock = card.parentElement.querySelector('.itinerary-details');
    }
    // Ports
    if (detailsBlock) {
      const ports = detailsBlock.querySelector('.itinerary-options--ports .itinerary-ports');
      if (ports && ports.children.length > 0) {
        frag.appendChild(document.createElement('br'));
        frag.appendChild(ports);
      }
      // Always included services
      const included = detailsBlock.querySelector('.itinerary-options--included ul');
      if (included) {
        frag.appendChild(document.createElement('br'));
        const incDiv = document.createElement('div');
        incDiv.appendChild(document.createTextNode('Always included:'));
        incDiv.appendChild(included);
        frag.appendChild(incDiv);
      }
    }

    // Fallback: If fragment is empty, ensure all text in card is present
    if (!frag.textContent.trim()) {
      frag.appendChild(document.createTextNode(card.textContent.trim()));
    }

    // Add row for this card
    cells.push([img, frag]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
