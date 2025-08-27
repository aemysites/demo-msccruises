/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns block (columns39)'];

  // Locate the main flex container holding the columns
  const blocksContainer = element.querySelector('.editorial-text--blocks .flex--helper');
  if (!blocksContainer) return;

  // Find all direct block columns inside the flex container
  const columnElements = Array.from(blocksContainer.querySelectorAll(':scope > .editorial-text--blocks__block'));

  // Defensive: if there are no columns, don't process.
  if (!columnElements.length) return;

  // The columns row must have the same number of columns as found in the HTML
  // Reference the actual existing elements (don't clone or create new ones)
  const columnsRow = columnElements;

  // Compose the table structure
  const cells = [headerRow, columnsRow];

  // Create the block table using the WebImporter helper
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
