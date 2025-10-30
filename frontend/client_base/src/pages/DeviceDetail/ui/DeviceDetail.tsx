
import { useState } from 'react';
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

function getDevice(devcies: DeviceSchema[], systemName: string){
    return devcies.find(item=>item.system_name===systemName)
}

export const DetailDevice = () => {
    const navigate = useNavigate();
    const {devicesData} = useAppSelector(state=>state.devices)
    const [editVisible, setEditVisible] = useState<boolean>(false)

    const { systemName } = useParams<{systemName: string}>();
    if(!systemName){
        navigate('/device')
        return null
    } 

    const device = getDevice(devicesData, systemName)

    const components:{[key: string]: React.FC<DeviceDetailProps>} = {
        "LIGHT": DetailDeviceLight,
        "SWITCH": DetailDeviceSwitch
    } as const 

    if(!device)
        return <Loading/>

    if (!device.fields) {
        return <div>Device fields not loaded</div>;
    }
    

    const Component = (device.type_mask?.name_type && Object.keys(components).includes(device.type_mask.name_type))? components[device.type_mask.name_type]: DetailDeviceUncnow

    return (
        <>
            <Component device={device} onEdit={()=>setEditVisible(true)}/>
            {
                editVisible &&
                <DialogPortal>
                    <DeviceEdit onHide={()=>setEditVisible(false)} data={device}/>
                </DialogPortal>
            }
        </>
    )
    
}