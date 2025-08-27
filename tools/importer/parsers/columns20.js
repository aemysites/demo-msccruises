/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container inside the block
  const item = element.querySelector('.editorial__item');
  if (!item) return;

  // Get the two main columns: description and image
  const desc = item.querySelector('.editorial__item__description');
  const img = item.querySelector('.editorial__item__image');
  
  // Defensive: if missing, fallback to all children
  let col1 = desc, col2 = img;
  if (!desc || !img) {
    const children = Array.from(item.children).filter(child => child.nodeType === 1);
    col1 = children[0] || document.createElement('div');
    col2 = children[1] || document.createElement('div');
  }

  // Build the header row exactly as required
  const headerRow = ['Columns block (columns20)'];
  const columnsRow = [col1, col2];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
