/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Build header row exactly as in example
  const headerRow = ['Search'];

  // 2. Find the search UI block and ensure all original text content is included
  // The block is always one column, so we should combine everything into one cell
  // We'll reference the menu item with search, but fallback to all forms that look like search
  let searchBlock = null;
  // Look for header__search menu item
  const searchMenuItem = element.querySelector('.header__search');
  if (searchMenuItem) {
    searchBlock = searchMenuItem;
  } else {
    // Fallback: look for any form with input[name="query"]
    const forms = Array.from(element.querySelectorAll('form'));
    searchBlock = forms.find(form => form.querySelector('input[name="query"]')) || element;
  }

  // 3. Build a cell containing all text content and relevant UI elements from the search block
  // Reference the original searchBlock, not clone it (so DOM remains live)
  // For robustness, wrap searchBlock in a div so that the cell is always a single element
  const cellDiv = document.createElement('div');
  // Copy over all children of searchBlock (not the node itself, so we don't break the DOM)
  Array.from(searchBlock.childNodes).forEach(child => cellDiv.appendChild(child));

  // 4. Add the query index URL as a link (required by the block)
  // Try to find a query-index.json URL in the forms, otherwise use the default
  let searchIndexUrl = null;
  const allInputs = element.querySelectorAll('form input[name="query"]');
  for (const input of allInputs) {
    const form = input.closest('form');
    if (form && form.action && form.action.endsWith('.json')) {
      searchIndexUrl = form.action;
      break;
    }
  }
  if (!searchIndexUrl) {
    searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';
  }
  // Add as a link element
  const link = document.createElement('a');
  link.href = searchIndexUrl;
  link.textContent = searchIndexUrl;
  cellDiv.appendChild(document.createElement('br'));
  cellDiv.appendChild(link);

  // 5. Compose cells array (one column, two rows as in example)
  const cells = [
    headerRow,
    [cellDiv],
  ];
  // 6. Create the block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
