/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the background image (img element)
  const img = element.querySelector('img');

  // Find the main content column (usually the first .vc_column_container)
  let contentColumn = null;
  for (const div of topDivs) {
    if (div.classList.contains('vc_column_container')) {
      contentColumn = div;
      break;
    }
  }

  // Defensive: fallback to element if not found
  if (!contentColumn) contentColumn = element;

  // Find the main heading/subheading content
  // Look for h1/h2/h3/p inside contentColumn
  let contentElements = [];
  const headingSelectors = 'h1, h2, h3, h4, h5, h6, p, .wpb_text_column';
  // Try to find .wpb_text_column first (often wraps content)
  const textColumn = contentColumn.querySelector('.wpb_text_column');
  if (textColumn) {
    // Use all children of the .wpb_text_column's .wpb_wrapper
    const wrapper = textColumn.querySelector('.wpb_wrapper') || textColumn;
    contentElements = Array.from(wrapper.childNodes).filter(
      node => node.nodeType === 1 // element nodes only
    );
    // Defensive: if nothing found, fallback to all headings/paragraphs
    if (contentElements.length === 0) {
      contentElements = Array.from(textColumn.querySelectorAll(headingSelectors));
    }
  } else {
    // Fallback: look for headings/paragraphs directly in contentColumn
    contentElements = Array.from(contentColumn.querySelectorAll(headingSelectors));
  }

  // Compose table rows
  const headerRow = ['Hero (hero17)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentElements.length > 0 ? contentElements : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
