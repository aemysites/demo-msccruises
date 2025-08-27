/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, exactly as example
  const headerRow = ['Columns (columns44)'];

  // Defensive: only process <ul> that has <li> children
  const items = Array.from(element.children).filter(el => el.tagName === 'LI');
  if (!items.length) return;

  // Each column is a cell, collecting icon, title, and description for each
  const columns = items.map((li) => {
    // Each <li> contains: icon div (with picture/img), title div, description div
    const parts = [];
    // Icon
    const iconDiv = li.querySelector('.icon-list__icon');
    if (iconDiv) {
      const img = iconDiv.querySelector('img');
      if (img) parts.push(img);
    }
    // Title
    const titleDiv = li.querySelector('.icon-list__title');
    if (titleDiv) parts.push(titleDiv);
    // Description
    const descDiv = li.querySelector('.icon-list__description');
    if (descDiv) parts.push(descDiv);
    // Return cell: if only one element, just that; else, array of elements
    return parts.length === 1 ? parts[0] : parts;
  });

  // Table rows: header, then columns row
  const tableRows = [headerRow, columns];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace original element with the new table
  element.replaceWith(table);
}
