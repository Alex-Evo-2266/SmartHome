import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../shared/lib/hooks/redux"
import { hideDialog, showDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from "../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { DeviceData, FieldDevice } from "../.."
import { DeviceFieldType } from "../../models/deviceData"


export const useDeviceSelectionDevice = () => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)

    const getItemsDevice = useCallback((type_field?: DeviceFieldType)=>{
        return devices.filter(item=>(
            !type_field || item.fields.filter(item2=>item2.type === type_field).length > 0
        )).map(item=>({title: item.name, data: item.system_name}))
    },[devices])

    const getItemsField = useCallback((device:DeviceData, type_field?: DeviceFieldType)=>{
        return device.fields.filter(item=>(!type_field || item.type === type_field)).map(item=>({title: item.name, data: item.name})) || []
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

    const selectField = useCallback((device: DeviceData, callback: (device: DeviceData, field: FieldDevice)=>void, type?: DeviceFieldType)=> {
        dispatch(showDialog(<SelectionDialog header="field" items={getItemsField(device, type)} noHide onHide={()=>dispatch(hideDialog())} onSuccess={(field_name)=>{
            console.log("P)")
            dispatch(hideDialog())
            let field = getField(device, field_name)
            if(!field)
                return
            callback(device, field)
        }}/>))
    },[getDevice, getItemsField, dispatch])

    const selectionDeviceDialog = useCallback((callback: (device: DeviceData, field: FieldDevice)=>void, type?: DeviceFieldType)=> {
        dispatch(showDialog(<SelectionDialog header="device" items={getItemsDevice(type)} noHide onHide={()=>dispatch(hideDialog())} onSuccess={(system_name)=>{
            dispatch(hideDialog())
            let device = getDevice(system_name)
            if(!device)
                return
            selectField(device, callback, type)
        }}/>))
    },[getItemsDevice, dispatch, selectField])

    return {selectionDeviceDialog}
}