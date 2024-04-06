import { useCallback } from "react"
import { useAppDispatch } from "../../../../../shared/lib/hooks/redux"
import { SelectionDialog } from "../../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../../../shared/lib/reducers/dialogReducer"
import { TypeEntity } from "../../../../../entites/Automation/models/AutomationData"
import { useDeviceSelectionDevice } from "../../../../../entites/Device"
import { AutomationEntitiesPeriodDialog } from "../../ui/AutomationEntitiesPeriod"

const dialogItems = [
    {title:"time", data: TypeEntity.TIME},
    {title:"device", data: TypeEntity.DEVICE},
    {title:"service", data: TypeEntity.SERVICE},
]

export const useAutomationTrigger = () => {

    const dispatch = useAppDispatch()
    const {selectionDeviceDialog} = useDeviceSelectionDevice()

    const addValue = useCallback((setValueCascade:(type_entity: TypeEntity, data:string)=>void) => {
        dispatch(showDialog(<SelectionDialog 
            noHide
            header='select type entity'
            items={dialogItems} 
            onHide={()=>dispatch(hideDialog())}
            onSuccess={(type_entity)=>{
                dispatch(hideDialog())
                if(type_entity === TypeEntity.DEVICE)
                    selectionDeviceDialog((device, field)=>{
                        setValueCascade(type_entity, `device.${device.system_name}.${field.name}`)
                    })
                else if(type_entity === TypeEntity.TIME)
                    dispatch(showFullScreenDialog(<AutomationEntitiesPeriodDialog onChange={(data)=>{
                        setValueCascade(type_entity, data)
                        dispatch(hideFullScreenDialog())
                    }}/>))
            }}/>))
    },[dispatch, selectionDeviceDialog])

    return{addValue}
}