import { Automation, AutomationStep, useAutomationAPI } from "@src/entites/automation_v4";
import { AutomationEditor } from "@src/widgets/Automation_v4/ui/AutomationEditor";
import { useCallback, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


export function AutomationEditorPage() {

    const { id } = useParams<{id: string}>();
    const {getAutomation} = useAutomationAPI()
    const [automation, setAutomation] = useState<null | Automation>(null)

    const load = useCallback(async()=>{
        if(!id) return
        const automationData = await getAutomation(id)
        setAutomation(automationData)
    },[id, getAutomation])

    useEffect(()=>{
        load()
    },[load])

    useEffect(()=>{
        console.log(automation)
    },[automation])

    if(!automation)
        return null

    return(
        <AutomationEditor automation={automation} onChange={setAutomation} onSave={()=>{}}/>
    )
}