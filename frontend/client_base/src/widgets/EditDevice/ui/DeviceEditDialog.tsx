import { ContentBox, Form, FullScreenTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from "react"
import { MODAL_ROOT_ID } from "../../../const"
import { DeviceClassOptions, DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices"
import { EditDeviceData, FieldData } from "../models/editDeviceSchema"
import { FieldList } from "./fieldList"
import { useEditDevice } from "../api/editDevice"
import { EditType } from "./editType"
import { SelectRoom } from "../../../features/Room"

interface DeviceDataProps{
    data: DeviceSchema
    onHide: ()=>void
    option: DeviceClassOptions
}

function serializeField(field:DeviceSerializeFieldSchema):FieldData{
    return {
        name: field.name,
        address: field.address ?? "",
        type: field.type,
        low: field.low ?? undefined,
        high: field.high ?? undefined,
        read_only: field.read_only,
        unit: field.unit ?? "",
        virtual_field: field.virtual_field,
        enum_values: field.enum_values ?? undefined,
        icon: field.icon ?? undefined
    }
}

function getInitData(data:DeviceSchema):EditDeviceData{
    return {
        name: data.name,
        system_name: data.system_name,
        address: data.address,
        token: data.token,
        type_get_data: data.type_get_data,
        fields: data.fields?.map(serializeField) ?? [],
        room: data.room
    }
}

const validDevice = (data:EditDeviceData, option:DeviceClassOptions) => {
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

export const DeviceEditDialog:React.FC<DeviceDataProps> = ({data, onHide, option}) => {

    const [value, setValue] = useState<EditDeviceData>(getInitData(data))
    const [errors, setErrors] = useState<{[key:string]:string}>({})
    const {editDevice} = useEditDevice()

    const change = (name: string, data: any) => {
        setValue(prev=>({...prev, [name]: data}))
    }

    const changeRoom = (roomName: string) => {
        if(roomName == "")
            setValue(prev=>({...prev, room: undefined}))
        else
            setValue(prev=>({...prev, room: roomName}))
    }

    useEffect(()=>{
        console.log("data",value, option, data)
    },[value, option])

    const save = useCallback(async()=>{
        const errors = validDevice(value, option)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            await editDevice({...value, class_device: data.class_device, type: data.type}, data.system_name)
            onHide()
        }
    },[value, option, data, onHide])

    return(
        <FullScreenTemplateDialog onHide={onHide} onSave={save}>
            <ContentBox label="edit main data">
                <Form value={value} changeValue={change} errors={errors}>
                    <Form.TextInput name="name" border placeholder="name"/>
                    <Form.TextInput name="system_name" border placeholder="system name"/>
                    {option.address? <Form.TextInput name="address" border placeholder="address"/>:<TextField readOnly border placeholder="address" name="address" value={data.address}/>}
                    {option.token? <Form.TextInput name="token" border placeholder="token"/>:<TextField readOnly border placeholder="token" name="token" value={data.token}/>}
                    {option.type_get_data? <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} items={['pull', 'push']} name="type_get_data" border placeholder="type get data"/>:<TextField readOnly border placeholder="type get data" name="type_get_data" value={data.type_get_data}/>}
                    <FieldList fields={value.fields} option={option} onChange={data=>change('fields', data)}/>
                    <EditType option={option} data={data}/>
                    <SelectRoom value={value.room ?? ""} onChange={changeRoom}/>
                </Form>
            </ContentBox>
        </FullScreenTemplateDialog>
    )
}
