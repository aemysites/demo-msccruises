/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get absolute URL
  function toAbsoluteUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  // Find all slide images
  const imageColumn = element.querySelector('.editorial-slider__column--image .swiper-wrapper');
  const slides = imageColumn ? Array.from(imageColumn.querySelectorAll('.swiper-slide')) : [];

  // Find text blocks
  const descriptionColumn = element.querySelector('.editorial-slider__column--description');
  // Try to find the editorial-image-block for the text per carousel
  const imageBlock = descriptionColumn ? descriptionColumn.querySelector('.editorial-image-block') : null;
  // Find header (h2, h3) and content (editorial-image-content)
  let headerEls = [];
  let contentEls = [];
  if (imageBlock) {
    const headerDiv = imageBlock.querySelector('.editorial-image-header');
    if (headerDiv) {
      headerEls = Array.from(headerDiv.children); // usually h2, h3
    }
    const contentDiv = imageBlock.querySelector('.editorial-image-content');
    if (contentDiv) {
      contentEls = Array.from(contentDiv.children); // usually span or p
    }
  }

  // Create a single block table: header row, then one row per slide
  const tableRows = [];
  tableRows.push(['Carousel (carousel9)']);

  slides.forEach((slide, idx) => {
    // Get image from .editorial-slider__img picture img
    const imgEl = slide.querySelector('.editorial-slider__img picture img');
    let img = null;
    if (imgEl) {
      // Make src absolute
      imgEl.src = toAbsoluteUrl(imgEl.getAttribute('src'));
      img = imgEl;
    }
    // First cell is always image

    // Second cell: Only for the first slide, include the editorial-image-block content (headings and text)
    // For other slides, pass empty string
    let textCell = '';
    if (idx === 0 && imageBlock) {
      // Use the whole editorial-image-block (retaining all header and content formatting)
      textCell = imageBlock;
    }
    tableRows.push([img, textCell]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}