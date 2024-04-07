import { useCallback } from "react"
import { useAppDispatch } from "../../../../../shared/lib/hooks/redux"
import { SelectionDialog } from "../../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { hideDialog, showDialog } from "../../../../../shared/lib/reducers/dialogReducer"
import { TypeEntityAction } from "../../../../../entites/Automation/models/AutomationData"
import { useAutomationActionDevice } from "./automationDeviceAction.hook"
import { TextDialog } from "../../../../../shared/ui/Dialog/BaseDialog/TextDialog"
import { useAutomationActionScript } from "./automationScriptAction"

const dialogItems = [
    {title:"script", data: TypeEntityAction.SCRIPTS},
    {title:"device", data: TypeEntityAction.DEVICE},
    {title:"service", data: TypeEntityAction.SERVICE},
    {title:"delay", data: TypeEntityAction.DELAY},
]

export const useAutomationAction = () => {

    const dispatch = useAppDispatch()
    const {automationActionDeviceDialog} = useAutomationActionDevice()
    const {automationActionScriptDialog} = useAutomationActionScript()

    const addValue = useCallback((setValueCascade:(type_entity: TypeEntityAction, entity:string, value:string)=>void) => {
        dispatch(showDialog(<SelectionDialog
            noHide
            header='select type entity'
            items={dialogItems}
            onHide={()=>dispatch(hideDialog())}
            onSuccess={(type_entity)=>{
                dispatch(hideDialog())
                if(type_entity === TypeEntityAction.DELAY)
                    dispatch(showDialog(<TextDialog 
                        onHide={()=>dispatch(hideDialog())}
                        type='number'
                        min={0}
                        max={1000}
                        onSuccess={(value)=>{
                            setValueCascade(type_entity, "delay", value)
                            dispatch(hideDialog())
                        }}/>))
                if(type_entity === TypeEntityAction.DEVICE)
                    automationActionDeviceDialog((data)=>{
                        setValueCascade(data.type_entity, data.entity, data.value)
                    })
                if(type_entity === TypeEntityAction.SCRIPTS)
                    automationActionScriptDialog((data)=>{
                        setValueCascade(TypeEntityAction.SCRIPTS, "script", data.system_name)
                })
            }}
        />))
    },[automationActionDeviceDialog])

    return{addValue}
}