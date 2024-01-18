import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../shared/lib/hooks/redux"
import { hideDialog, showDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from "../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { DeviceData, useDeviceSelectionDevice } from "../../../../entites/Device"
import { DeviceFieldType, FieldDevice } from "../../../../entites/Device/models/deviceData"
import { TriggerActionData, TypeEntityAction } from "../../../../entites/Trigger/models/TriggerData"
import { TextDialog } from "../../../../shared/ui/Dialog/BaseDialog/TextDialog"


export const useTriggerActionDevice = () => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)
    const {selectionDeviceDialog} = useDeviceSelectionDevice()

    const getItemsDevice = useCallback(()=>{
        return devices.map(item=>({title: item.name, data: item.system_name}))
    },[devices])

    const getAction = useCallback((device: DeviceData, field: FieldDevice, value: string, callback: (data:TriggerActionData)=>void)=>{
        let data: TriggerActionData = {
            entity: `device.${device.system_name}.${field.name}`,
            value,
            type_entity: TypeEntityAction.DEVICE
        }
        callback(data)
    },[])

    const selectState = useCallback((device: DeviceData, field: FieldDevice, callback: (data:TriggerActionData)=>void)=>{
        if(field.type === DeviceFieldType.BINARY)
        {
            let items = [{title:"on", data: "on"}, {title:"off", data: "off"}]
            dispatch(showDialog(<SelectionDialog header="Value" items={items} onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getAction(device, field, data, callback)
            }}/>))
        }
        else if(field.type === DeviceFieldType.ENUM)
        {
            let items = field.enum_values.split(",").map(item=>({title: item.trim(), data: item.trim()}))
            dispatch(showDialog(<SelectionDialog header="Value" items={items} onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getAction(device, field, data, callback)
            }}/>))
        }
        else if(field.type === DeviceFieldType.NUMBER){
            dispatch(showDialog(<TextDialog type="number" max={Number(field.high)} min={Number(field.low)} onHide={()=>dispatch(hideDialog())} onSuccess={(value)=>{
                getAction(device, field, value, callback)
            }}/>))
        }
        else{
            dispatch(showDialog(<TextDialog header="Мalue" text="enter the values of the field to be compared with." onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getAction(device, field, data, callback)
            }}/>))
        }
    },[getAction])

    const triggerActionDeviceDialog = useCallback((callback: (data:TriggerActionData)=>void)=> {
        selectionDeviceDialog((device, field)=>{
            if (!device || !field)
                return
            selectState(device, field, callback)
        })
    },[getItemsDevice, dispatch])

    return {triggerActionDeviceDialog}
}