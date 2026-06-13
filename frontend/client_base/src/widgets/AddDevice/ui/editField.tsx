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
    data: FieldData
}

function getOption() {
    const types = Object.values(TypeDeviceField)
    return types
}

export const EditField:React.FC<FieldDataProps> = ({onHide, onSave, option, data}) => {

    const [errors, setErrors] = useState<{[key:string]:string}>({})
    const form = useRef<FormRef<FieldData>>(null)

    const change =<K extends keyof FieldData> (name: K, data: FieldData[K]) => {
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
        if(option.fields_change.address && field.address.length === 0)
        {
            errors.address = 'заполните адрес'
        }

        return errors
    },[option.fields_change.address])

    const finishHandler = useCallback((data: FieldData) => {
        const error = validField(data)
        setErrors(error)
        if(Object.keys(error).length === 0)
        {
            onSave(data)
        }
    },[validField, onSave])

    const save = useCallback(()=>{
        form.current?.submit()
    },[])

    return(
        <FullScreenTemplateDialog header="add field" onHide={onHide} onSave={save}>
            <div style={{marginInline: '16px'}}>
                <Form<FieldData> ref={form} value={data} onChangeValue={change} onFinish={finishHandler} errors={errors}>
                    {option.fields_change.name && <Form.TextInput border name="name" placeholder="name"/>}
                    {option.fields_change.address && <Form.TextInput border name="address" placeholder="address"/>}
                    {option.fields_change.type && <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} border name="type" items={getOption()} placeholder="type"/>}
                    {
                    (form.current?.getValues().type === TypeDeviceField.BINARY || form.current?.getValues().type === TypeDeviceField.NUMBER)?
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
        </FullScreenTemplateDialog>
    )
}