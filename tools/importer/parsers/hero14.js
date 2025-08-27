/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero14)
  const headerRow = ['Hero (hero14)'];

  // Find the picture (background image)
  let img = null;
  const pictureDiv = Array.from(element.children).find(child => child.classList && child.classList.contains('picture-to-background'));
  if (pictureDiv) {
    const picture = pictureDiv.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }
  }
  const imageRow = [img ? img : ''];

  // Find the span that contains textual content and CTA
  const contentSpan = Array.from(element.children).find(child => child.tagName === 'SPAN');

  // Collect all non-empty child nodes from the contentSpan for semantic preservation
  let contentNodes = [];
  if (contentSpan) {
    for (let node of contentSpan.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Ignore empty <br> elements
        if (node.tagName === 'BR') continue;
        // For <p>, <div>, <strong>, <span> with only <br> inside, skip
        if ((node.tagName === 'P' || node.tagName === 'DIV' || node.tagName === 'STRONG' || node.tagName === 'SPAN') && node.textContent.trim() === '' && node.querySelectorAll('br').length > 0) {
          continue;
        }
        contentNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Collect non-whitespace text
        if (node.textContent.trim() !== '') {
          const textSpan = document.createElement('span');
          textSpan.textContent = node.textContent;
          contentNodes.push(textSpan);
        }
      }
    }
  }

  // Compose the content row
  const contentRow = [contentNodes.length ? contentNodes : ['']];

  // Compose the table
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
