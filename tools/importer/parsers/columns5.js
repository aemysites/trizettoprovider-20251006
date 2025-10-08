/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns block (columns5)'];

  // Find the inner row with columns (the actual two-column content)
  const innerRow = element.querySelector('.vc_inner.vc_row');
  if (!innerRow) return;

  // Get the columns (should be two main columns: left and right)
  const columns = innerRow.querySelectorAll(':scope > .wpb_column');
  if (columns.length < 2) return;

  // Left column: main content (heading, paragraph, list)
  const leftCol = columns[0];
  // Right column: stats and image
  const rightCol = columns[1];

  // Helper to remove empty space divs
  function filterContent(nodes) {
    return Array.from(nodes).filter(node => {
      if (node.classList) {
        if (node.classList.contains('vc_empty_space')) return false;
      }
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
  }

  // Left column content: get all relevant children (heading, paragraphs, list)
  const leftContentWrapper = leftCol.querySelector('.wpb_wrapper');
  let leftContent = [];
  if (leftContentWrapper) {
    leftContent = filterContent(leftContentWrapper.children);
  }

  // Right column content: get all relevant children (headings, stat, image)
  const rightContentWrapper = rightCol.querySelector('.wpb_wrapper');
  let rightContent = [];
  if (rightContentWrapper) {
    rightContent = filterContent(rightContentWrapper.children);
  }

  // Table structure: header row, then one row with two columns
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
