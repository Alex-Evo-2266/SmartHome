import { BaseActionCard, Chips, FilledButton } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from 'react'
import { useDeviceSelectionDevice } from '../../../entites/Device'
import { DeviceFieldType } from '../../../entites/Device/models/deviceData'

interface EntitiesFieldProps{
    value: string[]
    onChange?: (value: string[]) => void
    type?: DeviceFieldType
}

export const EntitiesField = ({value, onChange, type}:EntitiesFieldProps) => {

    const [values, setValues] = useState<string[]>(value)
    const {selectionDeviceDialog} = useDeviceSelectionDevice()

    const setValue = useCallback((data:string) => {
        let newValue = [...values, data]
        setValues(newValue)
        onChange && onChange(newValue)
    },[values])

    const addValue = useCallback(() => {
        selectionDeviceDialog((device, field)=>{
            setValue(`device.${device.system_name}.${field.name}`)
        }, type)
    },[values])

    const deleteValue = useCallback((id: number) => {
        const data = values.filter((_, index)=>index !== id)
        onChange && onChange(data)
        setValues(data)
    },[values])

    useEffect(()=>{
        setValues(value)
    },[value])

    return(
        <div className='more-text'>
            <div className='chips-container'>
            {
                values.map((item, index)=>(
                    <Chips key={index} text={item} onDelete={()=>deleteValue(index)} big/>
                ))
            }
            </div>
            <BaseActionCard className='add value'>
                <FilledButton onClick={addValue}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}