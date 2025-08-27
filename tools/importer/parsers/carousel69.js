/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Carousel (carousel69)'];

  // Find the slider block
  const slider = element.querySelector('.editorial-slider');
  if (!slider) return;

  // Find the image and description columns
  const imageColumn = slider.querySelector('.editorial-slider__column--image');
  const descColumn = slider.querySelector('.editorial-slider__column--description');

  // Get all image slides
  const slides = imageColumn.querySelectorAll('.swiper-slide');
  // Prepare a reference to the description content (entire block)
  let descContent = null;
  if (descColumn) {
    // Use the most inner container with the real content
    const content = descColumn.querySelector('.editorial-image-content');
    if (content) {
      descContent = content.parentElement.parentElement; // editorial-image-block
    } else {
      descContent = descColumn;
    }
  }

  const rows = [headerRow];
  // Each slide: first cell is image (img element), second cell is description (only for first slide)
  slides.forEach((slide, i) => {
    // The image is inside .editorial-slider__img > picture > img
    const img = slide.querySelector('.editorial-slider__img picture img');
    // Always reference the element directly (not clone)
    let imgElem = img || '';
    // Only first row gets text content
    if (i === 0 && descContent) {
      rows.push([imgElem, descContent]);
    } else {
      rows.push([imgElem, '']);
    }
  });

  // Create block and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
