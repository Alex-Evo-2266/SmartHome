import { Form, FormRef, FullScreenTemplateDialog, SegmentedButton } from "alex-evo-sh-ui-kit"
import { useCallback, useRef, useState } from "react"

import { MODAL_ROOT_ID } from "../../../const"
import { TypeDeviceField } from "../../../entites/devices"
import { FieldData } from "../models/editDeviceSchema"

const BINARY_HIGH = '1'
const BINARY_LOW = '0'
const NUMBER_HIGH = '100'
const NUMBER_LOW = '0'

interface FieldDataProps{
    onHide: ()=>void
    onSave: (data: FieldData)=>void

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

export const AddField:React.FC<FieldDataProps> = ({onHide, onSave}) => {

    const [errors, setErrors] = useState<{[key:string]:string}>({})
    const form = useRef<FormRef<FieldData>>(null)

    const save = () => {
        form.current?.submit()
    }

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
    const segmentsChange = (value: string[]) => {
        form.current?.setFieldValue("virtual_field", value.includes('virtual'))
        form.current?.setFieldValue("read_only", value.includes('read only'))
    }

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
        if(field.address.length === 0 && !field.virtual_field)
        {
            errors.address = 'заполните адрес'
        }

        return errors
    }

    const finishHandler = useCallback((data: FieldData)=>{
        const errors = validField(data)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            onSave(data)
        }
    },[onSave])

    return(
        <FullScreenTemplateDialog header="add field" onHide={onHide} onSave={save}>
            <div style={{marginInline: '16px'}}>
                <Form<FieldData> ref={form} value={getInitData()} onChangeValue={change} onFinish={finishHandler} errors={errors}>
                    <Form.TextInput border name="name" placeholder="name"/>
                    {form.current?.getValues().virtual_field?null:<Form.TextInput border name="address" placeholder="address"/>}
                    
                    <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} border name="type" items={getOption()} placeholder="type"/>
                    {
                    (form.current?.getValues().type === TypeDeviceField.BINARY || form.current?.getValues().type === TypeDeviceField.NUMBER)?
                    <>
                        <Form.TextInput border name="low" placeholder="low"/>
                        <Form.TextInput border name="high" placeholder="high"/>
                    </>
                    :null
                    }
                    {
                        (form.current?.getValues().type === TypeDeviceField.ENUM)?
                        <> 
                        <Form.MoreTextField border name="enum_values"/>
                        </>:
                        null
                    }
                    <Form.TextInput border name="unit" placeholder="unit"/>
                    <SegmentedButton items={['virtual', 'read only']} multiple onChange={segmentsChange}/>
                </Form>
            </div>
        </FullScreenTemplateDialog>
    )
}