import { HubSpotActionResult } from '../interfaces/hubspot.interfaces';

export function wrapResult<T>(data: T): HubSpotActionResult<T> {
  return { success: true, data };
}

export function deletedResult(message: string): HubSpotActionResult<{ message: string }> {
  return { success: true, data: { message } };
}

export function buildSearchRequest(query: string, limit: number) {
  return { query, limit, sorts: [], filterGroups: [], properties: [] };
}
