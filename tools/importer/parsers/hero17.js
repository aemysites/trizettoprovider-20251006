/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO (hero17) ---
  // Table: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Headline, subheading, CTA (optional)

  // Helper: Get first image in block
  let img = element.querySelector('img');

  // Helper: Get headline (h1/h2/h3 inside block)
  let headline = null;
  headline = element.querySelector('h1, h2, h3');

  // Compose text content cell
  const textContent = [];
  if (headline) {
    textContent.push(headline);
  }

  // Compose table rows
  const headerRow = ['Hero (hero17)'];
  const imageRow = [img ? img : ''];
  const contentRow = [textContent.length ? textContent : ''];

  // Build block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
