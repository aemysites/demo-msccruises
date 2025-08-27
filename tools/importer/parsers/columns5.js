/* global WebImporter */
export default function parse(element, { document }) {
  // Get the controls row (contains the three main input-boxes)
  const controls = element.querySelector('.search__controls');
  let inputBoxes = [];
  if (controls) {
    inputBoxes = Array.from(controls.querySelectorAll('.input-box'));
  }

  // The three input boxes: Destination, Departure Date, Departure Ports
  const destination = inputBoxes[0] || document.createElement('div');
  const date = inputBoxes[1] || document.createElement('div');
  const departures = inputBoxes[2] || document.createElement('div');

  // More Filters button
  const moreFiltersBtn = element.querySelector('.advanced-filters-button') || document.createElement('div');
  // Search button
  const searchBtn = element.querySelector('.search__button') || document.createElement('div');

  // Header row: single cell only
  const headerRow = ['Columns block (columns5)'];
  // Second row: five columns
  const columnsRow = [destination, date, departures, moreFiltersBtn, searchBtn];

  const cells = [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
