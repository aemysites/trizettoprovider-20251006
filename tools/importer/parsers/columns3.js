/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > .wpb_column'));
  if (!columns.length) return;

  // Only keep columns that have at least one text block (to avoid icon-only columns)
  const contentColumns = columns.filter(col => col.querySelector('.mpc-textblock'));

  // Group columns into rows of 2 columns each (each cell = icon+heading+desc)
  const rows = [];
  for (let i = 0; i < contentColumns.length; i += 2) {
    const row = [];
    for (let j = 0; j < 2; j++) {
      const col = contentColumns[i + j];
      if (col) {
        // Compose card: icon from previous sibling column (if present) + all text blocks
        const cellContent = [];
        // Try to find the icon in the previous column (icon columns are always before content columns)
        const iconCol = columns[columns.indexOf(col) - 1];
        const icon = iconCol && iconCol.querySelector('.mpc-icon');
        if (icon) cellContent.push(icon);
        // Get all text blocks (heading/link and description)
        const textBlocks = Array.from(col.querySelectorAll('.mpc-textblock'));
        textBlocks.forEach(tb => cellContent.push(tb));
        row.push(cellContent);
      } else {
        row.push(''); // empty cell if missing
      }
    }
    rows.push(row);
  }

  // Build table: header row, then content rows
  const headerRow = ['Columns block (columns3)'];
  const tableCells = [headerRow, ...rows];

  // Create and replace
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(blockTable);
}
