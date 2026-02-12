
export type Privileges = {
    id: string
    privilege: string
}

export type Role = {
    id: string
    role_name: string
    privileges: Privileges[]
}

export type MeData = {
    user_name: string;
    user_id: string;
    role: Role
}