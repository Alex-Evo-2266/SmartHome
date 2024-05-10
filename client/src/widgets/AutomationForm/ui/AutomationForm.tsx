import { useCallback, useState } from "react"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { Divider, FieldContainer, FullScrinTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import { Condition, AutomationData } from "../../../entites/Automation"
import { AutomationEntitiesField } from "../../../features/Automation"
import { AutomationConditionField } from "../../../features/Automation"
import { AutomationActionField } from "../../../features/Automation"
import { useAppAutomation } from "../api/apiAutomation"
import { SelectField } from "../../../shared/ui"

interface AutomationFormProps{
	header?: string
    editData?: AutomationData
    update?: ()=>void
}

function setValueAutomation(editData?: AutomationData) {
    return {
        name: editData?.name ?? "",
        system_name: editData?.system_name ?? "",
        condition: editData?.condition ?? Condition.OR,
        status: !!editData?.status,
        conditions: editData?.conditions ?? [],
        triggers: editData?.triggers ?? [],
        actions: editData?.actions ?? [],
        differently: editData?.differently ?? []
    }
}

export const AutomationForm = ({header, editData, update}:AutomationFormProps) => {

    const dispatch = useAppDispatch()
    const {addAutomation, editAutomation} = useAppAutomation()
    const [automation, setAutomation] = useState<AutomationData>(setValueAutomation(editData))

    const changeName = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(!automation.system_name || automation.system_name == automation.name)
            setAutomation(prev=>({...prev, name: event.target.value, system_name: event.target.value}))
        setAutomation(prev=>({...prev, name: event.target.value}))
    }

    const changecCondition = (data: string) => {
        if(data === "and")
            setAutomation(prev=>({...prev, condition: Condition.AND}))
        else
            setAutomation(prev=>({...prev, condition: Condition.OR}))
    }

    const hide = () => {
		dispatch(hideFullScreenDialog())
	}

    const save = useCallback(async () => {
        if(!automation.name || !automation.system_name || automation.triggers.length < 1 || automation.actions.length < 1)
            return
        if(editData)
            await editAutomation(automation, editData.system_name)
        else
		    await addAutomation(automation)
        hide()
        setTimeout(()=>{
            update && update()
        },500)
	},[addAutomation, automation])

    return(
        <FullScrinTemplateDialog onHide={hide} onSave={save} header={header ?? "Automation"}>
            <FieldContainer header="name">
                <TextField border value={automation.name} onChange={(e)=>changeName(e)}/>
            </FieldContainer>
            <FieldContainer header="system name">
                <TextField border value={automation.system_name} onChange={(e)=>setAutomation(prev=>({...prev, system_name: e.target.value}))}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="triggers">
                <AutomationEntitiesField onChange={(data)=>setAutomation(prev=>({...prev, triggers: data}))} value={automation.triggers}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="condition">
                <SelectField items={[String(Condition.AND), String(Condition.OR)]} border value={automation.condition} onChange={(data)=>changecCondition(data)}/>
                <AutomationConditionField onChange={(data)=>setAutomation(prev=>({...prev, conditions: data}))} value={automation.conditions}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="then">
                <AutomationActionField onChange={(data)=>setAutomation(prev=>({...prev, actions: data}))} value={automation.actions}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="else">
                <AutomationActionField onChange={(data)=>setAutomation(prev=>({...prev, differently: data}))} value={automation.differently}/>
            </FieldContainer>
            <Divider/>
            <hr/>
        </FullScrinTemplateDialog>
    )
}