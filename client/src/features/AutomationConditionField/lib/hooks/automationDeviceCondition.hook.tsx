import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from "../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { DeviceData } from "../../../../entites/Device"
import { DeviceFieldType, FieldDevice } from "../../../../entites/Device/models/deviceData"
import { AutomationConditionNumber } from "../../ui/AutomationConditionNimber"
import { Sign } from "../../../../entites/Automation"
import { AutomationConditionData, TypeEntityCondition } from "../../../../entites/Automation/models/AutomationData"
import { TextDialog } from "../../../../shared/ui/Dialog/BaseDialog/TextDialog"


export const useAutomationConditionDevice = () => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)

    const getItemsDevice = useCallback(()=>{
        return devices.map(item=>({title: item.name, data: item.system_name}))
    },[devices])

    const getItemsField = useCallback((device:DeviceData)=>{
        return device.fields.map(item=>({title: item.name, data: item.name})) || []
    },[])

    const getDevice = useCallback((system_name: string)=>{
        let device = devices.filter((item)=>item.system_name === system_name)
        if (device.length !== 0)
            return device[0]
    },[devices])

    const getField = useCallback((device: DeviceData, name: string)=>{
        
        let field = device.fields.filter((item)=>item.name === name)
        if (field.length !== 0)
            return field[0]
    },[])

    const getCondition = useCallback((device: DeviceData, field: FieldDevice, sign: Sign, value: string, callback: (data:AutomationConditionData)=>void)=>{
        let data: AutomationConditionData = {
            entity: `device.${device.system_name}.${field.name}`,
            sign,
            value,
            type_entity: TypeEntityCondition.DEVICE
        }
        callback(data)
    },[])

    const selectState = useCallback((device: DeviceData, field: FieldDevice, callback: (data: AutomationConditionData)=>void)=>{
        if(field.type === DeviceFieldType.BINARY)
        {
            let items = [{title:"on", data: "on"}, {title:"off", data: "off"}]
            dispatch(showDialog(<SelectionDialog header="Value" items={items} onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getCondition(device, field, Sign.EQUALLY, data, callback)
            }}/>))
        }
        else if(field.type === DeviceFieldType.ENUM)
        {
            let items = field.enum_values.split(",").map(item=>({title: item.trim(), data: item.trim()}))
            dispatch(showDialog(<SelectionDialog header="Value" items={items} onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getCondition(device, field, Sign.EQUALLY, data, callback)
            }}/>))
        }
        else if(field.type === DeviceFieldType.NUMBER){
            dispatch(showFullScreenDialog(<AutomationConditionNumber field={field} onChange={(sign, value)=>{
                dispatch(hideFullScreenDialog())
                getCondition(device, field, sign, value, callback)
            }}/>))
        }
        else{
            dispatch(showDialog(<TextDialog header="Мalue" text="enter the values of the field to be compared with." onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
                getCondition(device, field, Sign.EQUALLY, data, callback)
            }}/>))
        }
    },[getCondition])

    const selectField = useCallback((device: DeviceData, callback: (data:AutomationConditionData)=>void)=> {
        dispatch(showDialog(<SelectionDialog header="field" items={getItemsField(device)} noHide onHide={()=>dispatch(hideDialog())} onSuccess={(field_name)=>{
            dispatch(hideDialog())
            let field = getField(device, field_name)
            if(!field)
                return
            selectState(device, field, callback)
        }}/>))
    },[getDevice, getItemsField, dispatch, selectState])

    const automationConditionDeviceDialog = useCallback((callback: (data:AutomationConditionData)=>void)=> {
        dispatch(showDialog(<SelectionDialog header="device" items={getItemsDevice()} noHide onHide={()=>dispatch(hideDialog())} onSuccess={(system_name)=>{
            dispatch(hideDialog())
            let device = getDevice(system_name)
            if(!device)
                return
            selectField(device, callback)
        }}/>))
    },[getItemsDevice, dispatch, selectField])

    return {automationConditionDeviceDialog}
}