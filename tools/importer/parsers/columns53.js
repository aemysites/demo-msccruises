/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Columns block (columns53)'];

  // Extract left column: editorial__item__description (contains heading, text, button)
  const leftCol = element.querySelector('.editorial__item__description');
  // Defensive: fallback if not found
  const leftContent = leftCol ? leftCol : document.createElement('div');

  // Extract right column: editorial__item__image
  const rightImageWrap = element.querySelector('.editorial__item__image');
  let rightContent = document.createElement('div');
  if (rightImageWrap) {
    // Use the <picture> element as the image block
    const pic = rightImageWrap.querySelector('picture');
    if (pic) {
      rightContent.appendChild(pic);
    }
  }

  // Compose table cells (first row: header, second row: columns)
  const cells = [headerRow, [leftContent, rightContent]];

  // Create columns block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
