import type { LoggedInUser } from "@/features/user/interfaces/user.interface";
import { Routes } from "@/routes/routes";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserStore extends LoggedInUser {
    login(user: any): void;
    logout(): void;
    update_user(user: any): void;
}

const initialValues: UserStore = {
    isLoggedIn: false,
    user_uuid: null,
    role: null,
    full_name: "",
    email: null,
    access_token: null,
    expires_in: null,
    avatar: null,
    organization_uuid: null,
    organization_role: null,
    organization_permissions: [],
    login: () => { },
    logout: () => { },
    update_user: () => { },
};

const STORE_KEY = "auth";

export const useAuthStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialValues,
                login: (user: LoggedInUser) => {
                    set((state) => ({
                        ...state,
                        ...user,
                    }));
                },
                logout: () => {
                    set(initialValues);
                    localStorage.removeItem(STORE_KEY);
                    window.location.href = Routes.auth.sign_in;
                },
                update_user: async (user: Partial<LoggedInUser>) => {
                    set((state) => ({ ...state, ...user }));
                },
            }),
            {
                name: STORE_KEY,
            }
        )
    )
);

export const getAuthStoreState = () => useAuthStore.getState();
