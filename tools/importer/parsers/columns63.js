/* global WebImporter */
export default function parse(element, { document }) {
  // Build main columns: Get search bar fields
  const bar = element.querySelector('.search__bar');
  const fields = bar ? bar.querySelector('.search__fields') : null;

  // Prepare each column: Destination, Dates, Ports, More Filters, Search
  let mainRow = [];
  if (fields) {
    const controls = fields.querySelector('.search__controls');
    if (controls) {
      // All column controls (DESTINATION, DATES, PORTS)
      const inputBoxes = Array.from(controls.querySelectorAll('.input-box'));
      inputBoxes.forEach((inputBox) => {
        mainRow.push(inputBox);
      });
    }
    // More filters
    const moreFilters = fields.querySelector('.advanced-search-app__more-filters');
    if (moreFilters) {
      mainRow.push(moreFilters);
    }
    // Search button
    const searchBtnDiv = fields.querySelector('.search__button');
    if (searchBtnDiv) {
      mainRow.push(searchBtnDiv);
    }
  }
  if (mainRow.length === 0) mainRow = [''];

  // Results and Sort row
  const summary = element.querySelector('.search__summary');
  let summaryRow = [];
  if (summary) {
    // Results found (e.g. "Results found: 358")
    const found = summary.querySelector('.search-sort__results');
    if (found) {
      summaryRow.push(found);
    }
    // Sort by: (sort dropdown)
    const sortContainer = summary.querySelector('.search-sort__container');
    if (sortContainer) {
      summaryRow.push(sortContainer);
    }
  }
  // Pad summaryRow to match columns count (for table balance)
  while (summaryRow.length < mainRow.length) {
    summaryRow.push('');
  }
  // If summary row is all empty, don't add it
  const allSummaryEmpty = summaryRow.every(cell => {
    if (typeof cell === 'string') return cell.trim() === '';
    return false;
  });

  // The header row MUST be a single cell (not one per column)
  const header = ['Columns (columns63)'];
  // Build cells: header (1 col), then rows with N cols
  const cells = [
    header,
    mainRow
  ];
  if (!allSummaryEmpty && summaryRow.length > 0) {
    cells.push(summaryRow);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
