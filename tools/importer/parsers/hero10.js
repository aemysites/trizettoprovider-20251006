/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find background image (if any)
  function findBackgroundImage(el) {
    // Look for img tags
    const img = el.querySelector('img');
    if (img) return img;
    // Sometimes background images are set via inline style
    let bgUrl = '';
    let bgEl = el;
    while (bgEl && bgEl !== document.body) {
      const style = bgEl.getAttribute('style');
      if (style && style.includes('background-image')) {
        const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          bgUrl = match[1];
          break;
        }
      }
      bgEl = bgEl.parentElement;
    }
    if (bgUrl) {
      const image = document.createElement('img');
      image.src = bgUrl;
      return image;
    }
    return null;
  }

  // Helper: Find main text content (heading, subheading, paragraph)
  function findTextContent(el) {
    // Look for .wpb_text_column or similar
    const textCol = el.querySelector('.wpb_text_column, .mpc-cubebox-side__content, .mpc-cubebox-side');
    let content = [];
    if (textCol) {
      // Use all direct children in .wpb_wrapper if present
      const wrapper = textCol.querySelector('.wpb_wrapper') || textCol;
      // Only grab h1/h2/h3/p etc
      const allowedTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'];
      Array.from(wrapper.children).forEach((child) => {
        if (allowedTags.includes(child.tagName)) {
          content.push(child);
        }
      });
    }
    return content;
  }

  // Helper: Find CTA button (as link)
  function findCTA(el) {
    // Look for <a> with button classes
    const btn = el.querySelector('a.mpc-button, a[class*="button"]');
    if (btn) {
      // Use the button text and link
      const btnText = btn.querySelector('.mpc-button__title') ? btn.querySelector('.mpc-button__title').textContent : btn.textContent;
      const link = document.createElement('a');
      link.href = btn.href;
      link.textContent = btnText;
      link.title = btn.title || '';
      return link;
    }
    return null;
  }

  // Build table rows
  const headerRow = ['Hero (hero10)'];

  // Row 2: Background image (optional)
  const bgImg = findBackgroundImage(element);
  const bgRow = [bgImg ? bgImg : ''];

  // Row 3: Content (heading, subheading, CTA)
  const textContent = findTextContent(element);
  const cta = findCTA(element);
  const contentRow = [cta ? [...textContent, cta] : textContent];

  // Compose table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
