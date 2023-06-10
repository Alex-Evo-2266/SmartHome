import { AuthType, UserData, UserDataResponse, UserRole } from "../../model/user";


export const mapUserData = (data:UserDataResponse):UserData => {
    let authType = AuthType.LOGIN
    if(data.auth_type === "login" || data.auth_type === AuthType.LOGIN)
        authType = AuthType.LOGIN
    if(data.auth_type === "auth_service" || data.auth_type === AuthType.AUTH_SERVICE)
        authType = AuthType.AUTH_SERVICE

    let newRole: UserRole = UserRole.WITHOUT
	if(data.role === UserRole.ADMIN || data.role === "admin")
		newRole = UserRole.ADMIN
    else if(data.role === UserRole.BASE || data.role === "base")
		newRole = UserRole.BASE

    return{
        name: data.name,
        email: data.email,
        id: data.id,
        imageUrl: data.image_url,
        host: data.host,
        authType: authType,
        authName: data.auth_name,
        role: newRole
    }
}