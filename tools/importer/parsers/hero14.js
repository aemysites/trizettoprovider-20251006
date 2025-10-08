/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match block name exactly
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row: reference the actual <img> element, not URL or alt
  const img = element.querySelector('img');
  const bgImgCell = img ? [img] : [''];

  // 3. Content row: headline, subheading, CTA (if any)
  // Find the main heading (h1, h2, h3) inside the block
  let contentCell = [];
  const heading = element.querySelector('h1, h2, h3');
  if (heading) {
    contentCell.push(heading);
  }
  // No subheading or CTA in this example, but parser is robust for future cases

  // If no heading, fallback to any text content
  if (contentCell.length === 0) {
    const text = element.textContent.trim();
    if (text) contentCell.push(document.createTextNode(text));
  }

  // Compose table rows
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
