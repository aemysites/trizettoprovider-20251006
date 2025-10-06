/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // Get all direct column containers
  const columns = getDirectChildrenByClass(element, 'wpb_column');

  // Each column pair: [iconCol, textCol]
  const cells = [];
  for (let i = 0; i < columns.length; i += 2) {
    const iconCol = columns[i];
    const textCol = columns[i + 1];
    if (!iconCol || !textCol) continue;

    // Get the icon (the .mpc-icon inside iconCol)
    let icon = iconCol.querySelector('.mpc-icon');
    // Get all text blocks (all .mpc-textblock inside textCol)
    const textBlocks = Array.from(textCol.querySelectorAll('.mpc-textblock'));

    // Instead of pushing elements, extract their text content for flexibility
    const cellParts = [];
    if (icon) {
      // Optionally, you could extract SVG or icon HTML, but for text focus, skip or add a marker
      // cellParts.push('[icon]'); // If you want a marker
    }
    textBlocks.forEach(tb => {
      // Get all text content from the block
      cellParts.push(tb.textContent.trim());
    });
    // Join all text parts for this cell
    cells.push([cellParts.join(' ')]);
  }

  const headerRow = ['Columns block (columns3)'];
  if (cells.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      cells.map(cellArr => cellArr[0]), // Flatten to single cell per column
    ], document);
    element.replaceWith(table);
  }
}
