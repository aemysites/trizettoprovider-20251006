/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the direct image child for the background image
  const img = element.querySelector(':scope > img');

  // 2. Find the deepest .wpb_wrapper containing h1/h2/h3/p for text content
  let contentCell = '';
  const wrappers = element.querySelectorAll('.wpb_wrapper');
  for (const wrapper of wrappers) {
    // Only grab the actual heading/subheading/cta, not wrappers or empty space
    const heading = wrapper.querySelector('h1, h2, h3, p');
    if (heading) {
      // Collect all heading/subheading/cta elements in this wrapper
      const fragment = document.createDocumentFragment();
      wrapper.querySelectorAll('h1, h2, h3, p, a').forEach((el) => {
        fragment.appendChild(el.cloneNode(true));
      });
      contentCell = fragment;
      break;
    }
  }

  // 3. Compose table rows
  const headerRow = ['Hero (hero14)']; // Must match target block name
  const imageRow = [img ? img : '']; // Reference image element if present
  const contentRow = [contentCell]; // Only relevant content

  // 4. Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element
  element.replaceWith(table);
}
