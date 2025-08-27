/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards66)'];
  // Find all editorial-image-text blocks (cards)
  const cardBlocks = Array.from(element.querySelectorAll('.editorial-image-text'));
  const rows = cardBlocks.map(card => {
    // Get image: picture > img
    let imageEl = null;
    const pic = card.querySelector('.editorial__item__image picture');
    if (pic) {
      imageEl = pic.querySelector('img');
    }

    // Get card title and description
    const desc = card.querySelector('.editorial__item__description');

    // Title is h2
    const titleEl = desc ? desc.querySelector('h2') : null;
    // Description is the first div after h2 (not .more-content)
    let descDiv = null;
    if (desc) {
      descDiv = Array.from(desc.children).find(
        (el) => el.tagName === 'DIV'
      );
    }

    // Compose text cell: title (as heading) + description below
    let textCell;
    if (titleEl && descDiv) {
      // Use a fragment: keep original heading level, and description (which may have markup)
      const fragment = document.createDocumentFragment();
      fragment.appendChild(titleEl);
      // Only add a <br> if the description doesn't already start with a block element
      if (descDiv.childNodes.length && descDiv.firstChild.nodeType === 3 && descDiv.firstChild.textContent.trim() !== '') {
        fragment.appendChild(document.createElement('br'));
      }
      fragment.appendChild(descDiv);
      textCell = fragment;
    } else if (titleEl) {
      textCell = titleEl;
    } else if (descDiv) {
      textCell = descDiv;
    } else {
      textCell = '';
    }
    return [imageEl, textCell];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
