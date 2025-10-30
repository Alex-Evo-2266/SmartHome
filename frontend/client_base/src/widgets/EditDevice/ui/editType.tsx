import { Button, ContentBox, ListContainer, ListItem, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useState } from "react"

import { EditTypeDialog } from "./EditTypeDialog"
import { DeviceClassOptions, DeviceSchema } from "../../../entites/devices"
import { TypeDevice } from "../../../entites/devices/models/type"
import { DialogPortal } from "../../../shared"
import { useTypeDeviceAPI } from "../api/types"
import { DeviceTypeEditData } from "../models/type"

interface EditTypeProps{
    option: DeviceClassOptions
    data: DeviceSchema
}

export const EditType:React.FC<EditTypeProps> = ({option, data}) => {

    const [editTypeVisible, setEditTypeVisible] = useState<TypeDevice | null>(null)
    const [addTypeVisible, setAddTypeVisible] = useState<boolean>(false)
    const {types, updateTypes, getType, createTypes} = useTypeDeviceAPI()
    const [devcie, setDevice] = useState(data)
    const [typeVal, setType] = useState<TypeDevice | null>(null)
    const [otherTypes, setOtherTypes] = useState<TypeDevice[]>([])

    const loadType = useCallback(async(systemName:string)=>{
        const types = await getType(systemName)
        const main = types.find(item=>item.main)
        const otherTypes = types.filter(item=>!item.main)
        setDevice(prev=>({...prev, type_mask: main}))
        setType(main ?? null)
        setOtherTypes(otherTypes)
    },[getType])

    const editType = useCallback((newType: DeviceTypeEditData | null, id:string) => {
        updateTypes(id, newType)
        setTimeout(() => {
            setEditTypeVisible(null)
            loadType(devcie.system_name) 
        }, 200);
    },[devcie, loadType, updateTypes])

    const addType = useCallback((newType: DeviceTypeEditData) => {
        createTypes(newType)
        setTimeout(() => {
            setAddTypeVisible(false)
            loadType(devcie.system_name) 
        }, 200);
    },[devcie, createTypes, loadType])

    const hodeAndUpdate = useCallback(()=>{
        setTimeout(() => {
            setEditTypeVisible(null)
            loadType(devcie.system_name) 
        }, 200);
    },[loadType, devcie])

    useEffect(()=>{
        loadType(data.system_name)
    },[loadType, data.system_name])

    return(
        <>
        {
        option.type && 
        <div>
            <ContentBox label="Types" border collapsible>
                <TextField onClick={()=>setEditTypeVisible(typeVal)} readOnly placeholder="main type" border value={typeVal?.name_type ?? "[]"}/>
                <ListContainer transparent>
                {
                    otherTypes.map((item)=>(
                        <ListItem key={item.id} onClick={()=>setEditTypeVisible(item)} header={item.name_type}/>
                    ))
                }
                </ListContainer>
                <Button styleType='outline' type='button' onClick={()=>setAddTypeVisible(true)}>add type</Button>
            </ContentBox>
        </div>
        }
        {
            editTypeVisible &&
            <DialogPortal>
                <EditTypeDialog onHideAndLoad={hodeAndUpdate} type={editTypeVisible} types={types} data={devcie} option={option} onHide={()=>setEditTypeVisible(null)} onSave={editType}/>
            </DialogPortal>
        }
        {
            addTypeVisible &&
            <DialogPortal>
                <EditTypeDialog type={undefined} types={types} data={devcie} option={option} onHide={()=>setAddTypeVisible(false)} onSave={addType}/>
            </DialogPortal>
        }
        </>
    )
}
