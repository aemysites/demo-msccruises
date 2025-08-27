/* global WebImporter */
export default function parse(element, { document }) {
  // Compose rows for the block table
  const rows = [
    ['Accordion (accordion21)'],
  ];

  // Get all direct children accordion components
  const accordionItems = Array.from(element.querySelectorAll(':scope > .accordion--component'));

  accordionItems.forEach(item => {
    // Title extraction: get h3 text from the header if present; fallback to header textContent
    let title = '';
    const header = item.querySelector('.accordion--component--header');
    if (header) {
      const h3 = header.querySelector('h3');
      if (h3) {
        title = h3.textContent.trim();
      } else {
        title = header.textContent.trim();
      }
    }
    
    // Content extraction: get the first .accordion--component--sub--description inside sub, or sub itself
    let contentElem = null;
    const sub = item.querySelector('.accordion--component--sub');
    if (sub) {
      contentElem = sub.querySelector('.accordion--component--sub--description') || sub;
    }
    // Edge case: if no content, use an empty div to keep cell content
    if (!contentElem) {
      contentElem = document.createElement('div');
    }
    
    rows.push([title, contentElem]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
