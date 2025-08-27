/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) header row, per example
  const headerRow = ['Cards (cards15)'];

  // Identify the card container
  const tileCarousel = element.querySelector('.tile-container--carousel');
  if (!tileCarousel) return;

  // Each card = .tile
  const tiles = tileCarousel.querySelectorAll(':scope > .tile');

  const cardRows = Array.from(tiles).map(tile => {
    // Image for card (first cell)
    const picture = tile.querySelector('picture');
    // Title: .tile__title (visual title under image)
    const titleEl = tile.querySelector('.tile__title');
    // Description: paragraphs from .tile--with-detail__detailed .tile-detail__text
    const detailedPanel = tile.querySelector('.tile--with-detail__detailed');
    let descEls = [];
    if (detailedPanel) {
      const textBlock = detailedPanel.querySelector('.tile-detail__text');
      if (textBlock) {
        descEls = Array.from(textBlock.querySelectorAll('p')).filter(p => {
          // Remove paragraphs that are only whitespace, &nbsp; or <br>
          return !/^\s*(\u00a0|<br\s*\/?>)*\s*$/i.test(p.innerHTML);
        });
      }
    }
    // Compose the text cell as per example: bold title, then description paragraphs
    const textCell = document.createElement('div');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    descEls.forEach(p => textCell.appendChild(p));
    // Final card row: [ picture, textCell ]
    return [picture, textCell];
  });

  // Assemble all cell rows
  const cells = [headerRow, ...cardRows];

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
