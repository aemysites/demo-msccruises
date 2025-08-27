/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to select direct child by selector
  function findChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // Find the main container for the columns content
  const container = element.querySelector('.footer__container');

  // Prepare columns for table row
  // Get nav columns: three <div>s under nav.footer__accordion
  let navAccordion = element.querySelector('nav.footer__accordion');
  let navCols = navAccordion ? Array.from(navAccordion.children) : [];
  while (navCols.length < 3) {
    navCols.push(document.createElement('div'));
  }

  // Newsletter column is .footer__form (if present)
  let newsletterCol = container ? findChild(container, '.footer__form') : document.createElement('div');
  const bodyRow = [navCols[0], navCols[1], navCols[2], newsletterCol];

  // Create table manually to ensure header has single th with proper colspan
  const table = document.createElement('table');
  // Header row
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns block (columns13)';
  headerTh.setAttribute('colspan', bodyRow.length);
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row
  const contentTr = document.createElement('tr');
  bodyRow.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
