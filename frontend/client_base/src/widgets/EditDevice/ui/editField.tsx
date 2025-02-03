import { Form, FullScrinTemplateDialog } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from "react"
import { MODAL_ROOT_ID } from "../../../const"
import { DeviceClassOptions, TypeDeviceField } from "../../../entites/devices"
import { FieldData } from "../models/editDeviceSchema"

const BINARY_HIGH = '1'
const BINARY_LOW = '0'
const NUMBER_HIGH = '100'
const NUMBER_LOW = '0'

interface FieldDataProps{
    onHide: ()=>void
    onSave: (data: FieldData)=>void
    option: DeviceClassOptions
    data: FieldData
}

function getOption() {
    const types = Object.values(TypeDeviceField)
    return types
}

export const EditField:React.FC<FieldDataProps> = ({onHide, onSave, option, data}) => {

    const [value, setValue] = useState<FieldData>(data)
    const [errors, setErrors] = useState<{[key:string]:string}>({})

    const change = (name: string, data: any) => {
        if(name === 'type' && data === TypeDeviceField.BINARY)
        {
            return setValue(prev=>({...prev, type: data, low: BINARY_LOW, high: BINARY_HIGH}))
        }
        if(name === 'type' && data === TypeDeviceField.NUMBER)
        {
            return setValue(prev=>({...prev, type: data, low: NUMBER_LOW, high: NUMBER_HIGH}))
        }
        if(name === 'type')
        {
            return setValue(prev=>({...prev, type: data, low: undefined, high: undefined}))
        }
        setValue(prev=>({...prev, [name]: data}))
    }

    useEffect(()=>{
        console.log(value)
    },[value])

    const validField = (field:FieldData) => {
        const errors:{[key:string]: string} = {}

        if(field.name.length === 1)
        {
            errors.name = 'short name'
        }
        if(field.name.length === 0)
        {
            errors.name = 'заполните имя'
        }
        if(option.fields_change.address && field.address.length === 0 && !field.virtual_field)
        {
            errors.address = 'заполните адрес'
        }

        return errors
    }

    const save = useCallback(()=>{
        const errors = validField(value)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            onSave && onSave(value)
        }
    },[onSave, value])

    return(
        <FullScrinTemplateDialog header="add field" onHide={onHide} onSave={save}>
            <div style={{marginInline: '16px'}}>
                <Form value={value} changeValue={change} errors={errors}>
                    {option.fields_change.name && <Form.TextInput border name="name" placeholder="name"/>}
                    {option.fields_change.address && !value.virtual_field && <Form.TextInput border name="address" placeholder="address"/>}
                    {option.fields_change.type && <Form.SelectInput container_id={MODAL_ROOT_ID} border name="type" items={getOption()} placeholder="type"/>}
                    {
                    (value.type === TypeDeviceField.BINARY || value.type === TypeDeviceField.NUMBER)?
                    <>
                        {option.fields_change.low && <Form.TextInput border name="low" placeholder="low"/>}
                        {option.fields_change.high && <Form.TextInput border name="high" placeholder="high"/>}
                    </>
                    :null
                    }
                    {option.fields_change.unit && <Form.TextInput border name="unit" placeholder="unit"/>}
                    {option.fields_change.virtual_field && <Form.SwitchButtonField name="virtual_field" placeholder="virtual"/>}
                    {option.fields_change.read_only && <Form.SwitchButtonField name="read_only" placeholder="read only"/>}
                </Form>
            </div>
        </FullScrinTemplateDialog>
    )
}