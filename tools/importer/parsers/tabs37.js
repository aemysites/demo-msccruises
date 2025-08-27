/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab labels and tab content from the HTML
  const tabContainer = element.querySelector('.tab-container');
  const cardWrapper = element.querySelector('.card-wrapper');

  if (!tabContainer || !cardWrapper) return;

  // Get all tab elements in order
  const tabs = Array.from(tabContainer.children).filter(child => child.classList.contains('tab'));
  // Get all card elements in order
  const cards = Array.from(cardWrapper.children).filter(child => child.classList.contains('card'));

  // Defensive: only as many rows as there are both labels & cards
  const numTabs = Math.min(tabs.length, cards.length);

  // Table header: block name only, exactly as in example
  const rows = [['Tabs']];

  // For each tab, build a row: first cell is the label, second is the content
  for (let i = 0; i < numTabs; i++) {
    // Tab label: get .tab-title inside .tab
    let label;
    const labelDiv = tabs[i].querySelector('.tab-title');
    if (labelDiv) {
      label = labelDiv;
    } else {
      // Fallback to tab's textContent
      label = document.createTextNode(tabs[i].textContent.trim());
    }

    // Tab content: reference the entire .row in the correct card
    const cardRow = cards[i].querySelector('.row');
    let content;
    if (cardRow) {
      content = cardRow;
    } else {
      content = document.createTextNode(cards[i].textContent.trim());
    }

    rows.push([label, content]);
  }

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
