
export enum UserRole{
    ADMIN = "ADMIN",
    BASE = "BASE",
    WITHOUT = "WITHOUT"
}

export interface UserData{
    name?: string
    email?: string
    token?: string
    id?: number
    role: UserRole
    imageUrl?: string
    host?: string
}
