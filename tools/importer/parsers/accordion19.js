/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows
  const cells = [
    ['Accordion (accordion19)'],
  ];

  // Find the accordion-group containing the accordions
  const accordionGroup = element.querySelector('.accordion-group');
  if (accordionGroup) {
    const accordionItems = accordionGroup.querySelectorAll(':scope > .accordion--component');
    accordionItems.forEach((item) => {
      // Title cell: Get the .accordion--component--header and find the first heading (h3/h2/h4)
      let titleCell = '';
      const header = item.querySelector('.accordion--component--header');
      if (header) {
        const heading = header.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          titleCell = heading;
        } else {
          // fallback: use header text
          titleCell = header.textContent.trim();
        }
      }
      // Content cell: get the body/content of this accordion item
      let contentCell = '';
      const sub = item.querySelector('.accordion--component--sub');
      if (sub) {
        // Prefer the description div, else use the sub block
        const subDescription = sub.querySelector('.accordion--component--sub--description');
        if (subDescription) {
          contentCell = subDescription;
        } else {
          // fallback: use all sub's children
          // If sub has children, use an array of children, else use sub itself
          if (sub.children.length > 0) {
            contentCell = Array.from(sub.children);
          } else {
            contentCell = sub;
          }
        }
      }
      // Push the row (always two columns)
      cells.push([titleCell, contentCell]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
