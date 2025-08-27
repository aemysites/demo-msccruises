/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion group containing all accordion items
  const accordionGroup = element.querySelector('.accordion-group');
  if (!accordionGroup) return;
  // Select all immediate accordion items
  const accordionItems = accordionGroup.querySelectorAll(':scope > .accordion--component');

  // Start with the required header row
  const rows = [['Accordion (accordion67)']];

  accordionItems.forEach(item => {
    // Find the header (title)
    let title = '';
    const headerDiv = item.querySelector('.accordion--component--header');
    if (headerDiv) {
      // Use the existing h3 element (not its text)
      const h3 = headerDiv.querySelector('h3');
      if (h3) {
        title = h3;
      } else {
        // fallback: grab the headerDiv itself
        title = headerDiv;
      }
    }

    // Find the content (body of the accordion)
    let content = '';
    const subDescription = item.querySelector('.accordion--component--sub--description');
    if (subDescription) {
      content = subDescription;
    } else {
      // fallback: grab the .accordion--component--sub div if present
      const subDiv = item.querySelector('.accordion--component--sub');
      if (subDiv) {
        content = subDiv;
      } else {
        // fallback: try all content in the item except the header
        const allContent = Array.from(item.children).filter(e => !e.classList.contains('accordion--component--header'));
        if (allContent.length > 0) {
          content = allContent;
        }
      }
    }

    rows.push([title, content]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
