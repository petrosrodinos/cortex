export function stripWidgetHtmlCodeFences(value: string): string {
  const fenceMatch = value.match(/^```(?:html)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : value;
}

export function extractWidgetHtmlDocument(value: string): string | null {
  const doctypeIndex = value.search(/<!DOCTYPE html>/i);
  if (doctypeIndex === -1) {
    return null;
  }

  const closingIndex = value.lastIndexOf('</html>');
  if (closingIndex === -1) {
    return null;
  }

  return value.slice(doctypeIndex, closingIndex + '</html>'.length).trim();
}

export function normalizeWidgetHtmlResponse(raw: string): string | null {
  const stripped = stripWidgetHtmlCodeFences(raw.trim());
  const extracted = extractWidgetHtmlDocument(stripped);
  if (!extracted) {
    return null;
  }

  const lower = extracted.toLowerCase();
  if (!lower.startsWith('<!doctype html>') || !lower.endsWith('</html>')) {
    return null;
  }

  return extracted;
}
