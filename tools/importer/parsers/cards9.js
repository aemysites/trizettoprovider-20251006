/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block - extract cards with image and text

  // Header row as required
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Identify all card columns (skip empty columns)
  // The repeating card structure is: .wpb_column.vc_col-sm-4
  const cardColumns = Array.from(element.querySelectorAll('.wpb_column.vc_col-sm-4'));

  cardColumns.forEach((col) => {
    // The card content is inside .wpb_wrapper
    const wrapper = col.querySelector('.wpb_wrapper');
    if (!wrapper) return;

    // Image: find the first <img> inside the card
    const img = wrapper.querySelector('img');

    // Text content: gather all .wpb_text_column elements (name, roles)
    const textColumns = wrapper.querySelectorAll('.wpb_text_column');
    // We'll combine their content into a single div for the text cell
    const textContainer = document.createElement('div');
    textColumns.forEach(tc => {
      // Use the inner HTML of the .wpb_wrapper inside each .wpb_text_column
      const inner = tc.querySelector('.wpb_wrapper');
      if (inner) {
        // Remove <a> wrappers but keep their content
        // But preserve <strong> for the name
        let html = inner.innerHTML.replace(/<a [^>]*>(.*?)<\/a>/g, '$1');
        textContainer.innerHTML += html;
      }
    });
    textContainer.innerHTML = textContainer.innerHTML.trim();
    // Compose the row: [image, text]
    const row = [img, textContainer];
    rows.push(row);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
