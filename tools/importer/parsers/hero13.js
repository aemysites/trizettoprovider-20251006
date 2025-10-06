/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the background image (first <img> child)
  const bgImg = element.querySelector(':scope > img');

  // 2. Find the main column containing text
  const col = element.querySelector('.vc_column_container');
  let textBlocks = [];
  if (col) {
    // Find all .wpb_text_column blocks in order
    const wrappers = col.querySelectorAll('.wpb_text_column');
    wrappers.forEach(wrap => {
      // Only reference the wrapper div (not clone)
      textBlocks.push(wrap);
    });
  }

  // 3. Compose table rows
  const headerRow = ['Hero (hero13)']; // Must match target block name exactly
  const imageRow = [bgImg ? bgImg : '']; // Reference image element if present
  const contentRow = [textBlocks.length ? textBlocks : '']; // Reference all text blocks as array

  // 4. Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace element
  element.replaceWith(table);
}
