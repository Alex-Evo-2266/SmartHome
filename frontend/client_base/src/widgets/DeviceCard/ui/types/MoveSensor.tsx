import { useGetBinaryField } from '@src/features/Device';
import { Card, Divider, RunningLine, SizeContext, Typography, ScreenSize } from 'alex-evo-sh-ui-kit'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import img1 from '../../../../../public/img/device/sensor2.png'
import { DeviceCardProps } from '../../models/props'
import { cardSizeStyle } from '../../models/sizeDeviceCard'
import './Switch.scss'
import './DeviceCardTemplate.scss'

export const MoveSensorDevice:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)
    
    const {fieldValue: moveValue} = useGetBinaryField(device, "motion")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name, navigate])

    return(
        <Card className='card-device' rootApp='#root' onClick={openDitail} style={cardSizeStyle(screen, 'light')}>
            <div className='header-container' onClick={openDitail}>
                            <div style={{width: "calc(100% - 60px)"}}>
                                <RunningLine className='header-text' weight='bold' type='title' screensize={screen} text={device.name}/>
                            </div>
                            <img style={{margin: "-5px"}} className='card-device-img' src={img1}/>
                        </div>
            <div className='control-container'>
                <div className='control-row state-switch'>
                    <div className='text-container'>
                        <Typography type='small' className="ellipsis">{device.system_name}</Typography>
                    </div>
                </div>
                {
                    device.status !== 'online'?
                    <Divider style={{color:"var(--Error-color)"}} text={device.status}/>:
                    <Divider/>
                }
                <div onClick={openDitail}>
                {
                    moveValue !== null && <div><span>motion</span>: <span>{moveValue}</span></div>
                }
                </div>
            </div>
        </Card>
    )
}