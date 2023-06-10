import { AuthType, UserData, UserDataResponse } from "../../model/user";


export const mapUserData = (data:UserDataResponse):UserData => {
    let authType = AuthType.LOGIN
    if(data.auth_type === "login" || data.auth_type === AuthType.LOGIN)
        authType = AuthType.LOGIN
    if(data.auth_type === "auth_service" || data.auth_type === AuthType.AUTH_SERVICE)
        authType = AuthType.AUTH_SERVICE

    return{
        name: data.name,
        email: data.email,
        id: data.id,
        imageUrl: data.image_url,
        host: data.host,
        authType: authType,
        authName: data.auth_name,
    }
}