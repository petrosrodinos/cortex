
export interface SignInUser {
    email: string;
    password: string;
}

export interface SignUpUser {
    email: string;
    password: string;
}

export interface RegisterInvitationUser {
    invitation_token: string;
    password: string;
}

export interface InvitationDetails {
    email: string;
    organization_uuid: string;
    organization_name: string;
}

