import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, Form, Input, Label } from '@heroui/react';
import { ActionButtonWithPending } from '@/components/ui/action-button-with-pending';
import { useUpdateCurrentUserPassword } from '@/features/user/hooks/use-user';
import {
  UpdatePasswordSchema,
  type UpdatePasswordFormValues,
} from '@/features/user/validation-schemas/user.schema';

export function ProfilePasswordForm() {
  const updatePassword = useUpdateCurrentUserPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  function onSubmit(data: UpdatePasswordFormValues) {
    updatePassword.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            fullWidth
            placeholder="Enter current password"
            {...register('current_password')}
          />
          {errors.current_password && <FieldError>{errors.current_password.message}</FieldError>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            fullWidth
            placeholder="Enter new password"
            {...register('new_password')}
          />
          {errors.new_password && <FieldError>{errors.new_password.message}</FieldError>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            fullWidth
            placeholder="Confirm new password"
            {...register('confirm_password')}
          />
          {errors.confirm_password && <FieldError>{errors.confirm_password.message}</FieldError>}
        </div>

        <ActionButtonWithPending
          type="submit"
          isDisabled={updatePassword.isPending}
          isPending={updatePassword.isPending}
          className="w-full sm:w-fit"
        >
          Update password
        </ActionButtonWithPending>
      </Form>
    </div>
  );
}
