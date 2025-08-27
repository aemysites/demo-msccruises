/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main bar containing all fields and buttons
  const searchBar = element.querySelector('.search__bar');
  if (!searchBar) return;

  // Find the controls area
  const controls = searchBar.querySelector('.search__controls');

  // Extract the three main input fields (destination, date, ports)
  let fields = [];
  if (controls) {
    fields = Array.from(controls.querySelectorAll(':scope > .input-box'));
  }

  // More Filters button is a div
  const moreFilters = searchBar.querySelector('.advanced-search-app__more-filters');
  // Apply button is inside .search__button
  let applyButton = '';
  const applyWrapper = searchBar.querySelector('.search__button');
  if (applyWrapper) {
    // Reference the button element itself (not a clone)
    const btn = applyWrapper.querySelector('button');
    if (btn) applyButton = btn;
  }

  // Create the header row, matching the example EXACTLY
  const headerRow = ['Columns block (columns50)', '', '', '', ''];

  // The main columns row, referencing the original elements
  // Empty columns are left as '' for resilience to structural changes
  const columnsRow = [
    fields[0] || '', // Destination
    fields[1] || '', // Departure date
    fields[2] || '', // Departure ports
    moreFilters || '', // More Filters button
    applyButton || '' // Apply button
  ];

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
