import { TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"
import { DialogPortal } from "../../../shared"
import { DeviceClassOptions, DeviceSchema } from "../../../entites/devices"
import { useTypeDeviceAPI } from "../api/types"
import { EditTypeDialog } from "./EditTypeDialog"
import { DeviceTypeEditData } from "../models/type"

interface EditTypeProps{
    option: DeviceClassOptions
    data: DeviceSchema
}

export const EditType:React.FC<EditTypeProps> = ({option, data}) => {

    const [editTypeVisible, setEditTypeVisible] = useState<boolean>(false)
    const {types, updateTypes, getType} = useTypeDeviceAPI()
    const [devcie, setDevice] = useState(data)
    const [typeVal, setType] = useState(devcie.type_mask || null)

    const loadType = useCallback(async(systemName:string)=>{
        const type = await getType(systemName)
        setDevice(prev=>({...prev, type_mask: type ?? undefined}))
        setType(type)
    },[getType])

    const editType = useCallback((newType: DeviceTypeEditData | null) => {
        updateTypes(devcie.system_name, newType)
        setTimeout(() => {
            setEditTypeVisible(false)
            loadType(devcie.system_name) 
        }, 200);
    },[devcie])

    const editClick = useCallback(() => {
        setEditTypeVisible(true)
    },[])

    return(
        <>
        {
        option.type && 
        <div>
            <TextField onClick={editClick} readOnly placeholder="type" border value={typeVal?.name_type}/>
        </div>
        }
        {
            editTypeVisible &&
            <DialogPortal>
                <EditTypeDialog types={types} data={devcie} option={option} onHide={()=>setEditTypeVisible(false)} onSave={editType}/>
            </DialogPortal>
        }
        </>
    )
}
