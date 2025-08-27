/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content wrapper containing the two columns
  const mainRow = element.querySelector('.editorial-image-text--middle.editorial-image-text--from-left');
  if (!mainRow) return;

  // Get left and right column elements
  const leftCol = mainRow.querySelector('.hero-video-wrapper');
  const rightCol = mainRow.querySelector('.editorial-image-text--middle__paragraph');

  // Prepare left cell: convert video to a link if it has a src
  let leftCell = '';
  if (leftCol) {
    // Look for video or iframe with src
    let src = '';
    const video = leftCol.querySelector('video');
    if (video) {
      src = video.getAttribute('src');
      if (!src) {
        const source = video.querySelector('source');
        if (source) {
          src = source.getAttribute('src');
        }
      }
    }
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.textContent = 'Video';
      leftCell = link;
    } else {
      leftCell = leftCol;
    }
  }
  // Prepare right cell
  let rightCell = '';
  if (rightCol) {
    rightCell = rightCol;
  }
  // Correct structure: header row is a single column, content row has two columns
  const tableRows = [
    ['Columns block (columns29)'],
    [leftCell, rightCell],
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
