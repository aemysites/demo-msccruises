/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly as required
  const headerRow = ['Cards (cards61)'];
  const rows = [headerRow];

  // Get all card tiles as direct children
  const tiles = element.querySelectorAll(':scope > .tile');

  tiles.forEach(tile => {
    // Image cell: always the <picture> element inside the <a>
    const link = tile.querySelector('a');
    let imageEl = null;
    if (link) {
      imageEl = link.querySelector('picture') || link.querySelector('img');
      // imageEl can be the entire <picture> for responsive images
    }

    // Text cell: title from .tile__overtitle, description from .tile__title if present
    let textCell = document.createElement('div');
    let title = '';
    let description = '';
    if (link) {
      const header = link.querySelector('header');
      if (header) {
        const overtit = header.querySelector('.tile__overtitle');
        if (overtit && overtit.textContent.trim()) {
          title = overtit.textContent.trim();
        }
        const desc = header.querySelector('.tile__title');
        if (desc && desc.textContent.trim()) {
          description = desc.textContent.trim();
        }
      }
    }
    // Add title as <strong> (semantic heading for cards)
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.appendChild(strong);
    }
    // Add description if present, below the title
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      textCell.appendChild(p);
    }
    // No call-to-action link or more text in example, so just image+title+desc

    rows.push([imageEl, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
