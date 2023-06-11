import { getAuthType } from "../../../../entites/User";
import { ISession, ISessionResponse } from "../../models/session";

export const mapResponseSessionToSession = (data: ISessionResponse[]) => {
    let arr: ISession[] = []
    data.forEach((item)=>{
        arr.push({
            id: item.id,
            expires_at: new Date(item.expires_at),
            auth_type: getAuthType(item.auth_type)
        })
    })
    return arr
}