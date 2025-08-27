/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as a single column, per requirements
  const headerRow = ['Columns block (columns42)'];

  // Get all <li> elements under the awards-list
  const list = element.querySelector('ul.awards-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li'));
  if (!items.length) return;

  // For each <li>, try to extract the first image (award icon)
  // If no image, fallback to the li's whole content
  const columnsRow = items.map(li => {
    const img = li.querySelector('img');
    if (img) return img;
    // If there is no image, include the whole li
    return li;
  });

  // Compose the cells array as per the columns block structure:
  // Header is a single cell row; second row is as many columns as images/items
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
