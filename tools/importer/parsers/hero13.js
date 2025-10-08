/* global WebImporter */
export default function parse(element, { document }) {
  // === Hero (hero13) Parser ===
  // 1. Extract background image (must reference existing element)
  const bgImg = element.querySelector(':scope > img');

  // 2. Extract main text content (quote and attribution)
  // Find the main column
  const column = element.querySelector('.wpb_column');
  let textNodes = [];
  if (column) {
    // Find all .wpb_text_column wrappers in order
    const textColumns = column.querySelectorAll('.wpb_text_column');
    textColumns.forEach(tc => {
      const inner = tc.querySelector('.wpb_wrapper');
      if (inner) {
        // Push all children (usually <p>)
        Array.from(inner.children).forEach(child => {
          textNodes.push(child);
        });
      }
    });
  }

  // 3. Compose table rows
  // Header row: must match block name exactly
  const headerRow = ['Hero (hero13)'];
  // Second row: background image (reference existing element, not URL)
  const imageRow = [bgImg ? bgImg : ''];
  // Third row: text content (all text nodes, preserve structure)
  const contentRow = [textNodes.length ? textNodes : ''];

  // 4. Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace original element
  element.replaceWith(table);
}
