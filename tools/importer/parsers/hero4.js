/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the background image (first <img> child)
  let img = element.querySelector('img');

  // 2. Find the heading (h1) inside the column
  let heading = null;
  const column = element.querySelector('.wpb_column');
  if (column) {
    heading = column.querySelector('h1');
  }

  // 3. Build table rows
  const headerRow = ['Hero (hero4)'];
  const imageRow = [img ? img : '']; // reference the actual <img> element
  const contentRow = [heading ? heading : '']; // reference the actual <h1> element

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
