import { useCallback, useEffect, useState } from "react"
import { logic, mathFunction, signCondition, signMath } from "../models/reservedWords"
import { useAppDispatch, useAppSelector } from "../../../../shared/lib/hooks/redux"
import { useAutomationCondition } from "../.."
import { IDictFormatTextInfo } from "../../../../shared/model/FormatText"
import { Sign, TypeEntityCondition } from "../../../../entites/Automation/models/AutomationData"
import { FilledButton, FormatText, FullScrinTemplateDialog } from "../../../../shared/ui"
import { hideFullScreenDialog } from "../../../../shared/lib/reducers/dialogReducer"

interface EditConditionBlockDialogProp{
    onSave: (data: string)=>void
    data: string
}

export const EditConditionBlockDialog = ({onSave, data}:EditConditionBlockDialogProp) => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)
    const [value, setValue] = useState<string>(data || "")
    const {addValue} = useAutomationCondition()

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

    const controlSetValue = (_: TypeEntityCondition, entity: string, value: string, sign: Sign = Sign.EQUALLY) => {
        const signChar = (sign === Sign.LESS)?"<":(sign === Sign.MORE)?">":"=="
        let data = `${entity} ${signChar} ${value}`
        setValue(prev => (prev.length === 0)?data:prev + " && " + data)
    }

    useEffect(()=>{
        setValue(data)
    },[data])

    useEffect(()=>{
        console.log(value)
    },[value])

    return(
        <FullScrinTemplateDialog header="edit condition block" onHide={()=>dispatch(hideFullScreenDialog())} onSave={save}>
            <div className="condition-block control">
                <FilledButton onClick={()=>addValue(controlSetValue)}>+</FilledButton>
            </div>
            <div>
                <FormatText border dict={getComands()} onChange={(e)=>{setValue(e.target.innerText)}} value={value}/>
            </div>
        </FullScrinTemplateDialog>
    )
}