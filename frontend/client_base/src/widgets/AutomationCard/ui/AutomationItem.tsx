import { ListItem, Switch } from "alex-evo-sh-ui-kit"
import { Automation, useAutomationAPI } from "../../../entites/automation"
import { useCallback, useState } from "react"
import { AutomationEditor } from "./EditAutomation"
import { DialogPortal } from "../../../shared"
import './style.scss'

interface AutomationItemProps {
    automation: Automation
    updateData: ()=>Promise<void>
}


export const AutomationItem:React.FC<AutomationItemProps> = ({automation, updateData}) => {

    const {editAutomation, deleteAutomation, enableAutomation} = useAutomationAPI()
    const [editAutomationItem, setEditAutomationItem] = useState<boolean>(false)

    const deleteHandler = useCallback(async(name:string)=>{
        if(!name) return
        await deleteAutomation(name)
        setEditAutomationItem(false)
        setTimeout(updateData,200)
    },[deleteAutomation, updateData])
    
    const save =  useCallback(async(data: Automation)=>{
        if (automation){
            await editAutomation(automation.name, data)
            await updateData()
        }
    },[automation])

    const editStatus = useCallback(async (name: string, status?: boolean)=>{
        let newStatus = true
        if(status === undefined){
            newStatus = true
        }
        else{
            newStatus = !status
        }
        automation.is_enabled = newStatus
        await enableAutomation(name, newStatus)
        setTimeout(updateData,200)
    },[enableAutomation])

    return(
        <>
        <ListItem
            hovered
            onClick={()=>setEditAutomationItem(true)}
            header={automation.name}
            control={<Switch size='small' checked={automation.is_enabled} onChange={()=>editStatus(automation.name, automation.is_enabled)}/>}
        />
        {
            editAutomationItem &&
            <DialogPortal>
                <AutomationEditor 
                onHide={()=>setEditAutomationItem(false)} 
                automation={automation} 
                onSave={save}
                onDelete={deleteHandler}
                />
            </DialogPortal>
        }
        </>
    )
}