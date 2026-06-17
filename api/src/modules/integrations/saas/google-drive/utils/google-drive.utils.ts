import { GoogleDriveActionResult } from '../interfaces/google-drive.interfaces';

export function extractData<T>(response: { data: T }): GoogleDriveActionResult<T> {
  return { success: true, data: response.data };
}

export function deletedResult(message: string): GoogleDriveActionResult<{ message: string }> {
  return { success: true, data: { message } };
}

export function escapeQuery(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
