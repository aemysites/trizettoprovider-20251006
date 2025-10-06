/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a column
  function extractCardContent(col) {
    // Find image
    const img = col.querySelector('img');
    // Find the top text block (title/link)
    const textBlocks = col.querySelectorAll('.mpc-textblock');
    let titleBlock = null;
    let descBlock = null;
    if (textBlocks.length > 0) {
      titleBlock = textBlocks[0];
      if (textBlocks.length > 1) {
        descBlock = textBlocks[1];
      }
    }
    // Compose the title cell: prefer the link/title block
    let titleCell = null;
    if (titleBlock) {
      // Use the entire block (contains link and heading styling)
      titleCell = titleBlock;
    }
    // Compose the description cell
    let descCell = null;
    if (descBlock) {
      descCell = descBlock;
    }
    // Compose the text cell: stack title and description
    const textCell = document.createElement('div');
    if (titleCell) textCell.appendChild(titleCell);
    if (descCell) textCell.appendChild(descCell);
    // If no description, just use title
    if (!titleCell && !descCell) {
      textCell.textContent = '';
    }
    // Return [image, textCell]
    return [img, textCell];
  }

  // Get all columns that may contain cards
  const columns = Array.from(element.querySelectorAll(':scope > .wpb_column'));
  // Only keep columns that have an image (card columns)
  const cardColumns = columns.filter(col => col.querySelector('img'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards1)']);
  // Card rows
  cardColumns.forEach(col => {
    const [img, textCell] = extractCardContent(col);
    rows.push([img, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
