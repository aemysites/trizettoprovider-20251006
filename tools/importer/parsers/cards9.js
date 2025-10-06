/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a column
  function extractCard(column) {
    // Find image
    const img = column.querySelector('img');
    // Find title (strong inside p)
    let title = null;
    const titleP = column.querySelector('.font-white.font-shadow p');
    if (titleP) {
      // Try to find strong, else fallback to all text
      const strong = titleP.querySelector('strong');
      if (strong) {
        title = document.createElement('strong');
        title.innerHTML = strong.textContent;
      } else {
        title = document.createElement('strong');
        title.innerHTML = titleP.textContent;
      }
    }
    // Find description (next .font-light)
    let desc = null;
    const descP = column.querySelector('.font-light p');
    if (descP) {
      // Remove <br> for line breaks, join with space
      const lines = [];
      descP.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          // Text node
          if (node.textContent.trim()) lines.push(node.textContent.trim());
        } else if (node.nodeName === 'A') {
          lines.push(node.textContent.trim());
        } else if (node.nodeName === 'BR') {
          // skip
        }
      });
      desc = document.createElement('div');
      desc.innerHTML = lines.join('<br>');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(desc);
    }
    return [img, textCell];
  }

  // Get all columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Only keep columns with content (skip empty columns)
  const cardColumns = columns.filter(col => col.querySelector('img'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards9)']);
  // Card rows
  cardColumns.forEach(col => {
    rows.push(extractCard(col));
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(table);
}
