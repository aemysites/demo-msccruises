/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the accordion columns
  const nav = element.querySelector('.footer__accordion');
  let columns = [];
  if (nav) {
    const sections = Array.from(nav.children).filter(child => child.tagName === 'DIV');
    columns = sections.map(section => {
      // Compose: Heading + list
      const frag = document.createElement('div');
      const heading = section.querySelector('button');
      if (heading) {
        const headingEl = document.createElement('div');
        headingEl.textContent = heading.textContent.trim();
        headingEl.style.fontWeight = 'bold';
        frag.appendChild(headingEl);
      }
      const list = section.querySelector('ul');
      if (list) {
        frag.appendChild(list);
      }
      return frag;
    });
  }
  // If less than 3 columns, pad with empty strings
  while (columns.length < 3) columns.push('');

  // 2. Get the Explora Journeys logo
  let exploraLogo = '';
  const legalNote = element.querySelector('.footer__legal-note');
  if (legalNote) {
    // Use the <div> inside, which contains both <p> tags with <a><img></a>
    const container = legalNote.querySelector('div');
    if (container) {
      exploraLogo = container;
    }
  }

  // 3. Get the social block
  let socialBlock = '';
  const socialNav = element.querySelector('.footer__social');
  if (socialNav) {
    socialBlock = socialNav;
  }

  // 4. Get the copyright
  let copyrightBlock = '';
  const copyright = element.querySelector('.footer__copyrights');
  if (copyright) {
    copyrightBlock = copyright;
  }

  // 5. Build the table
  const headerRow = ['Columns block (columns30)'];
  const columnsRow = [columns[0], columns[1], columns[2]];
  const infoRow = [exploraLogo, socialBlock, copyrightBlock];
  const cells = [
    headerRow,
    columnsRow,
    infoRow
  ];
  // 6. Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // 7. Replace element
  element.replaceWith(blockTable);
}
