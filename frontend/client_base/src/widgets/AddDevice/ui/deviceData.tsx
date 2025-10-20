import { ContentBox, Form, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from "react"
import { AddDeviceData } from "../models/deviceData"
import { MODAL_ROOT_ID } from "../../../const"
import { FieldList } from "./fieldList"
import { DeviceClassOptions } from "../../../entites/devices"

interface DeviceDataProps{
    option: DeviceClassOptions
    onHide: ()=>void
    onSave: (data:AddDeviceData) => void
}

function getInitData(option: DeviceClassOptions):AddDeviceData{
    return {
        name: '',
        system_name: '',
        address: option.address? '': undefined,
        token: option.token? '': undefined,
        type_get_data: option.type_get_data? 'push': undefined,
        fields: []
    }
}

const validDevice = (data:AddDeviceData, option:DeviceClassOptions) => {
    const errors:{[key:string]: string} = {}

    if(data.name.length === 1)
    {
        errors.name = 'short name'
    }
    if(data.name.length === 0)
    {
        errors.name = 'заполните имя'
    }
    if(option.address && data.address && data.address.length === 0)
    {
        errors.address = 'заполните адрес'
    }
    if(option.token && data.token && data.token.length === 0)
    {
        errors.token = 'заполните токен'
    }
    return errors
}

export const DeviceData:React.FC<DeviceDataProps> = ({option, onHide, onSave}) => {

    const [value, setValue] = useState<AddDeviceData>(getInitData(option))
    const [errors, setErrors] = useState<{[key:string]:string}>({})

    const change = (name: string, data: any) => {
        setValue(prev=>({...prev, [name]: data}))
    }

    useEffect(()=>{
        console.log(value)
    },[value])

    

    const save = useCallback(()=>{
        const errors = validDevice(value, option)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            onSave && onSave(value)
        }
    },[value, option])

    return(
        <FullScreenTemplateDialog onHide={onHide} onSave={save}>
            <ContentBox label="main data">
                <Form value={value} changeValue={change} errors={errors}>
                    <Form.TextInput name="name" border placeholder="name"/>
                    <Form.TextInput name="system_name" border placeholder="system name"/>
                    {option.address && <Form.TextInput name="address" border placeholder="address"/>}
                    {option.token && <Form.TextInput name="token" border placeholder="token"/>}
                    {option.type_get_data && <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} items={['pull', 'push']} name="type_get_data" border placeholder="type get data"/>}
                </Form>
            </ContentBox>
            <FieldList fields={value.fields} option={option} onChange={data=>change('fields', data)}/>
        </FullScreenTemplateDialog>
    )
}
