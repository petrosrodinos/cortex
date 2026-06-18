import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';
import type { UpdatePasswordDto, UpdateUserDto } from '../interfaces/user.interface';
import { formatUserFullName } from '../utils/user.utils';
import { getCurrentUser, updateCurrentUser, updateCurrentUserPassword } from '../services/user.service';

export const currentUserQueryKey = ['currentUser'] as const;

export function useGetCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.update_user);

  return useMutation({
    mutationFn: (payload: UpdateUserDto) => updateCurrentUser(payload),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      updateUser({
        email: user.email,
        full_name: formatUserFullName(user),
      });
      toast({ title: 'Profile updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update profile', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateCurrentUserPassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordDto) => updateCurrentUserPassword(payload),
    onSuccess: () => {
      toast({ title: 'Password updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update password', description: error.message, variant: 'error' });
    },
  });
}
