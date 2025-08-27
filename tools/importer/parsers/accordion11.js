/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row for the accordion block table
  const headerRow = ['Accordion (accordion11)'];

  // Gather all direct children that are accordion components
  const items = Array.from(element.querySelectorAll(':scope > .accordion--component'));
  
  // Build one row per accordion item, each with 2 cells: title, content
  const rows = items.map((item) => {
    // Title cell: h3 inside .accordion--component--header
    let titleEl = item.querySelector('.accordion--component--header h3');
    if (!titleEl) {
      // Fallback to entire header div if h3 missing
      const headerDiv = item.querySelector('.accordion--component--header');
      if (headerDiv) {
        titleEl = headerDiv;
      } else {
        // Fallback to empty if structure is broken
        titleEl = document.createElement('div');
      }
    }
    // Content cell: .accordion--component--sub--description (may include p, br, links, strong, etc)
    let contentEl = item.querySelector('.accordion--component--sub--description');
    if (!contentEl) {
      // Fallback to .accordion--component--sub if missing
      const sub = item.querySelector('.accordion--component--sub');
      if (sub) {
        contentEl = sub;
      } else {
        // Fallback to empty
        contentEl = document.createElement('div');
      }
    }
    return [titleEl, contentEl];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
