/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Cards (cards52)'];
  const rows = [];

  // 2. Select all .tile blocks within the container
  const tiles = element.querySelectorAll(':scope > .tile');

  tiles.forEach(tile => {
    // a) Image: Use the <img> inside <picture> (reference, not clone)
    let img = null;
    const picture = tile.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img') || picture;
    }

    // b) Text content: Build with referenced elements and retain all text
    const textContent = [];
    
    // - Overtitle (top text, acts as heading, usually .tile__overtitle)
    const overtitle = tile.querySelector('.tile__overtitle');
    if (overtitle) {
      if (overtitle.tagName.toLowerCase() === 'div') {
        // Could be <div> or <div><p></p></div>
        const overt = overtitle.querySelector('p') || overtitle;
        // Use <strong> for heading semantic as in example
        const strong = document.createElement('strong');
        strong.textContent = overt.textContent.trim();
        textContent.push(strong);
      }
    }

    // - Title/Description: .tile__title (usually contains <p><span>)
    const title = tile.querySelector('.tile__title');
    if (title) {
      // Could be <div><p><span>text</span></p></div>
      let desc = '';
      const span = title.querySelector('span');
      if (span) {
        desc = span.textContent.trim();
      } else {
        desc = title.textContent.trim();
      }
      // Place after heading, separated by <br> to mimic block example
      textContent.push(document.createElement('br'));
      const descDiv = document.createElement('div');
      descDiv.textContent = desc;
      textContent.push(descDiv);
    }

    // Compose row [img, textContent]
    rows.push([
      img,
      textContent
    ]);
  });

  // Final table: header row + card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
