import { baseAPI } from "./baseAPI"
import { TypeRequest } from "./type"

export const logoutInSession = async() => {
    try{
        await baseAPI(
            "/api-auth/sso/logout", 
            TypeRequest.GET, 
            null, 
            {}
        )
    }
    catch(e){
        if(typeof e === "string")
            console.error("error logout: ", e)
        else if(e instanceof Error)
            console.error("error logout: ", e.message)
    }
}