
export interface SignInUser {
    email: string;
    password: string;
}

export interface SignUpUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface RegisterInvitationUser {
    invitation_token: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface InvitationDetails {
    email: string;
    organization_uuid: string;
    organization_name: string;
}

