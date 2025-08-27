/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion43)'];

  // Find the accordion group
  const accordionGroup = element.querySelector('.accordion-group');
  if (!accordionGroup) return;

  // Find all top-level accordion items
  const items = Array.from(accordionGroup.querySelectorAll(':scope > .accordion--component'));

  const rows = [headerRow];

  items.forEach((item) => {
    // Title cell: The accordion header (try to use only the title element, not the whole header for maximum resilience)
    let titleCell = '';
    const header = item.querySelector('.accordion--component--header');
    if (header) {
      // Usually it's an h3, but fallback to header
      const h3 = header.querySelector('h3');
      titleCell = h3 ? h3 : header;
    }

    // Content cell: The full accordion body/description
    let contentCell = '';
    const sub = item.querySelector('.accordion--component--sub');
    if (sub) {
      const desc = sub.querySelector('.accordion--component--sub--description');
      contentCell = desc ? desc : sub;
    }

    // Only add row if either cell has meaningful content
    if ((titleCell && (titleCell.textContent || titleCell.innerText).trim()) || (contentCell && contentCell.textContent && contentCell.textContent.trim())) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Only replace if there is more than just the header
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
