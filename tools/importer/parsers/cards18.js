/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards18)'];
  // Select all card blocks (tiles)
  const cardDivs = element.querySelectorAll(':scope .tile--news-blog');
  const rows = [headerRow];
  cardDivs.forEach(cardDiv => {
    // Get image (prefer <img>, fallback to <picture>)
    const picture = cardDiv.querySelector('picture');
    let imageCell = null;
    if (picture) {
      const img = picture.querySelector('img');
      imageCell = img || picture;
    }
    // Text content cell
    const article = cardDiv.querySelector('article');
    const textContent = [];
    if (article) {
      // Title (use strong for heading, matching example structure)
      const titleDiv = article.querySelector('.tile__title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const heading = document.createElement('strong');
        heading.innerHTML = titleDiv.innerHTML;
        textContent.push(heading);
      }
      // Description (one or more paragraphs; skip empty)
      const descDiv = article.querySelector('.tile--news-blog__description');
      if (descDiv) {
        const descParas = Array.from(descDiv.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
        descParas.forEach(p => {
          textContent.push(p);
        });
      }
      // CTA (button link, if present)
      const ctaContainer = article.querySelector('.flex-container');
      if (ctaContainer) {
        const cta = ctaContainer.querySelector('a.button');
        if (cta) {
          textContent.push(cta);
        }
      }
    }
    // Ensure each card row has exactly two cells
    rows.push([imageCell, textContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
