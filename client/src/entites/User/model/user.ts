
export enum UserRole{
    ADMIN = "ADMIN",
    BASE = "BASE",
    WITHOUT = "WITHOUT"
}

export enum AuthType{
    LOGIN = "LOGIN",
    AUTH_SERVICE = "AUTH_SERVICE"
}

export interface UserData{
    name?: string
    email?: string
    id?: number
    imageUrl?: string
    host?: string
    authType?: AuthType
    authName?: string
}

export interface UserDataResponse{
    name?: string
    email?: string
    id?: number
    image_url?: string
    host?: string
    auth_type?: string
    auth_name: string
}

export interface UpdateUserData{
    name: string
    email: string
}