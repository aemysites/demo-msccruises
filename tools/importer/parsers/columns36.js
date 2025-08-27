/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the input columns from .search__controls
  const controls = element.querySelector('.search__controls');
  let columnCells = [];
  if (controls) {
    columnCells = Array.from(controls.querySelectorAll(':scope > .input-box'));
  }
  // 2. Extract the search button (fourth column)
  const searchBtnWrapper = element.querySelector('.search__button');
  if (searchBtnWrapper) {
    columnCells.push(searchBtnWrapper);
  }
  // 3. Ensure we have exactly 4 columns (if structure changes, fallback to empty divs)
  while (columnCells.length < 4) {
    columnCells.push(document.createElement('div'));
  }
  // 4. Build cells array so header row is a single cell (as per example) and content row has 4 columns
  const cells = [
    ['Columns block (columns36)'],
    columnCells
  ];
  // 5. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
