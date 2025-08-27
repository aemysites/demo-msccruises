/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the exact header row as in the example
  const rows = [['Carousel (carousel34)']];

  // Only one slide, but structure for scalability
  // First column: image (picture element)
  const picture = element.querySelector('picture');

  // Second column: text content
  // Gather all content from header div as a single cell: this will be resilient to HTML structure variations
  const header = element.querySelector('header');
  let textCol = '';
  if (header) {
    // Instead of picking apart individual elements, just reference the full block (as per guidelines)
    textCol = header;
  }

  // Add the content row, referencing existing elements
  rows.push([picture, textCol]);

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
