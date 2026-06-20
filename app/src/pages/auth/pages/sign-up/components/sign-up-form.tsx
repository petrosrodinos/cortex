import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Form, Label, Input, FieldError } from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
  InvitationSignUpSchema,
  SignUpSchema,
  type InvitationSignUpFormValues,
  type SignUpFormValues,
} from "../../../validation-schemas/auth";
import { useGetInvitationDetails, useRegisterInvitation, useSignup } from "@/features/auth/hooks/use-auth";

export function SignUpForm() {
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("invitation_token") ?? undefined;
  const invitationQuery = useGetInvitationDetails(invitationToken);
  const signupMutation = useSignup();
  const registerInvitationMutation = useRegisterInvitation();
  const isInvitationFlow = Boolean(invitationToken);
  const isPending = signupMutation.isPending || registerInvitationMutation.isPending || invitationQuery.isLoading;
  const [showPassword, setShowPassword] = useState(false);

  const standardForm = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "" },
  });

  const invitationForm = useForm<InvitationSignUpFormValues>({
    resolver: zodResolver(InvitationSignUpSchema),
    defaultValues: { first_name: "", last_name: "", password: "" },
  });

  if (isInvitationFlow && invitationQuery.isError) {
    return (
      <div className="text-left text-sm text-danger">
        {invitationQuery.error?.message ?? "This invitation link is invalid or has expired."}
      </div>
    );
  }

  if (isInvitationFlow) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = invitationForm;

    function onSubmitInvitation(data: InvitationSignUpFormValues) {
      if (!invitationToken) return;
      registerInvitationMutation.mutate({
        invitation_token: invitationToken,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        password: data.password,
      });
    }

    return (
      <Form onSubmit={handleSubmit(onSubmitInvitation)} className="grid gap-4 text-left">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="signup-first-name">First name</Label>
            <Input
              id="signup-first-name"
              {...register("first_name")}
              placeholder="John"
              fullWidth
            />
            {errors.first_name && <FieldError>{errors.first_name.message}</FieldError>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="signup-last-name">Last name</Label>
            <Input
              id="signup-last-name"
              {...register("last_name")}
              placeholder="Doe"
              fullWidth
            />
            {errors.last_name && <FieldError>{errors.last_name.message}</FieldError>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            value={invitationQuery.data?.email ?? ""}
            type="email"
            fullWidth
            disabled
            readOnly
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              fullWidth
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-default"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </div>

        <ActionButtonWithPending
          type="submit"
          isDisabled={isPending || !invitationQuery.data}
          isPending={isPending}
          fullWidth
          className="mt-2"
        >
          Accept invitation
        </ActionButtonWithPending>
      </Form>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = standardForm;

  function onSubmit(data: SignUpFormValues) {
    signupMutation.mutate({
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email,
      password: data.password,
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-left">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="signup-first-name">First name</Label>
          <Input
            id="signup-first-name"
            {...register("first_name")}
            placeholder="John"
            fullWidth
          />
          {errors.first_name && <FieldError>{errors.first_name.message}</FieldError>}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="signup-last-name">Last name</Label>
          <Input
            id="signup-last-name"
            {...register("last_name")}
            placeholder="Doe"
            fullWidth
          />
          {errors.last_name && <FieldError>{errors.last_name.message}</FieldError>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          {...register("email")}
          placeholder="name@example.com"
          type="email"
          fullWidth
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            fullWidth
            className="pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-default"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </div>

      <ActionButtonWithPending
        type="submit"
        isDisabled={isPending}
        isPending={isPending}
        fullWidth
        className="mt-2"
      >
        Create Account
      </ActionButtonWithPending>
    </Form>
  );
}
