import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { TypeRequest } from "../../../shared/api/type"

export const logoutInSession = async(token: string) => {
    try{
        await requestWithRefrash(
            "/api/auth/logout", 
            TypeRequest.GET, 
            null, 
            token, 
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