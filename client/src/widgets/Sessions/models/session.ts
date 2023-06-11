import { AuthType } from "../../../entites/User";

export interface ISessionResponse{
    auth_type: string
    expires_at: string
    id: number
}

export interface ISession{
    auth_type: AuthType
    expires_at: Date
    id: number
}