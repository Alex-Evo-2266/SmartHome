export interface UserForm {
name: string;
password: string;
email: string;
}


export interface UserSchema {
id: string;
name: string;
email?: string | null;
role: string;
image_url?: string | null;
host?: string | null;
}


export interface UserEditSchema {
name: string;
email?: string;
}


export interface UserEditLevelSchema {
id: string;
role: string;
}


export interface UserEditPasswordSchema {
old_password: string;
new_password: string;
}

export interface UsersDataSchema {
users: UserSchema[]
}

export interface CreateRole {
role_name: string
}

export interface Privilege {
    id: string
    privilege: string
}

export interface Role {
    id: string
    role_name: string
    privileges: Privilege[]
}

export interface RoleList {
    roles: Role[]
}

export interface PrivilegeForm{
    privilege: string
}

export interface EditPrivilegeRoleForm{
    role_name: string
    privileges: PrivilegeForm[]
}

export interface PrivilegeSchemaList{
    privileges: Privilege[]
}
export interface Session {
  id: string;
  service: string;
  host: string
  expires_at: Date
}

export interface SessionResp {
    sessions: Session[]
}
