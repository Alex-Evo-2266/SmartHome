import './DevicePage.scss'
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { FAB, GridLayout, GridLayoutItem } from "../../../shared/ui"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { DeviceEditDialog } from '../../../widgets/DeviceEdit'

export const DevicePage = () => {

    const {devices} = useAppSelector(state=>state.device)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const editDevice = (systemName: string) => {
        dispatch(showFullScreenDialog(<DeviceEditDialog systemName={systemName}/>))
    }

    return(
        <div className="device-page">
            <GridLayout itemMinWith='250px' itemMaxWith='350px' gridColumnGap='10px'>
            {
                devices.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item} onClickEditButton={()=>editDevice(item.system_name)}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB icon={<PlusCircle/>} onClick={()=>navigate("device/add")}>Add Device</FAB>
        </div>
    )
}