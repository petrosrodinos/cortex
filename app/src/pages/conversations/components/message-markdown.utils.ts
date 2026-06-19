const OFFICE_EXTENSIONS = new Set(['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt']);

export function getFilePreviewUrl(url: string): string {
  try {
    const extension = new URL(url).pathname.split('.').pop()?.toLowerCase();
    if (extension && OFFICE_EXTENSIONS.has(extension)) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    }
  } catch {
    return url;
  }

  return url;
}

export function normalizeMarkdownTables(content: string): string {
  return content.replace(/\|\s+\|/g, '|\n|');
}

export function enrichMarkdownWithFileLinks(content: string, files: string[]): string {
  if (files.length === 0) {
    return content;
  }

  const fileUrl = files[0];

  return content.replace(/\[([^\]]+)\]\(\s*(?:#)?\s*\)/g, `[$1](${fileUrl})`);
}

export function prepareAssistantMarkdown(content: string, files: string[] = []): string {
  return normalizeMarkdownTables(enrichMarkdownWithFileLinks(content, files));
}
