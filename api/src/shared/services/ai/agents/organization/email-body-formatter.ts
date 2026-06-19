function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isTableRow(line: string) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isSeparatorRow(line: string) {
  return /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line);
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function markdownTableToHtml(lines: string[]) {
  const header = parseTableRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseTableRow);

  const headerHtml = header.map((cell) => `<th style="padding:8px 12px;border:1px solid #d0d7de;text-align:left;background:#f6f8fa;">${escapeHtml(cell)}</th>`).join('');
  const bodyHtml = bodyRows
    .map((row) => {
      const cells = row
        .map((cell) => `<td style="padding:8px 12px;border:1px solid #d0d7de;">${escapeHtml(cell)}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `<table style="border-collapse:collapse;width:100%;max-width:100%;font-family:Arial,sans-serif;font-size:14px;"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

function markdownTableToPlain(lines: string[]) {
  const rows = lines.filter((line) => !isSeparatorRow(line)).map(parseTableRow);
  const columnWidths = rows[0]?.map((_, columnIndex) =>
    Math.max(...rows.map((row) => (row[columnIndex] ?? '').length)),
  );

  return rows
    .map((row) =>
      row
        .map((cell, columnIndex) => cell.padEnd(columnWidths?.[columnIndex] ?? cell.length, ' '))
        .join('  '),
    )
    .join('\n');
}

export function formatEmailBody(body: string): { text: string; html: string } {
  const normalized = body.trim();
  if (!normalized) {
    return { text: '', html: '' };
  }

  const lines = normalized.split('\n');
  const htmlParts: string[] = [];
  const textParts: string[] = [];
  let index = 0;

  while (index < lines.length) {
    if (index + 1 < lines.length && isTableRow(lines[index]) && isSeparatorRow(lines[index + 1])) {
      const tableLines = [lines[index], lines[index + 1]];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }

      htmlParts.push(markdownTableToHtml(tableLines));
      textParts.push(markdownTableToPlain(tableLines));
      continue;
    }

    const line = lines[index];
    if (line.trim()) {
      htmlParts.push(`<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">${escapeHtml(line)}</p>`);
      textParts.push(line);
    }

    index += 1;
  }

  return {
    text: textParts.join('\n'),
    html: `<div style="color:#111827;">${htmlParts.join('')}</div>`,
  };
}
