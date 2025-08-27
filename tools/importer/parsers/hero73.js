/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the background image (use <img> inside <picture> as in example)
  let backgroundImg = null;
  const bgDiv = element.querySelector('.picture-to-background');
  if (bgDiv) {
    const picture = bgDiv.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) backgroundImg = img;
    }
  }

  // 2. Extract title (h2)
  const title = element.querySelector('.section-title');

  // 3. Extract content: paragraph and button(s)
  // The paragraph and button are inside the <span>
  const contentSpan = element.querySelector('span');
  let contentNodes = [];
  if (contentSpan) {
    // Get all direct children that are elements (p and div.button-container)
    Array.from(contentSpan.children).forEach(child => {
      // Only include if child has content (avoid empty)
      if (child.tagName === 'P' && child.textContent.trim()) {
        contentNodes.push(child);
      }
      if (child.classList.contains('button-container')) {
        // Take the button directly
        const button = child.querySelector('a.button');
        if (button) {
          contentNodes.push(button);
        }
      }
    });
  }

  // Build the array for the block
  const headerRow = ['Hero (hero73)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  // Content: title, then paragraph, then CTA
  let contentRow = [];
  if (title) contentRow.push(title);
  if (contentNodes.length > 0) contentRow = contentRow.concat(contentNodes);
  // Always put all content in a single cell (single column)
  const rows = [
    headerRow,
    imageRow,
    [contentRow],
  ];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
