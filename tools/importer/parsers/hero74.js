/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block name (exact match)
  const headerRow = ['Hero (hero74)'];

  // 2. Background image row
  // Locate the <picture> element, which may or may not contain an <img>
  let imageContent = null;
  const picture = element.querySelector(':scope > picture, :scope > .editorial-image-text--middle__photo');
  if (picture) {
    // prefer an <img> inside <picture>, otherwise use <picture> or the photo container itself
    const img = picture.querySelector('img');
    imageContent = img || picture;
  }
  // If no image/picture, imageContent remains null (empty cell)
  const imageRow = [imageContent];

  // 3. Text content row
  // Find the content block that holds text (headings, paragraphs, etc.)
  let textContent = null;
  const paragraphContainer = element.querySelector(':scope > .editorial-image-text--middle__paragraph');
  if (paragraphContainer && paragraphContainer.childNodes.length > 0) {
    textContent = paragraphContainer;
  }
  // If no text content, textContent remains null (empty cell)
  const textRow = [textContent];

  // 4. Build the cells (1 column, 3 rows)
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // 5. Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the element with the table block
  element.replaceWith(block);
}
