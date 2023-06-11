import { AuthType } from "../.."

export const getAuthType = (data?: string) => {
    let authType = AuthType.LOGIN
    if(data === "login" || data === AuthType.LOGIN)
        authType = AuthType.LOGIN
    if(data === "auth_service" || data === AuthType.AUTH_SERVICE)
        authType = AuthType.AUTH_SERVICE
    return authType
}