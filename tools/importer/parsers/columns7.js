/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the columns (should be 3: left, center, right)
  let columns = [];
  const wrapper = element.querySelector('.footer-widgets-wrapper');
  if (wrapper) {
    columns = Array.from(wrapper.querySelectorAll(':scope > .footer-widgets'));
  }
  // Fallback: use .grid-item if needed
  if (columns.length === 0 && wrapper) {
    columns = Array.from(wrapper.querySelectorAll(':scope > .grid-item'));
  }
  // Defensive fallback: all direct children
  if (columns.length === 0 && wrapper) {
    columns = Array.from(wrapper.children);
  }
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // 2. For each column, collect all its child nodes (preserving structure)
  const columnCells = columns.map((col) => {
    // If column is empty, return empty div
    if (!col || !col.childNodes || col.childNodes.length === 0) {
      return document.createElement('div');
    }
    // Use a fragment to preserve all content and references
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      frag.appendChild(node);
    });
    return frag;
  });

  // 3. Build the table rows
  const headerRow = ['Columns (columns7)'];
  const secondRow = columnCells;
  const rows = [headerRow, secondRow];

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  element.replaceWith(table);
}
