/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as per the example
  const headerRow = ['Accordion (accordion45)'];
  const cells = [headerRow];

  // All accordion items in the block
  const accordionItems = element.querySelectorAll(':scope > .accordion--component');

  accordionItems.forEach((item) => {
    // Title cell, always required
    let titleCell;
    const header = item.querySelector(':scope > .accordion--component--header');
    if (header) {
      // Prefer h3 if present, else use the textContent of the header
      const h3 = header.querySelector('h3');
      if (h3) {
        titleCell = h3;
      } else {
        // fallback to header's text
        const span = document.createElement('span');
        span.textContent = header.textContent.trim();
        titleCell = span;
      }
    } else {
      // fallback: if structure is broken, show a blank cell
      titleCell = document.createElement('span');
      titleCell.textContent = '';
    }

    // Content cell, always required
    let contentCell;
    const sub = item.querySelector(':scope > .accordion--component--sub');
    if (sub) {
      const desc = sub.querySelector(':scope > .accordion--component--sub--description');
      if (desc) {
        // If description contains child nodes, gather them all
        if (desc.childNodes.length > 0) {
          const frag = document.createDocumentFragment();
          Array.from(desc.childNodes).forEach((node) => {
            frag.append(node);
          });
          contentCell = frag;
        } else {
          contentCell = desc;
        }
      } else {
        // fallback to sub block itself
        contentCell = sub;
      }
    } else {
      // fallback: blank cell if missing
      contentCell = document.createElement('span');
      contentCell.textContent = '';
    }

    cells.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
