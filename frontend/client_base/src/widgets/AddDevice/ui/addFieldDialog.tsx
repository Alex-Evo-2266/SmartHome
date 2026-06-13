import { Form, FormRef, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useCallback, useRef, useState } from "react"

import { MODAL_ROOT_ID } from "../../../const"
import { DeviceClassOptions, TypeDeviceField } from "../../../entites/devices"
import { FieldData } from "../models/deviceData"

const BINARY_HIGH = '1'
const BINARY_LOW = '0'
const NUMBER_HIGH = '100'
const NUMBER_LOW = '0'

interface FieldDataProps{
    onHide: ()=>void
    onSave: (data: FieldData)=>void
    option: DeviceClassOptions
}

const initData:FieldData = {
    name: '',
    address: '',
    type: TypeDeviceField.BINARY,
    low: BINARY_LOW,
    high: BINARY_HIGH,
    read_only: false,
    unit: '',
    virtual_field: false
}

function getOption() {
    const types = Object.values(TypeDeviceField)
    return types
}

export const AddField:React.FC<FieldDataProps> = ({onHide, onSave, option}) => {

    const [errors, setErrors] = useState<Partial<Record<keyof FieldData, string>>>({})
    const form = useRef<FormRef<FieldData>>(null)

    const validField = useCallback((field:FieldData) => {
        const errors:Partial<Record<keyof FieldData, string>> = {}

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
    },[option.fields_creation_data.address])

    const finishHandler = useCallback((data: FieldData) => {
        const error = validField(data)
        setErrors(error)
        if(Object.keys(error).length === 0)
        {
            onSave(data)
        }
    },[onSave, validField])

    const change = <K extends keyof FieldData>(name: K, data: FieldData[K]) => {
        if(name === 'type' && data === TypeDeviceField.BINARY)
        {
            form.current?.setFieldValue("low", BINARY_LOW)
            form.current?.setFieldValue("high", BINARY_HIGH)
            return
        }
        if(name === 'type' && data === TypeDeviceField.NUMBER)
        {
            form.current?.setFieldValue("low", NUMBER_LOW)
            form.current?.setFieldValue("high", NUMBER_HIGH)
            return
        }
        if(name === 'type')
        {
            form.current?.setFieldValue("low", undefined)
            form.current?.setFieldValue("high", undefined)
            return
        }
    }

    const save = useCallback(()=>{
        form.current?.submit()
    },[])

    return(
        <FullScreenTemplateDialog header="add field" onHide={onHide} onSave={save}>
            <div style={{marginInline: '16px'}}>
                <Form<FieldData> ref={form} value={initData} onFinish={finishHandler} onChangeValue={change} errors={errors}>
                    <Form.TextInput border name="name" placeholder="name"/>
                    {
                        option.fields_creation_data.address &&
                        <Form.TextInput border name="address" placeholder="address"/>
                    }
                    <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} border name="type" items={getOption()} placeholder="type"/>
                    {
                    (form.current?.getValues().type === TypeDeviceField.BINARY || form.current?.getValues().type === TypeDeviceField.NUMBER)?
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