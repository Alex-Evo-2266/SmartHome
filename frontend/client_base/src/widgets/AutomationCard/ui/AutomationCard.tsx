import { BaseActionCard, Button, Card, ListContainer, ListItem, Switch } from "alex-evo-sh-ui-kit"
import { Automation, ConditionType, useAutomationAPI } from "../../../entites/automation"
import { useCallback, useEffect, useState } from "react"
import { AutomationEditor } from "./EditAutomation"
import { DialogPortal } from "../../../shared"
import './style.scss'
import { AutomationItem } from "./AutomationItem"


export const AutomationCard = () => {

    const {getAutomationAll, addAutomation} = useAutomationAPI()
    const [automation, setAutomation] = useState<Automation[]>([])
    const [addAutomationItem, setAddAutomationItem] = useState<boolean>(false)

    const getData = useCallback(async()=>{
        const data = await getAutomationAll()
        setAutomation(data)
    },[getAutomationAll])

    useEffect(()=>{
        getData()
    },[getData])

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
                    <AutomationItem updateData={getData} automation={item} key={index}/>
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