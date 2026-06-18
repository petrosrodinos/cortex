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

export default function ProfilePage() {
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
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        phone: user.phone ?? '',
      });
    }
  }, [user, reset]);

  function onSubmit(data: UpdateProfileFormValues) {
    updateUser.mutate({
      email: data.email,
      phone: data.phone?.trim() ? data.phone.trim() : null,
    });
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading profile...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <p className="mt-0.5 text-xs text-muted">View and update your account information.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
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
            className="w-fit"
          >
            Save changes
          </ActionButtonWithPending>
        </Form>
      </div>
    </div>
  );
}
