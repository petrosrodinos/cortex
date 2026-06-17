import { NotionActionResult } from '../interfaces/notion.interfaces';

export function wrapResult<T>(data: T): NotionActionResult<T> {
  return { success: true, data };
}

export function buildTitleProperty(title: string): Record<string, any> {
  return {
    title: [{ text: { content: title } }],
  };
}

export function buildRichText(content: string): any[] {
  return [{ text: { content } }];
}
