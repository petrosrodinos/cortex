import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, Form, Input, Label } from '@heroui/react';
import { ActionButtonWithPending } from '@/components/ui/action-button-with-pending';
import { useGetCurrentUser, useUpdateCurrentUser } from '@/features/user/hooks/use-user';
import {
  UpdateProfileSchema,
  type UpdateProfileFormValues,
} from '@/features/user/validation-schemas/user.schema';

export function ProfileAccountForm() {
  const { data: user, isLoading } = useGetCurrentUser();
  const updateUser = useUpdateCurrentUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        phone: user.phone ?? '',
      });
    }
  }, [user, reset]);

  function onSubmit(data: UpdateProfileFormValues) {
    updateUser.mutate({
      first_name: data.first_name?.trim() ? data.first_name.trim() : null,
      last_name: data.last_name?.trim() ? data.last_name.trim() : null,
      email: data.email,
      phone: data.phone?.trim() ? data.phone.trim() : null,
    });
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading profile...</p>;
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-first-name">First name</Label>
            <Input id="profile-first-name" fullWidth placeholder="John" {...register('first_name')} />
            {errors.first_name && <FieldError>{errors.first_name.message}</FieldError>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="profile-last-name">Last name</Label>
            <Input id="profile-last-name" fullWidth placeholder="Doe" {...register('last_name')} />
            {errors.last_name && <FieldError>{errors.last_name.message}</FieldError>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" fullWidth {...register('email')} />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input id="profile-phone" type="tel" fullWidth placeholder="+1234567890" {...register('phone')} />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </div>

        <ActionButtonWithPending
          type="submit"
          isDisabled={!isDirty || updateUser.isPending}
          isPending={updateUser.isPending}
          className="w-full sm:w-fit"
        >
          Save changes
        </ActionButtonWithPending>
      </Form>
    </div>
  );
}
