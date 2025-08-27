/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as per the requirements
  const headerRow = ['Accordion (accordion28)'];
  const rows = [];

  // Each accordion--component is an item
  const items = element.querySelectorAll(':scope > .accordion--component');
  items.forEach((item) => {
    // Title cell: Get the accordion header (usually contains h3)
    const headerDiv = item.querySelector('.accordion--component--header');
    let titleEl = null;
    if (headerDiv) {
      const h3 = headerDiv.querySelector('h3');
      if (h3) {
        titleEl = h3;
      } else {
        // Fallback: use the headerDiv as title if h3 missing
        titleEl = headerDiv;
      }
    } else {
      // Edge case: no headerDiv, create empty cell
      titleEl = document.createTextNode('');
    }

    // Content cell: .accordion--component--sub--description, may have multiple children
    const subDesc = item.querySelector('.accordion--component--sub--description');
    let contentEls = null;
    if (subDesc) {
      // Collect only element children with content
      const children = Array.from(subDesc.childNodes).filter(node =>
        (node.nodeType === 1 && node.textContent.trim().length > 0) ||
        (node.nodeType === 3 && node.textContent.trim().length > 0)
      );
      if (children.length === 1) {
        contentEls = children[0];
      } else if (children.length > 1) {
        contentEls = children;
      } else {
        // fallback: whole subDesc
        contentEls = subDesc;
      }
    } else {
      // Edge case: no content, empty cell
      contentEls = document.createTextNode('');
    }

    rows.push([titleEl, contentEls]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
