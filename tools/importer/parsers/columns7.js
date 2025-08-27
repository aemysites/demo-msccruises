/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row
  const headerRow = ['Columns block (columns7)'];

  // Gather all immediate editorial-image-text blocks (columns)
  const columns = Array.from(element.querySelectorAll('.editorial-image-text'));

  // Helper to extract all relevant text content for a column
  function getContentCell(col) {
    // Get the item description (main text)
    const desc = col.querySelector('.editorial__item__description');
    const contentParts = [];
    if (desc) {
      // Remove Read more button and make hidden content visible if present
      const readMoreBtn = desc.querySelector('.button--readmore');
      if (readMoreBtn) readMoreBtn.remove();
      // Show hidden more-content span if present
      const moreContent = desc.querySelector('.more-content');
      if (moreContent && moreContent.style.display === 'none') {
        moreContent.style.display = '';
      }
      // Remove duplicated h2 inside description
      desc.querySelectorAll('h2').forEach(h2 => h2.remove());
      // Remove empty or 'undefined' spans
      desc.querySelectorAll('span').forEach(s => { if (!s.textContent.trim() || s.textContent.trim() === 'undefined') s.remove(); });
      // Reference all child nodes of description (keeps formatting/semantic tags)
      contentParts.push(...Array.from(desc.childNodes));
    }
    // Get image column
    const imageWrap = col.querySelector('.editorial__item__image');
    if (imageWrap) {
      const pic = imageWrap.querySelector('picture');
      if (pic) contentParts.push(pic);
    }
    // Wrap if more than one part
    if (contentParts.length === 1) return contentParts[0];
    if (contentParts.length > 1) {
      const div = document.createElement('div');
      contentParts.forEach(part => div.appendChild(part));
      return div;
    }
    // Fallback: empty cell
    return document.createElement('div');
  }

  // Compose second row: one cell per column (preserves structure)
  const secondRow = columns.map(col => getContentCell(col));

  // Compose table data: first row header, second row columns
  const cells = [headerRow, secondRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
