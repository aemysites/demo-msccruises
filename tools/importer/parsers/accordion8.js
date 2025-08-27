/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion group
  const group = element.querySelector('.accordion-group');
  if (!group) return;
  const items = group.querySelectorAll(':scope > .accordion--component');

  // Gather accordion item rows
  const rows = [];
  items.forEach((item) => {
    let titleElem = item.querySelector('.accordion--component--header h3');
    if (!titleElem) titleElem = item.querySelector('.accordion--component--header');
    let contentElem = item.querySelector('.accordion--component--sub--description');
    if (!contentElem) contentElem = item.querySelector('.accordion--component--sub');
    if (!contentElem) contentElem = document.createElement('div');
    rows.push([titleElem, contentElem]);
  });

  // Create table cells: header row as a single cell in a single-item array
  // This ensures WebImporter.DOMUtils.createTable puts only <th>Accordion (accordion8)</th> in the header row
  const headerRow = ['Accordion (accordion8)'];
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row so the <th> spans both columns
  const firstRow = block.querySelector('tr');
  if (firstRow) {
    const th = firstRow.querySelector('th');
    if (th) th.setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
