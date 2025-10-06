/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a column
  function extractCard(col) {
    // Find the image (mandatory)
    const img = col.querySelector('img');

    // Find the title (h4 > a or h4)
    let title = null;
    const h4 = col.querySelector('h4');
    if (h4) {
      title = h4;
    }

    // Find the description (h5s)
    const h5s = Array.from(col.querySelectorAll('h5'));
    let description = null;
    if (h5s.length) {
      // Wrap in a div for grouping
      description = document.createElement('div');
      h5s.forEach(h5 => description.appendChild(h5));
    }

    // Find the CTA button (a.mpc-button)
    let cta = col.querySelector('a.mpc-button');
    if (cta) {
      // Only keep the text and link, not the icon or background
      const ctaText = cta.querySelector('.mpc-button__title');
      const ctaLink = document.createElement('a');
      ctaLink.href = cta.href;
      ctaLink.textContent = ctaText ? ctaText.textContent : cta.textContent;
      cta = ctaLink;
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (description) textCell.appendChild(description);
    if (cta) textCell.appendChild(cta);

    return [img, textCell];
  }

  // Find the two card columns
  const innerRow = element.querySelector('.vc_inner.vc_row');
  const cardCols = innerRow ? innerRow.querySelectorAll(':scope > .wpb_column') : [];

  // Build table rows
  const rows = [
    ['Cards (cards11)']
  ];

  cardCols.forEach(col => {
    rows.push(extractCard(col));
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
