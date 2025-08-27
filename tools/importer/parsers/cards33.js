/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: get relevant image element from a <picture> (prefer <img>, fallback to <picture> itself)
  function getPictureImg(picture) {
    if (!picture) return null;
    const img = picture.querySelector('img');
    return img ? img : picture;
  }

  // Find the card container
  const carousel = element.querySelector('.tile-container--carousel');
  if (!carousel) return;
  const cardElements = carousel.querySelectorAll(':scope > .tile');

  const cells = [['Cards (cards33)']]; // Header row - matches example exactly

  cardElements.forEach((card) => {
    // -- IMAGE: Prefer first image from carousel if present --
    let image = null;
    const detail = card.querySelector('.tile--with-detail__detailed');
    if (detail) {
      const swiperWrapper = detail.querySelector('.swiper-wrapper');
      if (swiperWrapper) {
        const firstSlidePic = swiperWrapper.querySelector('.swiper-slide picture');
        if (firstSlidePic) {
          image = getPictureImg(firstSlidePic);
        }
      }
    }
    if (!image) {
      const blockPic = card.querySelector('.tile--with-detail--block picture');
      if (blockPic) {
        image = getPictureImg(blockPic);
      }
    }

    // -- TEXT CONTENT: Get all text with semantic meaning as described in the block --
    let textCell = null;
    // Try to extract title from detailed section
    let title = '';
    if (detail) {
      const detailTitle = detail.querySelector('.tile-detail__title > span');
      if (detailTitle && detailTitle.textContent.trim()) {
        title = detailTitle.textContent.trim();
      }
    }
    // Fallback to block title
    if (!title) {
      const blockTitle = card.querySelector('.tile__title');
      if (blockTitle && blockTitle.textContent.trim()) {
        title = blockTitle.textContent.trim();
      }
    }

    // Compose text content from detailed text if available, else fallback to visible block
    let contentElements = [];
    if (title) {
      // Use <strong> for the title as per the example
      const strong = document.createElement('strong');
      strong.textContent = title;
      contentElements.push(strong);
    }
    let descriptionAdded = false;
    if (detail) {
      const detailText = detail.querySelector('.tile-detail__text');
      if (detailText) {
        // Push all child nodes (elements and rich text) for maximal semantic capture
        Array.from(detailText.childNodes).forEach((node) => {
          // Only non-empty nodes
          if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
            contentElements.push(node);
            descriptionAdded = true;
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // Wrap in <span> to preserve text
            const span = document.createElement('span');
            span.textContent = node.textContent;
            contentElements.push(span);
            descriptionAdded = true;
          }
        });
      }
    }
    // If description is still missing, fallback to block-level visible description
    if (!descriptionAdded) {
      // Look for a paragraph, button, or see-details block
      const descBlock = card.querySelector('.tile__see-details');
      if (descBlock && descBlock.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descBlock.textContent.trim();
        contentElements.push(p);
      }
    }
    // Remove empty elements from contentElements
    contentElements = contentElements.filter(el => {
      if (typeof el === 'string') return el.trim().length > 0;
      if (el.nodeType === Node.ELEMENT_NODE) return el.textContent.trim().length > 0;
      return true;
    });
    // If only one element, pass just that element, else pass array
    textCell = contentElements.length === 1 ? contentElements[0] : contentElements;

    // Add the card row
    cells.push([image, textCell]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
