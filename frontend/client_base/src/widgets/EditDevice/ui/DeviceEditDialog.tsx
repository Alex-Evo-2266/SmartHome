import { ContentBox, Form, FormRef, FullScreenTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useRef, useState } from "react"

import { EditType } from "./editType"
import { FieldList } from "./fieldList"
import { MODAL_ROOT_ID } from "../../../const"
import { DeviceClassOptions, DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices"
import { SelectRoom } from "../../../features/Room"
import { useEditDevice } from "../api/editDevice"
import { EditDeviceData, FieldData } from "../models/editDeviceSchema"

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

    const [fields, setFields] = useState<FieldData[]>(getInitData(data).fields)
    const [errors, setErrors] = useState<{[key:string]:string}>({})
    const {editDevice} = useEditDevice()
    const form = useRef<FormRef<EditDeviceData>>(null)

    useEffect(() => {
        const initData = getInitData(data)
        setFields(initData.fields)
    }, [data])

    const changeRoom = (roomName: string) => {
        if(roomName == "")
            form.current?.setFieldValue("room", undefined)
        else
            form.current?.setFieldValue("room", roomName)
    }

    const finishHandler = useCallback(async(value: EditDeviceData)=>{
        const errors = validDevice({...value, fields}, option)
        setErrors(errors)
        if(Object.keys(errors).length === 0)
        {
            await editDevice({...value, class_device: data.class_device, type: data.type, fields: fields}, data.system_name)
            onHide()
        }
    },[option, data, onHide, editDevice, fields])

    const save = useCallback(() => {
        form.current?.submit()
    },[fields])

    return(
        <FullScreenTemplateDialog onHide={onHide} onSave={save}>
            <ContentBox label="edit main data">
                <Form<EditDeviceData> ref={form} value={getInitData(data)} onFinish={finishHandler} errors={errors}>
                    <Form.TextInput name="name" border placeholder="name"/>
                    <Form.TextInput name="system_name" border placeholder="system name"/>
                    {option.address? <Form.TextInput name="address" border placeholder="address"/>:<TextField readOnly border placeholder="address" name="address" value={data.address}/>}
                    {option.token? <Form.TextInput name="token" border placeholder="token"/>:<TextField readOnly border placeholder="token" name="token" value={data.token}/>}
                    {option.type_get_data? <Form.SelectInput container={document.getElementById(MODAL_ROOT_ID)} items={['pull', 'push']} name="type_get_data" border placeholder="type get data"/>:<TextField readOnly border placeholder="type get data" name="type_get_data" value={data.type_get_data}/>}
                    <FieldList 
                        fields={fields} 
                        option={option} 
                        onChange={setFields}
                    />
                    <EditType option={option} data={data}/>
                    <SelectRoom value={form.current?.getValues().room ?? ""} onChange={changeRoom}/>
                </Form>
            </ContentBox>
        </FullScreenTemplateDialog>
    )
}
