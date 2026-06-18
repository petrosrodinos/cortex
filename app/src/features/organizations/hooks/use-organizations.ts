import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type {
  CreateOrganizationDto,
  DeleteOrganizationDto,
  OrganizationsQuery,
  SwitchOrganizationDto,
  UpdateOrganizationDto,
} from '../interfaces/organization.interfaces';
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  removeOrganizationLogo,
  switchOrganization,
  updateOrganization,
  uploadOrganizationLogo,
} from '../services/organizations.services';

export const organizationsQueryKey = ['organizations'] as const;

export function useGetOrganizations(query?: OrganizationsQuery) {
  return useQuery({
    queryKey: [...organizationsQueryKey, query],
    queryFn: () => getOrganizations(query),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationDto) => createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast({ title: 'Organization created', description: 'The organization is ready.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create organization', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid, payload }: { organization_uuid: string; payload: UpdateOrganizationDto }) =>
      updateOrganization(organization_uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast({ title: 'Organization updated', description: 'The organization changes were saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update organization', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid }: DeleteOrganizationDto) => deleteOrganization(organization_uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast({ title: 'Organization deleted', description: 'The organization was removed.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete organization', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useSwitchOrganization() {
  return useMutation({
    mutationFn: ({ organization_uuid }: SwitchOrganizationDto) => switchOrganization(organization_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not switch organization', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useUploadOrganizationLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid, file }: { organization_uuid: string; file: File }) =>
      uploadOrganizationLogo(organization_uuid, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast({ title: 'Logo updated', description: 'The organisation logo was saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update logo', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useRemoveOrganizationLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid }: { organization_uuid: string }) => removeOrganizationLogo(organization_uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast({ title: 'Logo removed', description: 'The organisation logo was cleared.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove logo', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
