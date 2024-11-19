
export interface LoginData{
    token: string
    expires_at: string
    id: string
    role: string
}

export type LoginRequestData = {
    name: string,
    password: string
}

export interface UserAuthData{
    token?: string,
	id?: string,
	role: string,
	isAuthenticated: boolean,
	expires_at?: Date,
}

export type RefrashData = LoginData