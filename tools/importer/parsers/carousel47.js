/* global WebImporter */
export default function parse(element, { document }) {
  // The block/table name matches the example exactly
  const headerRow = ['Carousel (carousel47)'];
  const cells = [headerRow];

  // Find all carousels in this section
  const carousels = Array.from(element.querySelectorAll('.editorial-slider'));

  carousels.forEach(carousel => {
    // Get image slides
    const imageSlides = Array.from(carousel.querySelectorAll('.editorial-slider__column--image .swiper-slide'));
    // Get the description column
    const descCol = carousel.querySelector('.editorial-slider__column--description');
    let descContentParent = null;
    if (descCol) {
      // Find .editorial-image-content > span
      const editorialImageContent = descCol.querySelector('.editorial-image-content span');
      if (editorialImageContent) {
        descContentParent = editorialImageContent;
      }
    }

    // Parse slide contents
    let descBlocks = [];
    if (descContentParent) {
      // Collect childNodes grouped by <div>&nbsp;</div> or <p>&nbsp;</p> or split by logic
      // We'll treat runs of <p> tags as blocks separated by <p>&nbsp;</p> or <div>&nbsp;</div> (which are visual spacers)
      const children = Array.from(descContentParent.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim() !== '';
        if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'DIV')) {
          // skip empty
          return node.textContent.replace(/\u00a0|\s/g, '') !== '';
        }
        return true;
      });
      // Group <p> blocks by <div> or <p> with only whitespace
      let blocks = [], currentBlock = [];
      children.forEach(node => {
        if (node.nodeType === 1 && (node.tagName === 'DIV')) {
          if (currentBlock.length) blocks.push([...currentBlock]);
          currentBlock = [];
        } else if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.replace(/\u00a0|\s/g, '') === '') {
          if (currentBlock.length) blocks.push([...currentBlock]);
          currentBlock = [];
        } else {
          currentBlock.push(node);
        }
      });
      if (currentBlock.length) blocks.push([...currentBlock]);
      // If no blocks, fallback to all children in one
      if (blocks.length === 0) blocks = [children];
      descBlocks = blocks;
    }

    // For each slide, assemble image and description
    for (let i = 0; i < imageSlides.length; i++) {
      const slide = imageSlides[i];
      // Find the image element in the slide
      const picture = slide.querySelector('picture');
      let imageEl = null;
      if (picture) {
        // Use the <img> child, reference directly
        const img = picture.querySelector('img');
        if (img) imageEl = img;
      }
      // Description for this slide (if available)
      let descCell = '';
      if (descBlocks.length === imageSlides.length) {
        // One block per slide, assign by index
        const dblock = descBlocks[i];
        if (dblock && dblock.length === 1) {
          descCell = dblock[0];
        } else if (dblock && dblock.length > 1) {
          descCell = dblock;
        }
      } else if (descBlocks.length === 1 && i === 0) {
        // Only one block, assign only to first slide
        const dblock = descBlocks[0];
        if (dblock && dblock.length === 1) {
          descCell = dblock[0];
        } else if (dblock && dblock.length > 1) {
          descCell = dblock;
        }
      } else {
        descCell = '';
      }
      cells.push([
        imageEl || '',
        descCell
      ]);
    }
  });

  // Replace original element with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
