import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../../../shared/lib/hooks/snackbar.hook"
import { requestWithRefrash } from "../../../../../shared/api/baseAPI"
import { TypeRequest } from "../../../../../shared/api/type"
import { Script } from "../../../../../entites/Script"
import { LoginData, login, logout } from "../../../../../entites/User"
import { hideDialog, showDialog } from "../../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from 'alex-evo-sh-ui-kit'


export const useAutomationActionScript = () => {

    const dispatch = useAppDispatch()
    const auth = useAppSelector(state=>state.auth)
    const {showSnackbar} = useSnackbar()

    const requestError = useCallback((error: string) => {
		showSnackbar(error, {}, 10000)
	},[showSnackbar])

    const getScripts = useCallback(async() => {
        try{
            const data:Script[] = await requestWithRefrash(
                "/api/scripts", 
                TypeRequest.GET, 
                null, 
                auth.token, 
                {}, 
                ()=>dispatch(logout()),
                (data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
            )
            return data
        }
        catch(e){
            if(typeof e === "string")
                requestError(e)
            else if(e instanceof Error)
                requestError(e.message)
        }
    },[requestError, dispatch, auth.token])

    const getItems = (scripts: Script[])=>scripts.map((data)=>({title: data.name, data: data}))
    
    const automationActionScriptDialog = useCallback(async(callback: (data:Script)=>void) => {
        const scripts = await getScripts()
        if (!scripts)
            return
        dispatch(showDialog(<SelectionDialog header="selection scripts" items={getItems(scripts)} onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
            callback(data)
        }}/>))
    },[getScripts])

    return {getScripts, automationActionScriptDialog}
}