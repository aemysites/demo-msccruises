/* global WebImporter */
export default function parse(element, { document }) {
  // The example shows a two-column block: left is the image, right is the text content.
  // The block header is exactly 'Columns block (columns17)'.

  // 1. Header row for the block table
  const headerRow = ['Columns block (columns17)'];

  // 2. Get the two column elements from the block
  // In this HTML, image is inside <picture>, text is the sibling div

  // Find the direct children of the block
  const children = Array.from(element.querySelectorAll(':scope > *'));
  // Find picture element (first <picture> descendant)
  let picture = element.querySelector('picture');
  // If not found directly, look in children
  if (!picture) {
    picture = children.find((child) => child.tagName === 'PICTURE' || child.querySelector('picture'));
  }

  // Find the text column (the div with 'editorial-image-text--middle__paragraph' class)
  let textColumn = element.querySelector('.editorial-image-text--middle__paragraph');
  if (!textColumn) {
    // fallback: use the first non-picture child as text content
    textColumn = children.find((child) => child !== picture);
  }

  // Edge case: if either column missing, use empty cell so table shape is correct
  const columnsRow = [picture || '', textColumn || ''];

  // 3. Structure table: header row, then columns content row
  const cells = [headerRow, columnsRow];

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element with the new block table
  element.replaceWith(block);
}
