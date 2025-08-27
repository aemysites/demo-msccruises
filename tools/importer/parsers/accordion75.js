/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure accordion group exists
  const accordionGroup = element.querySelector('.accordion-group');
  if (!accordionGroup) return;

  // Table header as required in example
  const headerRow = ['Accordion (accordion75)'];
  const rows = [headerRow];

  // Select all direct accordion components
  const accordionItems = accordionGroup.querySelectorAll('.accordion--component');
  accordionItems.forEach((item) => {
    // Title cell: grab h3 inside .accordion--component--header
    const headerDiv = item.querySelector('.accordion--component--header');
    let titleCell = '';
    if (headerDiv) {
      const h3 = headerDiv.querySelector('h3');
      if (h3) titleCell = h3;
    }

    // Content cell: grab the full .accordion--component--sub--description
    let contentCell = '';
    const contentDiv = item.querySelector('.accordion--component--sub--description');
    if (contentDiv) contentCell = contentDiv;

    rows.push([titleCell, contentCell]);
  });

  // Create accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
