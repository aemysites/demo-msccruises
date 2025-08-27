/* global WebImporter */
export default function parse(element, { document }) {
  // Get all accordion items (children of the group)
  const accordionItems = element.querySelectorAll(':scope > .accordion--component');
  const rows = [['Accordion (accordion58)']]; // Exact block name for table header

  accordionItems.forEach((item) => {
    // Title cell: header h3 inside .accordion--component--header
    let titleCell = '';
    const header = item.querySelector('.accordion--component--header h3');
    if (header) {
      titleCell = header;
    } else {
      // fallback if h3 missing
      const fallbackHeader = item.querySelector('.accordion--component--header');
      if (fallbackHeader) {
        titleCell = fallbackHeader.textContent.trim();
      }
    }

    // Content cell: body inside .accordion--component--sub--description
    let contentCell = '';
    const content = item.querySelector('.accordion--component--sub--description');
    if (content) {
      contentCell = content;
    } else {
      // fallback if description is missing, use sub container
      const fallbackContent = item.querySelector('.accordion--component--sub');
      if (fallbackContent) {
        contentCell = fallbackContent;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
