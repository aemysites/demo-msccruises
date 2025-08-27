/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards41)'];
  const cells = [headerRow];

  // Get all tile/card elements
  const tiles = Array.from(element.querySelectorAll(':scope > div'));
  tiles.forEach(tile => {
    const anchor = tile.querySelector('a');
    if (!anchor) return;

    // Image: get the <img> inside <picture>
    let imageElem = null;
    const picture = anchor.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) imageElem = img;
    }

    // Text content
    const header = anchor.querySelector('header');
    let textContentArr = [];
    let hadOvertitle = false;
    let hadSubtitle = false;
    if (header) {
      // Strong title (from .tile__overtitle)
      const overtitle = header.querySelector('.tile__overtitle');
      if (overtitle) {
        const strong = document.createElement('strong');
        strong.textContent = overtitle.textContent.trim();
        textContentArr.push(strong);
        hadOvertitle = true;
      }
      // Subtitle/description (from .tile__title), always add even if empty
      const subtitle = header.querySelector('.tile__title');
      if (subtitle) {
        // If there is any HTML or whitespace, preserve it
        const div = document.createElement('div');
        div.innerHTML = subtitle.innerHTML;
        textContentArr.push(div);
        hadSubtitle = true;
      }
      // CTA button (last, always at the bottom)
      const ctaBtn = header.querySelector('.tile-cta-button .button');
      if (ctaBtn) {
        const ctaSpan = ctaBtn.querySelector('span');
        if (ctaSpan && anchor.href) {
          const a = document.createElement('a');
          a.href = anchor.href;
          a.textContent = ctaSpan.textContent.trim();
          textContentArr.push(a);
        }
      }
    }
    // Fallback: if header is missing, use anchor text
    if (textContentArr.length === 0 && anchor.textContent.trim()) {
      textContentArr.push(document.createTextNode(anchor.textContent.trim()));
    }
    // Ensure blank description if missing
    if (hadOvertitle && !hadSubtitle) {
      // If there was an overtitle but no subtitle, add an empty div for subtitle row
      const emptyDiv = document.createElement('div');
      textContentArr.push(emptyDiv);
    }
    cells.push([
      imageElem || '',
      textContentArr.length === 1 ? textContentArr[0] : textContentArr
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
