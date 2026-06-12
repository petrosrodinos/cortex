import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { DeleteMemberDto, InviteMemberDto, OrganizationMembersQuery, UpdateMemberDto } from '../interfaces/member.interfaces';
import { deleteMember, getMembers, inviteMember, updateMember } from '../services/members.services';

export const membersQueryKey = ['members'] as const;

export function useGetMembers(organization_uuid?: string, query?: OrganizationMembersQuery) {
  return useQuery({
    queryKey: [...membersQueryKey, organization_uuid, query],
    queryFn: () => getMembers(organization_uuid!, query),
    enabled: !!organization_uuid,
  });
}

export function useInviteMember(organization_uuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteMemberDto) => inviteMember(organization_uuid!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast({ title: 'Member invited', description: 'The invitation was sent.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not invite member', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useUpdateMember(organization_uuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_member_uuid, payload }: { organization_member_uuid: string; payload: UpdateMemberDto }) =>
      updateMember(organization_uuid!, organization_member_uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast({ title: 'Member updated', description: 'The member changes were saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update member', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organization_uuid, organization_member_uuid }: DeleteMemberDto) => deleteMember(organization_uuid, organization_member_uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast({ title: 'Member removed', description: 'The member was removed from the organization.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove member', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
