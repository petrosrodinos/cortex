export const PDF_KIT_API_REFERENCE = `
PDFKit API (doc):
- doc.text(str, options?) — write text; options: align, width, lineGap, indent
- doc.font(name) — 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'
- doc.fontSize(n) — set font size
- doc.fillColor(hex) — text/fill color
- doc.strokeColor(hex) — stroke color
- doc.rect(x, y, w, h).fill(color) / .stroke() / .fillAndStroke(fill, stroke)
- doc.moveDown(n?) — vertical spacing
- doc.addPage() — new page
- doc.y — current vertical position
- doc.page.width, doc.page.height, doc.page.margins

Helpers (h) — prefer these for consistent professional styling:
- h.colors — { accent, title, body, muted, headerBg, headerText, rowAlt, rowBorder }
- h.drawCover(doc, { title, subtitle? }) — cover block with accent bar, title, date
- h.drawSectionHeading(doc, text) — section heading with accent underline
- h.drawBody(doc, text) — paragraphs and bullet lists (use "• " prefix for bullets)
- h.drawTable(doc, headers, rows) — styled table with dark header and zebra rows
- h.ensureSpace(doc, height) — page break before content
- Do NOT call h.drawPageFooters or doc.end() — the runner handles those.
`.trim();

export const PDF_CODE_EXAMPLE = `
h.drawCover(doc, { title: 'Q1 Sales Performance Report', subtitle: 'Prepared for Leadership' });
h.drawSectionHeading(doc, 'Executive Summary');
h.drawBody(doc, 'Revenue grew 12% quarter-over-quarter driven by enterprise renewals.\\n• Enterprise ARR up 18%\\n• New logos: 24\\n• Churn held at 2.1%');
h.drawSectionHeading(doc, 'Top Accounts');
h.drawTable(doc, ['Account', 'Revenue', 'Growth'], [
  ['Acme Corp', '$142,000', '+15%'],
  ['Globex', '$98,500', '+9%'],
]);
`.trim();

export const PDF_CREATION_GUIDANCE =
  'Deliver polished, business-ready PDF reports by default — never bare black-and-white dumps with minimal structure unless the user explicitly asks for plain, minimal, or unstyled output. ' +
  'Write PDFKit JavaScript code that runs as the body of (doc, h) => { ... }. Embed all data inline in the code. ' +
  'Structure every PDF like a professional deliverable: (1) h.drawCover with a clear title and optional subtitle; (2) an Executive Summary or Overview section when the document has multiple sections; (3) h.drawSectionHeading with specific headings — not "Section 1"; (4) h.drawBody with concise paragraphs and "• " bullet lines; (5) h.drawTable for tabular data with human-readable headers and formatted numbers; (6) Key Takeaways or Next Steps when appropriate. ' +
  'Mix h helpers with raw doc calls for custom layouts. Never call doc.end(). ' +
  PDF_KIT_API_REFERENCE +
  ' Example code body:\n' +
  PDF_CODE_EXAMPLE;

export const PDF_TOOL_DESCRIPTION_PREFIX =
  'Create a professionally styled PDF by submitting PDFKit JavaScript code. Use when the user asks to create, export, or generate a PDF file or report.';
