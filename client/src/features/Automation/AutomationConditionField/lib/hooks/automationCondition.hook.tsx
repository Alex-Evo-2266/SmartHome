import { useCallback } from "react"
import { useAppDispatch } from "../../../../../shared/lib/hooks/redux"
import { useAutomationConditionDevice } from "./automationDeviceCondition.hook"
import { SelectionDialog } from 'alex-evo-sh-ui-kit'
import { hideDialog, showDialog } from "../../../../../shared/lib/reducers/dialogReducer"
import { Sign, TypeEntityCondition } from "../../../../../entites/Automation/models/AutomationData"
import { TimePicker } from 'alex-evo-sh-ui-kit'
import { getFormattedTime } from "../../../../../shared/lib/helpers/timeFormat"

const dialogItems = [
    {title:"time", data: TypeEntityCondition.TIME},
    {title:"device", data: TypeEntityCondition.DEVICE},
    {title:"service", data: TypeEntityCondition.SERVICE},
]

export const useAutomationCondition = () => {

    const dispatch = useAppDispatch()
    const {automationConditionDeviceDialog} = useAutomationConditionDevice()

    const addValue = useCallback((setValueCascade:(type_entity: TypeEntityCondition, entity:string, value:string, sign?: Sign)=>void) => {
        dispatch(showDialog(<SelectionDialog
            noHide
            header='select type entity'
            items={dialogItems}
            onHide={()=>dispatch(hideDialog())}
            onSuccess={(type_entity)=>{
                dispatch(hideDialog())
                if(type_entity === TypeEntityCondition.TIME)
                    dispatch(showDialog(<TimePicker 
                        onHide={()=>dispatch(hideDialog())}
                        hours={0}
                        minutes={0}
                        onChange={(hours, minutes)=>{
                            setValueCascade(type_entity, "time", getFormattedTime(hours, minutes))
                            dispatch(hideDialog())
                        }}/>))
                if(type_entity === TypeEntityCondition.DEVICE)
                    automationConditionDeviceDialog((data)=>{
                        setValueCascade(data.type_entity, data.entity, data.value, data.sign)
                    })
            }}
        />))
    },[automationConditionDeviceDialog])

    return{addValue}
}