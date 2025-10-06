/* global WebImporter */
export default function parse(element, { document }) {
  // Find the only column with content (the middle one)
  const columns = Array.from(element.querySelectorAll(':scope > div.wpb_column'));
  const cardColumn = columns.find(col => col.querySelector('.vc_column-inner .wpb_wrapper').children.length > 0);
  if (!cardColumn) return;

  const wrapper = cardColumn.querySelector('.vc_column-inner .wpb_wrapper');

  // Find the image element (reference, do not clone)
  const img = wrapper.querySelector('.wpb_single_image img');
  const imageEl = img || '';

  // Find the title (strong inside the first text column)
  let titleEl = '';
  const titleCol = wrapper.querySelector('.wpb_text_column.font-white.font-shadow');
  if (titleCol) {
    const strong = titleCol.querySelector('strong');
    if (strong) {
      titleEl = document.createElement('strong');
      titleEl.textContent = strong.textContent;
    } else {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleCol.textContent.trim();
    }
  }

  // Find the description (second text column)
  let descEl = '';
  const descCol = wrapper.querySelector('.wpb_text_column.font-white.font-shadow.font-light');
  if (descCol) {
    // Only use textContent, not innerHTML, to avoid markup artifacts
    descEl = document.createElement('div');
    descEl.textContent = descCol.textContent.trim();
  }

  // Compose the text cell
  const textCell = [];
  if (titleEl) textCell.push(titleEl);
  if (descEl) textCell.push(descEl);

  // Table header per block spec
  const headerRow = ['Cards (cards16)'];
  const cardRow = [imageEl, textCell];
  const rows = [headerRow, cardRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
