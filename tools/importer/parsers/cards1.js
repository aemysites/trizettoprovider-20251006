/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) block: 2 columns, 1 row per card, each card: [image, text]
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find all columns that could be cards (skip empty columns)
  // Card columns have class 'vc_col-sm-4'
  const cardColumns = Array.from(element.querySelectorAll('.wpb_column.vc_col-sm-4'));

  cardColumns.forEach((col) => {
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return;

    // Find the image (first <img> inside wrapper)
    const img = wrapper.querySelector('img');

    // Find all textblocks (to get all text content, not just specific classes)
    const textBlocks = wrapper.querySelectorAll('.mpc-textblock');
    const textCell = document.createElement('div');
    textBlocks.forEach(tb => {
      // Append all child nodes (preserve structure and links)
      Array.from(tb.childNodes).forEach(n => textCell.appendChild(n.cloneNode(true)));
    });

    // Add the card row: [image, text]
    if (img && textCell.textContent.trim()) {
      rows.push([img, textCell]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
