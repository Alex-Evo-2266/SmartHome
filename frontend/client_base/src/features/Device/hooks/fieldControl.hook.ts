import { useCallback, useEffect, useMemo, useState } from "react"

import { DeviceSerializeFieldSchema } from "../../../entites/devices"
import { useSendValue } from "../../../entites/devices/api/sendValue"
import { getData, getInitData, getOutData } from "../helpers/fieldUtils"
import { useAppSelector } from "@src/shared/lib/hooks/redux"

export const useGetBinaryFieldControl = (field: DeviceSerializeFieldSchema | null, deviceName: string) => {

    const {devicesData} = useAppSelector(state=>state.devices)
    const valueData = useMemo(()=>{
        return !!field?.name? devicesData.find(i=>i.system_name === deviceName)?.value?.[field?.name]: undefined
    },[devicesData])
    const [fieldValue, setFieldValue] = useState(getInitData(field?.high, valueData))
    
    const {sendValue} = useSendValue()
    
    useEffect(() => {
        if(!field) return;
        setFieldValue(prev=>getData(field.high, field.low, valueData, prev));
    }, [field, valueData]);

    const updateFieldState = useCallback((newValue: boolean)=>{
        if(!field)return;
        setFieldValue(newValue);
        sendValue(deviceName, field.id, getOutData(field.high, field.low, newValue))
    },[sendValue, deviceName, field])
    
    const changeField = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = event.target.checked
        updateFieldState(newValue)
    },[updateFieldState])

    return{
        fieldValue: field===null?null:fieldValue,
        changeField,
        updateFieldState
    }
}

export const useGetNumberFieldControl = (field: DeviceSerializeFieldSchema | null, deviceName: string) => {

    const {devicesData} = useAppSelector(state=>state.devices)
    const valueData = useMemo(()=>{
        return !!field?.name? devicesData.find(i=>i.system_name === deviceName)?.value?.[field?.name]: undefined
    },[devicesData])
    const [fieldValue, setFieldValue] = useState(field?Number(valueData):null)
    
    const {sendValue} = useSendValue()
    
    useEffect(() => {
        if(!field)return;
        setFieldValue((prev) => (prev !== Number(valueData) ? Number(valueData) : prev));
    }, [field]);

    const updateFieldState = useCallback((newValue: number)=>{
        if(!field)return;
        if (isNaN(newValue)) return;
        setFieldValue(newValue);
        sendValue(deviceName, field.id, String(newValue))
    },[sendValue, deviceName, field])
    
    const changeField = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = parseFloat(event.target.value);
        updateFieldState(newValue)
    },[updateFieldState])

    return{
        fieldValue: field===null?null:fieldValue,
        changeField,
        updateFieldState
    }
}

export const useGetEnumFieldControl = (field: DeviceSerializeFieldSchema | null, deviceName: string) => {

    const {devicesData} = useAppSelector(state=>state.devices)
    const valueData = useMemo(()=>{
        return !!field?.name? devicesData.find(i=>i.system_name === deviceName)?.value?.[field?.name]: undefined
    },[devicesData])
    const [fieldValue, setFieldValue] = useState(field?valueData:null)
    
    const {sendValue} = useSendValue()
    
    useEffect(() => {
        if(!field)return;
        setFieldValue((prev) => (prev !== valueData ? valueData: prev));
    }, [field]);

    const updateFieldState = useCallback((newValue: string)=>{
        if(!field)return;
        if (newValue === undefined || newValue === null) return;
        setFieldValue(newValue);
        sendValue(deviceName, field.id, String(newValue))
    },[sendValue, deviceName, field])
    
    const changeField = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = event.target.value;
        updateFieldState(newValue)
    },[updateFieldState])

    return{
        fieldValue: field===null?null:fieldValue,
        changeField,
        updateFieldState
    }
}

export const useGetTextFieldControl = useGetEnumFieldControl
