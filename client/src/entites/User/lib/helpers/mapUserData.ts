import { UserData, UserDataResponse } from "../../model/user";
import { getAuthType } from "./getAuthType";
import { getRole } from "./getRole";


export const mapUserData = (data:UserDataResponse):UserData => {

    return{
        name: data.name,
        email: data.email,
        id: data.id,
        imageUrl: data.image_url,
        host: data.host,
        authType: getAuthType(data.auth_type),
        authName: data.auth_name,
        role: getRole(data.role)
    }
}