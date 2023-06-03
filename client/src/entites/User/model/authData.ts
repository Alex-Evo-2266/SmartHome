import { UserRole } from ".."

export interface LoginData{
    token: string
    expires_at: string
    id: number
    role?: string
}

export interface UserAuthData{
    token?: string,
	id?: number,
	role: UserRole,
	isAuthenticated: boolean,
	expires_at?: Date,
}

export type RefrashData = LoginData