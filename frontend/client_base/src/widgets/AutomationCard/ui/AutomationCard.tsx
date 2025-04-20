import { BaseActionCard, BaseDialog, Button, Card, IconButton, ListContainer, ListItem, Trash } from "alex-evo-sh-ui-kit"
import { Automation, ConditionType, useAutomationAPI } from "../../../entites/automation"
import { useCallback, useEffect, useState } from "react"
import { AutomationEditor } from "./EditAutomation"
import { DialogPortal } from "../../../shared"
import './style.scss'


export const AutomationCard = () => {

    const {getAutomationAll, editAutomation, addAutomation, deleteAutomation} = useAutomationAPI()
    const [automation, setAutomation] = useState<Automation[]>([])
    const [editAutomationItem, setEditAutomationItem] = useState<Automation | null>(null)
    const [addAutomationItem, setAddAutomationItem] = useState<boolean>(false)
    const [deleteAutomationDialog, setDeleteAutomationDialog] = useState<string | null>(null)

    const getData = useCallback(async()=>{
        const data = await getAutomationAll()
        setAutomation(data)
    },[getAutomationAll])

    useEffect(()=>{
        getData()
    },[getData])

    const deleteHandler = useCallback(async()=>{
        if(!deleteAutomationDialog) return
        await deleteAutomation(deleteAutomationDialog)
        setTimeout(getData,200)
    },[deleteAutomation, deleteAutomationDialog, getData])
    
    const save =  useCallback(async(data: Automation)=>{
        if (editAutomationItem){
            await editAutomation(editAutomationItem.name, data)
            await getData()
        }
    },[editAutomationItem])

    const addAutomationHandler =  useCallback(async(data: Automation)=>{
        if (addAutomationItem){
            await addAutomation(data)
            await getData()
        }
    },[addAutomationItem])

    return(
        <>
        <Card header="Automation">
            <ListContainer transparent>
            {
                automation && automation.map((item, index)=>(
                    <ListItem
                        hovered
                        key={index}
                        onClick={()=>setEditAutomationItem(item)}
                        header={item.name}
                        control={<IconButton icon={<Trash/>} onClick={()=>setDeleteAutomationDialog(item.name)}/>}
                    />
                ))
            }
            </ListContainer>
            
            <BaseActionCard>
                <Button onClick={()=>setAddAutomationItem(true)}>
                    add automation
                </Button>
            </BaseActionCard>
        </Card>
        {
            deleteAutomationDialog &&
            <DialogPortal>
                <BaseDialog 
                    header="delete automation" 
                    text={`are you sure you want to remove automation ${deleteAutomationDialog}`} 
                    onHide={()=>setDeleteAutomationDialog(null)}
                    onCancel={()=>setDeleteAutomationDialog(null)}
                    onSuccess={deleteHandler}
                    />
            </DialogPortal>
        }
        {
            editAutomationItem &&
            <DialogPortal>
                <AutomationEditor onHide={()=>setEditAutomationItem(null)} automation={editAutomationItem} onSave={save}/>
            </DialogPortal>
        }
        {
            addAutomationItem &&
            <DialogPortal>
                <AutomationEditor 
                    onHide={()=>setAddAutomationItem(false)} 
                    automation={{condition:[], trigger: [], then: [], else_branch:[], name:"", condition_type:ConditionType.AND}} 
                    onSave={addAutomationHandler}
                />
            </DialogPortal>
        }
        </>
    )
}