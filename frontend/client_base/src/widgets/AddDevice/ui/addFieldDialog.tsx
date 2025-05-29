import { Form, FullScreenTemplateDialog, SegmentedButton } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from "react"
import { FieldData } from "../models/deviceData"
import { MODAL_ROOT_ID } from "../../../const"
import { DeviceClassOptions, TypeDeviceField } from "../../../entites/devices"

const BINARY_HIGH = '1'
const BINARY_LOW = '0'
const NUMBER_HIGH = '100'
const NUMBER_LOW = '0'

interface FieldDataProps{
    onHide: ()=>void
    onSave: (data: FieldData)=>void
    option: DeviceClassOptions
}

function getInitData():FieldData{
    return {
        name: '',
        address: '',
        type: TypeDeviceField.BINARY,
        low: BINARY_LOW,
        high: BINARY_HIGH,
        read_only: false,
        unit: '',
        virtual_field: false
    }
}

function getOption() {
    const types = Object.values(TypeDeviceField)
    return types
}

export const AddField:React.FC<FieldDataProps> = ({onHide, onSave, option}) => {

    const [value, setValue] = useState<FieldData>(getInitData())
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
        if(field.address.length === 0 && option.fields_creation_data.address)
        {
            errors.address = 'заполните адрес'
        }

        return errors
    }

    const save = useCallback(()=>{
        console.log("d")
        const errors = validField(value)
        setErrors(errors)
        console.log(errors)
        if(Object.keys(errors).length === 0)
        {
            onSave && onSave(value)
        }
    },[onSave, value])

    return(
        <FullScreenTemplateDialog header="add field" onHide={onHide} onSave={save}>
            <div style={{marginInline: '16px'}}>
                <Form value={value} changeValue={change} errors={errors}>
                    <Form.TextInput border name="name" placeholder="name"/>
                    {
                        option.fields_creation_data.address &&
                        <Form.TextInput border name="address" placeholder="address"/>
                    }
                    <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} border name="type" items={getOption()} placeholder="type"/>
                    {
                    (value.type === TypeDeviceField.BINARY || value.type === TypeDeviceField.NUMBER)?
                    <>
                        <Form.TextInput border name="low" placeholder="low"/>
                        <Form.TextInput border name="high" placeholder="high"/>
                    </>
                    :null
                    }
                    <Form.TextInput border name="unit" placeholder="unit"/>
                    {option.fields_change.virtual_field && <Form.SwitchButtonField name="virtual_field" placeholder="virtual"/>}
                    {option.fields_change.read_only && <Form.SwitchButtonField name="read_only" placeholder="read only"/>}
                </Form>
            </div>
        </FullScreenTemplateDialog>
    )
}