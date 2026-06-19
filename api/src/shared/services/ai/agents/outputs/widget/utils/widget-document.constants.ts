export const WIDGET_MIME = 'text/html';

export const EXTERNAL_SCRIPT_PATTERN = /<script\b[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*>/gi;

export const TAGS_TO_BALANCE = ['tbody', 'table', 'thead', 'tfoot', 'div', 'section', 'main', 'ul', 'ol'] as const;

export const WIDGET_FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

export const WIDGET_RUNTIME_HELPERS = `
function widgetRecords() {
  if (Array.isArray(WIDGET_DATA)) return WIDGET_DATA;
  if (WIDGET_DATA && typeof WIDGET_DATA === 'object') {
    for (const value of Object.values(WIDGET_DATA)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') return value;
    }
  }
  return [];
}
function renderTableRows(tbodySelector, records, buildRow) {
  const tbody = document.querySelector(tbodySelector);
  if (!tbody || !Array.isArray(records)) return;
  tbody.replaceChildren();
  records.forEach((record, index) => {
    const row = buildRow(record, index);
    if (row) tbody.appendChild(row);
  });
}
function formatWidgetCurrency(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? '$' + amount.toFixed(2) : '$0.00';
}
function formatWidgetDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}
`.trim();

export const WIDGET_BASE_CSS = `:root {
  color-scheme: light;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 16px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  color: #0f172a;
  background: #ffffff;
}
button, input, select, textarea {
  font: inherit;
}
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 0.5em;
}
.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.metric-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
input[type="range"] {
  width: 100%;
  accent-color: #2563eb;
}
`;
