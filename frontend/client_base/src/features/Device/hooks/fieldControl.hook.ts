import { useCallback, useEffect, useState } from "react"
import { DeviceSerializeFieldSchema } from "../../../entites/devices"
import { getData, getInitData, getOutData } from "../helpers/fieldUtils"
import { useSendValue } from "../../../entites/devices/api/sendValue"

export const useGetBinaryFieldControl = (field: DeviceSerializeFieldSchema, deviceName: string) => {

    const [fieldValue, setFieldValue] = useState(getInitData(field.high, field.value))
    
    const {sendValue} = useSendValue()
    
    useEffect(() => {
        setFieldValue(prev=>getData(field.high, field.low, field.value, prev));
    }, [field]);

    const updateFieldState = useCallback((newValue: boolean)=>{
        setFieldValue(newValue);
        sendValue(deviceName, field.id, getOutData(field.high, field.low, newValue))
    },[sendValue, deviceName, field])
    
    const changeField = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = event.target.checked
        updateFieldState(newValue)
    },[updateFieldState])

    return{
        fieldValue,
        changeField,
        updateFieldState
    }
}

export const useGetNumberFieldControl = (field: DeviceSerializeFieldSchema, deviceName: string) => {

    const [fieldValue, setFieldValue] = useState(field?Number(field.value):null)
    
    const {sendValue} = useSendValue()
    
    useEffect(() => {
        setFieldValue((prev) => (prev !== Number(field.value) ? Number(field.value) : prev));
    }, [field]);

    const updateFieldState = useCallback((newValue: number)=>{
        if (isNaN(newValue)) return;
        setFieldValue(newValue);
        sendValue(deviceName, field.id, String(newValue))
    },[sendValue, deviceName, field])
    
    const changeField = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = parseFloat(event.target.value);
        updateFieldState(newValue)
    },[updateFieldState])

    return{
        fieldValue,
        changeField,
        updateFieldState
    }
}