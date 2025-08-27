/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Carousel (carousel57)'];
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) return;
  const imageColumn = columns[0];
  const descColumn = columns[1];

  // Slides for images and descriptions
  const imageSlides = Array.from(imageColumn.querySelectorAll(':scope .swiper-wrapper > .swiper-slide'));
  const descSlides = Array.from(descColumn.querySelectorAll(':scope .swiper-wrapper > .swiper-slide'));

  // Collect rows: each is [image, description]
  const rows = [];
  for (let i = 0; i < Math.max(imageSlides.length, descSlides.length); i++) {
    // --- IMAGE CELL ---
    let imgCell = null;
    if (imageSlides[i]) {
      const imgContainer = imageSlides[i].querySelector('.editorial-slider__img');
      if (imgContainer) {
        // Reference the entire <picture> if present, else <img>
        const picture = imgContainer.querySelector('picture');
        if (picture) {
          imgCell = picture;
        } else {
          const img = imgContainer.querySelector('img');
          if (img) imgCell = img;
        }
      }
    }
    // --- TEXT CELL ---
    let textCell = null;
    if (descSlides[i]) {
      const desc = descSlides[i].querySelector('.editorial-slider__description');
      if (desc) {
        // Prepare one container div to maintain structure
        const textDiv = document.createElement('div');
        // Title: h3
        const title = desc.querySelector('.editorial-slider__title');
        if (title) textDiv.appendChild(title);
        // Description: .editorial-slider__text (usually a p), plus additional non-empty p tags
        const editorialText = desc.querySelector('.editorial-slider__text');
        if (editorialText && editorialText.textContent.trim()) {
          textDiv.appendChild(editorialText);
        }
        // Any additional <p> (excluding already added)
        const allPs = Array.from(desc.querySelectorAll('p')).filter(p => p !== editorialText && p.textContent.trim());
        allPs.forEach(p => textDiv.appendChild(p));
        // CTA link (if present)
        const cta = desc.querySelector('.editorial-slider__link');
        if (cta) {
          textDiv.appendChild(document.createElement('br'));
          textDiv.appendChild(cta);
        }
        // Only include cell if any content
        if (textDiv.hasChildNodes()) {
          textCell = textDiv;
        }
      }
    }
    // Only add row if image exists
    if (imgCell) {
      rows.push([imgCell, textCell]);
    }
  }
  // Build final table data array
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(block, element);
}
