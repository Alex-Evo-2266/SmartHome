
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DetailDeviceLight } from './type/LightDetail';
import { DeviceSchema } from '../../../entites/devices';
import { DialogPortal } from '../../../shared';
import { Loading } from '../../../shared/ui/Loading';
import { DeviceDetailProps } from '../models/props';
import { DetailDeviceSwitch } from './type/SwitchDetail';
import { DetailDeviceUncnow } from './type/Uncnow';
import { useAppSelector } from '../../../shared/lib/hooks/redux';
import { DeviceEdit } from '../../../widgets/EditDevice';
import { useDeviceAPI } from '@src/entites/devices/api/getDevice';

function getDeviceInStore(devcies: DeviceSchema[], systemName: string | undefined){
    if(!systemName){
        return undefined
    }
    return devcies.find(item=>item.system_name===systemName)
}

export const DetailDevice = () => {
    const { systemName } = useParams<{systemName: string}>();
    const navigate = useNavigate();
    const {devicesData} = useAppSelector(state=>state.devices)
    const deviceInStore = useMemo(()=>getDeviceInStore(devicesData, systemName),[devicesData, systemName])
    const {getDevice} = useDeviceAPI()
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [aktualData, setAktualData] = useState<DeviceSchema | undefined>(deviceInStore)

    if(!systemName){
        navigate('/device')
        return null
    } 

    const loadDevice = useCallback(async(systemName:string)=>{
        const device = await getDevice(systemName)
        const vals = deviceInStore?.value
        if(vals){
            device.value = vals
            device.fields?.map((item)=>{
                return{...item, value: vals[item.name]}
            })
        }
        setAktualData(device)

    },[getDevice, deviceInStore])

    useEffect(()=>{
        loadDevice(systemName)
    },[loadDevice, systemName])


    const components:{[key: string]: React.FC<DeviceDetailProps>} = {
        "LIGHT": DetailDeviceLight,
        "SWITCH": DetailDeviceSwitch
    } as const 

    if(!aktualData)
        return <Loading/>

    if (!aktualData.fields) {
        return <div>Device fields not loaded</div>;
    }
    

    const Component = (aktualData.type_mask?.name_type && Object.keys(components).includes(aktualData.type_mask.name_type))? components[aktualData.type_mask.name_type]: DetailDeviceUncnow

    return (
        <>
            <Component device={aktualData} onEdit={()=>setEditVisible(true)}/>
            {
                editVisible &&
                <DialogPortal>
                    <DeviceEdit onHide={()=>setEditVisible(false)} data={aktualData}/>
                </DialogPortal>
            }
        </>
    )
    
}