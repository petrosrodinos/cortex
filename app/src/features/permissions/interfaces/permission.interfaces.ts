export interface Permission {
  id: number;
  uuid: string;
  key: string;
  label: string;
  group: string;
}

export interface PermissionsQuery {
  search?: string;
  page?: number;
  limit?: number;
}
