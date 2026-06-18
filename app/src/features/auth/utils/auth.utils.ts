import type { LoggedInUser } from "@/features/user/interfaces/user.interface";
import { formatUserFullName } from "@/features/user/utils/user.utils";

export const generateInitials = (value: string) => {
    if (!value) return "AN";
    const names = value.split(" ");
    const initials = names.map((name) => name[0]).join("").toUpperCase();
    return initials;
};

export const formatAuthUser = (data: any): LoggedInUser => {
    return {
        user_uuid: data.user.uuid,
        email: data.user.email,
        access_token: data.access_token,
        expires_in: data.expires_in,
        avatar: data?.user?.avatar?.url ?? null,
        full_name: formatUserFullName(data.user),
        role: data?.user?.role ?? null,
        organization_uuid: data?.organization_uuid ?? null,
        organization_role: data?.organization_role ?? null,
        organization_permissions: data?.organization_permissions ?? [],
    };
};
