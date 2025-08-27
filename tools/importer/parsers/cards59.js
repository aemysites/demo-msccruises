/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly matching the example
  const cells = [['Cards (cards59)']];

  // Find all itinerary-card elements (each is a card)
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));

  cards.forEach(card => {
    // --- Image ---
    let imgEl = card.querySelector('img.itinerary-card__corporate-poster');
    if (!imgEl) {
      // fallback: first image in card
      imgEl = card.querySelector('img');
    }

    // --- Text Content ---
    // Compose a block of content preserving semantic meaning
    const textFragments = [];

    // Card Headline: destination and duration
    const dest = card.querySelector('.itinerary-card-detail__destination');
    const dur = card.querySelector('.itinerary-card-detail__duration');
    if (dest || dur) {
      const heading = document.createElement('strong');
      let headline = '';
      if (dest) headline += dest.textContent.trim();
      if (dest && dur) headline += ', ';
      if (dur) headline += dur.textContent.trim();
      heading.textContent = headline;
      textFragments.push(heading);
    }

    // Ship info and port details
    const infoBlock = card.querySelector('.itinerary-info > div');
    if (infoBlock) {
      Array.from(infoBlock.children).forEach(child => {
        // Accept <a>, <div>, <span>, <b>
        if (['A', 'DIV', 'SPAN', 'B'].includes(child.tagName)) {
          textFragments.push(child);
        }
      });
    }

    // Available dates header and all dates
    const datesHeader = card.querySelector('.available-dates-slider__header');
    if (datesHeader) textFragments.push(datesHeader);
    const datesEls = Array.from(card.querySelectorAll('.available-dates-slider__date'));
    datesEls.forEach(d => textFragments.push(d));

    // Map image, include in text as well as image cell in case it holds unique info
    const mapImg = card.querySelector('.itinerary-card-map__image');
    if (mapImg) textFragments.push(mapImg);

    // CTA Button
    const btn = card.querySelector('.itinerary-info__btn-wrap button');
    if (btn) textFragments.push(btn);

    // Always included services (from hidden sibling .itinerary-details)
    // Follow document order, reference existing element
    let details = card.nextElementSibling;
    if (details && details.classList.contains('itinerary-details')) {
      const included = details.querySelector('.itinerary-options--included');
      if (included) textFragments.push(included);
    }

    // Fallback if textFragments are empty: add all visible text in paragraphs/spans in card
    if (textFragments.length === 0) {
      Array.from(card.querySelectorAll('p, span, b, a')).forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          textFragments.push(el);
        }
      });
    }

    // Add the card row, referencing existing elements where possible
    cells.push([
      imgEl || '',
      textFragments.length === 1 ? textFragments[0] : textFragments
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
