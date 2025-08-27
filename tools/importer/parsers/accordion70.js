/* global WebImporter */
export default function parse(element, { document }) {
  // The header row is always the block/component name, exactly as required
  const headerRow = ['Accordion (accordion70)'];

  // Find all accordion items (direct children with class 'accordion--component')
  const items = Array.from(element.querySelectorAll(':scope > .accordion--component'));

  // Table rows start with the block header
  const rows = [headerRow];

  items.forEach(item => {
    // Title cell: <h3> inside .accordion--component--header
    let titleElem = item.querySelector('.accordion--component--header h3');
    // If not found, fallback to just the header element itself
    if (!titleElem) {
      // Try to find any heading (h1-h6)
      titleElem = item.querySelector('.accordion--component--header [class*="h"]') || item.querySelector('.accordion--component--header');
    }
    // If still missing, use an empty string
    const titleCell = titleElem || '';

    // Content cell: the whole .accordion--component--sub--description block
    let contentElem = item.querySelector('.accordion--component--sub--description');
    // If not found, fallback to .accordion--component--sub
    if (!contentElem) {
      contentElem = item.querySelector('.accordion--component--sub');
    }
    // If still missing, use an empty string
    const contentCell = contentElem || '';

    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
