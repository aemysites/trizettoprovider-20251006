/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns18)'];

  // Find all immediate columns (should be 4)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process if we have columns
  if (!columns.length) return;

  // For each column, extract the visible counter and label as a single cell
  const cells = columns.map((col) => {
    // Find the counter wrapper (may be nested)
    const counter = col.querySelector('.mpc-counter');
    if (!counter) return '';
    // We'll keep the whole counter block for resilience
    return counter;
  });

  // Table rows: header, then one row of columns
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
