/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row: exactly one column
  const headerRow = ['Columns (columns22)'];

  // Find the main editorial block and its item
  const editorial = element.querySelector('.editorial-image-text');
  if (!editorial) return;
  const item = editorial.querySelector('.editorial__item');
  if (!item) return;

  // LEFT COLUMN: image
  let leftCell = null;
  const imageContainer = item.querySelector('.editorial__item__image');
  if (imageContainer) {
    const picture = imageContainer.querySelector('picture');
    if (picture) {
      leftCell = picture;
    } else {
      const img = imageContainer.querySelector('img');
      if (img) leftCell = img;
    }
  }

  // RIGHT COLUMN: icon + headline + description
  const descContainer = item.querySelector('.editorial__item__description');
  let rightCell = [];
  if (descContainer) {
    const iconPic = descContainer.querySelector('picture');
    if (iconPic) rightCell.push(iconPic);
    const headline = descContainer.querySelector('h3');
    if (headline) rightCell.push(headline);
    const readmore = descContainer.querySelector('.editorial-text--readmore');
    if (readmore) {
      const moreContent = readmore.querySelector('.more-content');
      if (moreContent && (!moreContent.textContent || moreContent.textContent.trim() === 'undefined')) {
        moreContent.remove();
      }
      rightCell.push(readmore);
    }
  }
  if (!leftCell) leftCell = '';
  if (!rightCell || rightCell.length === 0) rightCell = '';

  // CRITICAL FIX: The cells array must be [[headerRow], [leftCell, rightCell]]
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
