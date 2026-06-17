import { GitHubActionResult } from '../interfaces/github.interfaces';

export function extractData<T>(response: { data: T }): GitHubActionResult<T> {
  return { success: true, data: response.data };
}

export function deletedResult(message: string): GitHubActionResult<{ message: string }> {
  return { success: true, data: { message } };
}

export function encodeBase64(content: string): string {
  return Buffer.from(content).toString('base64');
}
