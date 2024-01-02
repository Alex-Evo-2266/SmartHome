import { useCallback, useState } from "react"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { Divider, FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { Condition, TriggerData } from "../../../entites/Trigger"
import { TriggerEntitiesField } from "../../../features/TriggerEntityField"
import { TriggerConditionField } from "../../../features/TriggerConditionField"
import { TriggerActionField } from "../../../features/TriggerActionField/ui/TriggerActionField"
import { useAppTrigger } from "../api/apiTrigger"

interface TriggerFormProps{
	header?: string
    editData?: TriggerData
    update?: ()=>void
}

function setValueTrigger(editData?: TriggerData) {
    return {
        name: editData?.name ?? "",
        system_name: editData?.system_name ?? "",
        condition: editData?.condition ?? Condition.OR,
        status: !!editData?.status,
        conditions: editData?.conditions ?? [],
        entities: editData?.entities ?? [],
        actions: editData?.actions ?? [],
        differently: editData?.differently ?? []
    }
}

export const TriggerForm = ({header, editData, update}:TriggerFormProps) => {

    const dispatch = useAppDispatch()
    const {addTrigger, editTrigger} = useAppTrigger()
    const [trigger, setTrigger] = useState<TriggerData>(setValueTrigger(editData))

    const changeName = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(!trigger.system_name || trigger.system_name == trigger.name)
            setTrigger(prev=>({...prev, name: event.target.value, system_name: event.target.value}))
        setTrigger(prev=>({...prev, name: event.target.value}))
    }

    const changecCondition = (data: string) => {
        if(data === "and")
            setTrigger(prev=>({...prev, condition: Condition.AND}))
        else
            setTrigger(prev=>({...prev, condition: Condition.OR}))
    }

    const hide = () => {
		dispatch(hideFullScreenDialog())
	}

    const save = useCallback(async () => {
        if(!trigger.name || !trigger.system_name || trigger.entities.length < 1 || trigger.actions.length < 1)
            return
        if(editData)
            await editTrigger(trigger, editData.system_name)
        else
		    await addTrigger(trigger)
        hide()
        setTimeout(()=>{
            update && update()
        },500)
	},[addTrigger, trigger])

    return(
        <FullScrinTemplateDialog onHide={hide} onSave={save} header={header ?? "Trigger"}>
            <FieldContainer header="name">
                <TextField border value={trigger.name} onChange={(e)=>changeName(e)}/>
            </FieldContainer>
            <FieldContainer header="system name">
                <TextField border value={trigger.system_name} onChange={(e)=>setTrigger(prev=>({...prev, system_name: e.target.value}))}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="trigger">
                <TriggerEntitiesField onChange={(data)=>setTrigger(prev=>({...prev, entities: data}))} value={trigger.entities}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="condition">
                <SelectField items={[String(Condition.AND), String(Condition.OR)]} border value={trigger.condition} onChange={(data)=>changecCondition(data)}/>
                <TriggerConditionField onChange={(data)=>setTrigger(prev=>({...prev, conditions: data}))} value={trigger.conditions}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="then">
                <TriggerActionField onChange={(data)=>setTrigger(prev=>({...prev, actions: data}))} value={trigger.actions}/>
            </FieldContainer>
            <Divider/>
            <FieldContainer header="else">
                <TriggerActionField onChange={(data)=>setTrigger(prev=>({...prev, differently: data}))} value={trigger.differently}/>
            </FieldContainer>
            <Divider/>
            <hr/>
        </FullScrinTemplateDialog>
    )
}