/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible itinerary cards
  const cards = Array.from(element.querySelectorAll('.itinerary-card'));
  // Start table structure with exact header from example
  const rows = [['Cards (cards54)']];

  cards.forEach(card => {
    // Extract image(s) from the card (always reference originals)
    const mainImg = card.querySelector('.itinerary-card__information img');
    const mapImg = card.querySelector('.itinerary-card-map__image');
    let imageCell = '';
    if (mainImg && mapImg) {
      imageCell = [mainImg, mapImg];
    } else if (mainImg) {
      imageCell = mainImg;
    } else if (mapImg) {
      imageCell = mapImg;
    }

    // Compose all text content for the card as a single cell
    // Reference full info blocks, not just parts or clones
    const textBlocks = [];
    // .itinerary-card__information-content contains destination, dates, detail etc
    const infoContent = card.querySelector('.itinerary-card__information-content');
    if (infoContent) textBlocks.push(infoContent);
    // .itinerary-info contains ship name, departure/return, button
    const infoBlock = card.querySelector('.itinerary-info');
    if (infoBlock) textBlocks.push(infoBlock);
    // Defensive fallback: if nothing found, use empty string
    const textCell = textBlocks.length ? textBlocks : '';

    // Always create a 2-column row (image, text)
    rows.push([imageCell, textCell]);
  });

  // Create the block using the helper function
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
