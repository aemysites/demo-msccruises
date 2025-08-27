/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column blocks: left and right
  const leftBlock = element.querySelector('.editorial-image-text--left');
  const rightBlock = element.querySelector('.editorial-image-text--right');

  // Helper to extract the text content (main container div in description)
  function getDescriptionBlock(editorialBlock) {
    if (!editorialBlock) return null;
    const descWrap = editorialBlock.querySelector('.editorial__item__description');
    if (!descWrap) return null;
    // Find the inner <div> with the actual content (ignore .more-content span)
    const textDiv = Array.from(descWrap.children).find(child => child.tagName === 'DIV');
    // Only return if it has significant content
    if (textDiv && textDiv.textContent.trim().replace(/\u00a0/g, '').length > 0) {
      return textDiv;
    }
    return null;
  }

  // Helper to extract the image (the <picture> element)
  function getPicture(editorialBlock) {
    if (!editorialBlock) return null;
    const imgWrap = editorialBlock.querySelector('.editorial__item__image');
    if (!imgWrap) return null;
    const picture = imgWrap.querySelector('picture');
    return picture || null;
  }

  // Gather left and right column content as arrays
  function getColumnContent(editorialBlock) {
    const textBlock = getDescriptionBlock(editorialBlock);
    const pictureBlock = getPicture(editorialBlock);
    const arr = [];
    if (textBlock) arr.push(textBlock);
    if (pictureBlock) arr.push(pictureBlock);
    return arr.length === 1 ? arr[0] : (arr.length ? arr : '');
  }

  const leftCol = getColumnContent(leftBlock);
  const rightCol = getColumnContent(rightBlock);

  // Build the table
  const headerRow = ['Columns block (columns51)'];
  const tableRows = [headerRow, [leftCol, rightCol]];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  
  element.replaceWith(table);
}
