import { Form, FormRef, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useCallback, useRef, useState } from "react"

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

    const [errors, setErrors] = useState<{[key:string]:string}>({})
    const form = useRef<FormRef<FieldData>>(null)

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

    const validField = useCallback((field:FieldData) => {
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
    },[option.fields_change.address])

    const finishHandler = useCallback((data: FieldData)=>{
        const errors = validField(data)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            onSave(data)
        }
    },[onSave, validField])

    return(
        <FullScreenTemplateDialog header="add field" onHide={onHide} onSave={form.current?.submit}>
            <div style={{marginInline: '16px'}}>
                <Form<FieldData> value={data} onChangeValue={change} onFinish={finishHandler} errors={errors}>
                    {option.fields_change.name && <Form.TextInput border name="name" placeholder="name"/>}
                    {option.fields_change.address && !form.current?.getValues().virtual_field && <Form.TextInput border name="address" placeholder="address"/>}
                    {option.fields_change.type && <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} border name="type" items={getOption()} placeholder="type"/>}
                    {
                    (form.current?.getValues().type === TypeDeviceField.BINARY || form.current?.getValues().type === TypeDeviceField.NUMBER)?
                    <>
                        {option.fields_change.low && <Form.TextInput border name="low" placeholder="low"/>}
                        {option.fields_change.high && <Form.TextInput border name="high" placeholder="high"/>}
                    </>
                    :(form.current?.getValues().type === TypeDeviceField.ENUM && option.fields_change.enum_values)?
                        <Form.MoreTextField name="enum_values"/>
                    :null
                    }
                    {option.fields_change.unit && <Form.TextInput border name="unit" placeholder="unit"/>}
                    {option.fields_change.virtual_field && <Form.SwitchButtonField name="virtual_field" placeholder="virtual"/>}
                    {option.fields_change.read_only && <Form.SwitchButtonField name="read_only" placeholder="read only"/>}
                </Form>
            </div>
        </FullScreenTemplateDialog>
    )
}