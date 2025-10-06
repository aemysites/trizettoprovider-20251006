/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the modal content area
  const modalContent = element.querySelector('.mpc-modal__content');
  if (!modalContent) return;

  // Find the first inner row (contains the main columns)
  const innerRows = modalContent.querySelectorAll('.vc_row.vc_inner');
  if (!innerRows.length) return;

  // First inner row: contains image, icon/link, and name/title columns
  const mainRow = innerRows[0];
  const mainCols = mainRow.querySelectorAll(':scope > .wpb_column');

  // Defensive: Ensure we have at least three columns
  if (mainCols.length < 3) return;

  // --- First column: Image ---
  let imgCell = '';
  const imgCol = mainCols[0];
  const img = imgCol.querySelector('img');
  if (img) {
    imgCell = img;
  }

  // --- Second column: LinkedIn icon/link ---
  let linkCell = '';
  const iconCol = mainCols[1];
  const linkedinLink = iconCol.querySelector('a[href*="linkedin.com/"]');
  if (linkedinLink && linkedinLink.href && linkedinLink.href.trim() !== '') {
    // Only include the link if it has a valid href
    linkCell = linkedinLink;
  }

  // --- Third column: Name, Title ---
  let nameCell = [];
  const nameCol = mainCols[2];
  // Find name (h4)
  const nameH4 = nameCol.querySelector('h4');
  if (nameH4) nameCell.push(nameH4);
  // Find title (first p)
  const titleP = nameCol.querySelector('p');
  if (titleP) nameCell.push(titleP);

  // --- Second row: Bio/description ---
  // Find the second inner row (bio)
  let bioCell = '';
  if (innerRows.length > 1) {
    const bioRow = innerRows[1];
    // The main bio is in the second column (8/12)
    const bioCols = bioRow.querySelectorAll(':scope > .wpb_column');
    if (bioCols.length > 1) {
      const bioCol = bioCols[1];
      // Find all paragraphs in the bio
      const bioPs = bioCol.querySelectorAll('p');
      if (bioPs.length) {
        bioCell = Array.from(bioPs);
      }
    }
  }

  // --- Build table rows ---
  const headerRow = ['Columns block (columns6)'];
  // Second row: image | linkedin | name/title
  const secondRow = [imgCell, linkCell, nameCell];
  // Third row: bio only (no unnecessary empty columns)
  const thirdRow = [bioCell];

  // Create table
  const cells = [headerRow, secondRow, thirdRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
