/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always the block name
  const headerRow = ['Hero (hero10)'];

  // 2. Background image row: none in the HTML, so leave empty
  const backgroundRow = [''];

  // 3. Content row: extract ALL text content and CTA
  let contentElements = [];
  // Find the main content container
  const contentContainer = element.querySelector('.mpc-cubebox-side__content');
  if (contentContainer) {
    // Get all direct children that are not style/script
    const wrappers = contentContainer.querySelectorAll('.wpb_wrapper');
    wrappers.forEach(wrapper => {
      // Push all block-level elements (h1, p, etc.) in order
      Array.from(wrapper.children).forEach(child => {
        if (child.tagName.match(/^(H\d|P)$/)) {
          contentElements.push(child);
        }
      });
    });
    // Find CTA (a) anywhere inside contentContainer
    const cta = contentContainer.querySelector('a');
    if (cta) contentElements.push(cta);
  }
  const contentRow = [contentElements];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
