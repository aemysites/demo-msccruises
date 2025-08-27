/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];

  // All card tiles (direct children)
  const tiles = element.querySelectorAll(':scope > .tile');

  tiles.forEach(tile => {
    // ----- Image cell extraction -----
    let imgEl = null;
    const picture = tile.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // ----- Text cell extraction -----
    const textCellContent = [];
    // Card text is in header > div > .tile__overtitle and .tile__title
    const header = tile.querySelector('header');
    if (header) {
      const innerDiv = header.querySelector('div');
      if (innerDiv) {
        // Overtitle (used as card title)
        const overtitle = innerDiv.querySelector('.tile__overtitle');
        if (overtitle) {
          // The overtitle often wraps a <p>, sometimes just text
          let overtitleNode = overtitle.querySelector('p') || overtitle;
          // Use <strong> for semantic heading
          const strong = document.createElement('strong');
          strong.textContent = overtitleNode.textContent.trim();
          textCellContent.push(strong);
        }
        // Description below title (can be <div> or <p> in .tile__title)
        const desc = innerDiv.querySelector('.tile__title');
        if (desc) {
          // Prefer <p> if present
          let descNode = desc.querySelector('p') || desc;
          // Reference the existing element
          textCellContent.push(descNode);
        }
      }
    }
    // If header missing, fallback to other divs for text (edge-case handling)
    if (textCellContent.length === 0) {
      // Find all child divs not the countdown or picture
      const tileDivs = Array.from(tile.children).filter(d => d.tagName === 'DIV' && d !== tile.querySelector('.tile__tile-countdown') && d !== picture);
      tileDivs.forEach(d => {
        textCellContent.push(d);
      });
    }

    // Add the card row as per required structure: [image, text content array]
    cells.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
