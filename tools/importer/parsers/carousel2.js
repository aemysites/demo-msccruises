/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the absolute src for images
  function getAbsoluteSrc(img) {
    if (!img) return '';
    const a = document.createElement('a');
    a.href = img.getAttribute('src') || '';
    return a.href;
  }

  // 1. Find the image and text columns inside the carousel
  const imageColumn = element.querySelector('.editorial-slider__column--image');
  const descColumn = element.querySelector('.editorial-slider__column--description');

  // 2. Gather all slides/images
  let slides = [];
  if (imageColumn) {
    slides = Array.from(imageColumn.querySelectorAll('.swiper-slide'));
  }

  // 3. Prepare the content for the text cell (reuse for every slide)
  let textCellContent = [];
  if (descColumn) {
    // This structure: editorial-image-header > h2, editorial-image-content > span > p*
    const header = descColumn.querySelector('.editorial-image-header h2');
    if (header) {
      textCellContent.push(header);
    }
    const contentSpan = descColumn.querySelector('.editorial-image-content span');
    if (contentSpan) {
      // Only add non-empty p tags
      Array.from(contentSpan.querySelectorAll('p')).forEach((p) => {
        if (p.textContent.trim() && p.innerHTML.replace(/&nbsp;/g, '').trim()) {
          textCellContent.push(p);
        }
      });
    }
  }

  // 4. Build the rows for the block table
  const rows = [];
  // Header row must match exactly
  rows.push(['Carousel (carousel2)']);
  // Each subsequent row: [image, text content]
  slides.forEach((slide) => {
    // Find the image in the slide
    let img = null;
    const pic = slide.querySelector('picture');
    if (pic) {
      img = pic.querySelector('img');
    } else {
      img = slide.querySelector('img');
    }
    // Defensive: use the <img> element directly if found, else empty string
    const imageCell = img ? img : '';
    // Second cell: text content array or empty string
    rows.push([imageCell, textCellContent.length > 0 ? textCellContent : '']);
  });

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
