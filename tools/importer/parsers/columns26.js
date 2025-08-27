/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per instructions and example
  const headerRow = ['Columns block (columns26)'];

  // Defensive: find the first .editorial__item
  const item = element.querySelector('.editorial__item');

  // Prepare columns array
  let columns = [];
  if (item) {
    // Left: image column (contains <picture> with <img> of food/chef)
    const imgCol = item.querySelector('.editorial__item__image');
    // Right: description column (contains <picture> icon, heading and some text)
    const descCol = item.querySelector('.editorial__item__description');

    // Only push existing columns to avoid undefined
    if (imgCol) columns.push(imgCol);
    if (descCol) columns.push(descCol);
  }

  // Only create the table if there are at least 2 columns as in the example
  if (columns.length === 2) {
    const cells = [headerRow, columns];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
