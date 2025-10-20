import { BaseButton, Button, IconButton, ListItem, Play, Switch } from "alex-evo-sh-ui-kit"
import { useCallback } from "react"
import { Script, useScriptAPI } from "../../../entites/script"
import { useNavigate } from 'react-router-dom';

interface ScriptItemProps {
    script: Script
    updateData: ()=>Promise<void>
}


export const ScriptItem:React.FC<ScriptItemProps> = ({script, updateData}) => {

    const {editStatus: es, deleteScript, runScript} = useScriptAPI()
    const navigate = useNavigate()

    const deleteHandler = useCallback(async(name:string)=>{
        if(!name) return
        await deleteScript(name)
        setTimeout(updateData,200)
    },[deleteScript, updateData])

    const editStatus = useCallback(async (id: string, status?: boolean)=>{
        let newStatus = true
        if(status === undefined){
            newStatus = true
        }
        else{
            newStatus = !status
        }
        script.is_active = newStatus
        await es(id, newStatus)
        setTimeout(updateData,200)
    },[es])

    const editScript = (id: string) => {
        navigate(`/script/constructor/${id}`)
    }

    return(
        <>
        <ListItem
            hovered
            onClick={()=>editScript(script.id)}
            header={script.name}
            control={
                <div>
                    <IconButton icon={<Play/>} onClick={()=>runScript(script.id)}></IconButton>
                    <Switch size='small' checked={script.is_active} onChange={()=>editStatus(script.id, script.is_active)}/>
                </div>
            }
            text={`name: ${script.name}`}
        />
        </>
    )
}