import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateRoleDto, DeleteRoleDto, OrganizationRolesQuery, SetRolePermissionsDto, UpdateRoleDto } from '../interfaces/role.interfaces';
import { createRole, deleteRole, getRoles, setRolePermissions, updateRole } from '../services/roles.services';

export const rolesQueryKey = ['roles'] as const;

export function useGetRoles(organization_uuid?: string, query?: OrganizationRolesQuery) {
  return useQuery({
    queryKey: [...rolesQueryKey, organization_uuid, query],
    queryFn: () => getRoles(organization_uuid!, query),
    enabled: !!organization_uuid,
  });
}

export function useCreateRole(organization_uuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleDto) => createRole(organization_uuid!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      toast({ title: 'Role created', description: 'The role is ready to use.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create role', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useUpdateRole(organization_uuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_role_uuid, payload }: { organization_role_uuid: string; payload: UpdateRoleDto }) =>
      updateRole(organization_uuid!, organization_role_uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      toast({ title: 'Role updated', description: 'The role changes were saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update role', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useSetRolePermissions(organization_uuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_role_uuid, permission_keys }: { organization_role_uuid: string } & SetRolePermissionsDto) =>
      setRolePermissions(organization_uuid!, organization_role_uuid, { permission_keys: permission_keys }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      toast({ title: 'Permissions updated', description: 'Role permissions were saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update permissions', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid, organization_role_uuid }: DeleteRoleDto) => deleteRole(organization_uuid, organization_role_uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesQueryKey });
      toast({ title: 'Role deleted', description: 'The role was removed.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete role', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
