/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child columns of the inner row
  function getColumns(rowEl) {
    return Array.from(rowEl.querySelectorAll(':scope > div.wpb_column'));
  }

  // Find the inner row containing columns
  const innerRow = element.querySelector('.vc_inner.vc_row-fluid');
  if (!innerRow) return;

  const columns = getColumns(innerRow);
  // Defensive: Only use columns with actual content
  const contentColumns = columns.filter(col => {
    // Only keep columns with non-empty wrappers
    const wrapper = col.querySelector('.wpb_wrapper');
    return wrapper && (wrapper.textContent.trim().length > 0 || wrapper.querySelector('img'));
  });

  // Header row
  const headerRow = ['Columns block (columns5)'];

  // Second row: Each column's content in a cell
  const secondRow = contentColumns.map(col => {
    // Get the wrapper containing all content
    const wrapper = col.querySelector('.wpb_wrapper');
    // Defensive: If no wrapper, fallback to column itself
    return wrapper || col;
  });

  // Build the table
  const cells = [
    headerRow,
    secondRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
