import { adminLoginToAccount, getInvitationDetails, refreshAccountToken, registerFromInvitation, signIn, signUp } from "../services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import type { SignInUser, SignUpUser, RegisterInvitationUser } from "../interfaces/auth.interface";
import { Routes } from "@/routes/routes";
import type { LoggedInUser } from "@/features/user/interfaces/user.interface";
import { toast } from "@/hooks/use-toast";


export function useSignin() {
    const { login } = useAuthStore((state) => state);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: SignInUser) => signIn(data),
        onSuccess: (data: LoggedInUser) => {
            login({
                ...data,
                isLoggedIn: true,
            });
            toast({
                title: "Login successful",
                description: "You have successfully logged in",
                duration: 2000,
            });
            navigate(Routes.dashboard.root);
        },
        onError: (error: any) => {
            toast({
                title: "Could not sign in",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
}


export function useSignup() {
    const { login } = useAuthStore((state) => state);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: SignUpUser) => signUp(data),
        onSuccess: (data) => {
            login({
                ...data,
                isLoggedIn: true,
            });
            toast({
                title: "Register successful",
                description: "You have successfully registered in",
                duration: 2000,
            });
            navigate(Routes.dashboard.root);
        },
        onError: (error) => {
            toast({
                title: "Could not sign up",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
}

export function useGetInvitationDetails(invitation_token?: string) {
    return useQuery({
        queryKey: ["invitation", invitation_token],
        queryFn: () => getInvitationDetails(invitation_token as string),
        enabled: !!invitation_token,
        retry: false,
    });
}

export function useRegisterInvitation() {
    const { login } = useAuthStore((state) => state);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: RegisterInvitationUser) => registerFromInvitation(data),
        onSuccess: (data) => {
            login({
                ...data,
                isLoggedIn: true,
            });
            toast({
                title: "Account created",
                description: "Your invitation has been accepted",
                duration: 2000,
            });
            navigate(Routes.dashboard.root);
        },
        onError: (error) => {
            toast({
                title: "Could not complete invitation",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
}


export function useRefreshAccountToken() {
    const { login } = useAuthStore((state) => state);
    return useMutation({
        mutationFn: () => refreshAccountToken(),
        onSuccess: (data: LoggedInUser) => {
            login({ ...data, isLoggedIn: true });
        },
    });
}

export function useAdminLoginToAccount() {
    const { login } = useAuthStore((state) => state);

    return useMutation({
        mutationFn: (account_uuid: string) => adminLoginToAccount(account_uuid),
        onSuccess: (data: LoggedInUser) => {
            toast({
                title: "Admin login successful",
                description: "You have successfully logged in as admin",
                duration: 2000,
            });
            login({
                ...data,
                isLoggedIn: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not admin login to account",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
}