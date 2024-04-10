import { useCallback, useEffect, useState } from "react"
import { logic, mathFunction, signCondition, signMath } from "../models/reservedWords"
import { IDictFormatTextInfo } from "../../../../shared/model/FormatText"
import { useAppDispatch, useAppSelector } from "../../../../shared/lib/hooks/redux"
import { TypeEntityAction } from "../../../../entites/Automation/models/AutomationData"
import { FilledButton, FormatText, FullScrinTemplateDialog } from "../../../../shared/ui"
import { hideFullScreenDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { useAutomationAction } from "../.."
import { TextArea } from "../../../../shared/ui/TextField/TextArea"

interface EditActionBlockDialogProp{
    onSave: (data: string)=>void
    data: string
}

export const EditActionBlockDialog = ({onSave, data}:EditActionBlockDialogProp) => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)
    const [value, setValue] = useState<string>(data || "")
    const {addValue} = useAutomationAction()

    const getComands = useCallback(():IDictFormatTextInfo[] => {
        let device:IDictFormatTextInfo[] = devices.map(item=>({data:item.system_name, textColor: "red", list:item.fields.map(item2=>({data:item2.name, textColor:"orange"}))}))
        return [{
            data: "device",
            textColor: "green",
            list: device
        }, ...logic, ...signCondition, ...signMath, ...mathFunction]
    },[devices])

    const save = useCallback(()=>{
        onSave && onSave(value)
    },[value])

    const controlSetValue = (_: TypeEntityAction, entity:string, value:string) => {
        let data = `${entity} = ${value}`
        setValue(prev => (prev.length === 0)?data:prev + ";\n" + data)
    }

    useEffect(()=>{
        if (data)
            setValue(data)
    },[data])

    return(
        <FullScrinTemplateDialog header="edit action block" onHide={()=>dispatch(hideFullScreenDialog())} onSave={save}>
            <div className="condition-block control">
                <FilledButton onClick={()=>addValue(controlSetValue)}>+</FilledButton>
            </div>
            <div>
            <TextArea border onChange={(e)=>{setValue(e.target.value)}} value={value}/>
            </div>
        </FullScrinTemplateDialog>
    )
}