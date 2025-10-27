import { useGetBinaryField, useGetNumberField } from '@src/features/Device';
import { Card, Divider, RunningLine, ScreenSize, SizeContext, Switch } from 'alex-evo-sh-ui-kit'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { DeviceCardProps } from '../../models/props'
import './Light.scss'
import { cardSizeStyle } from '../../models/sizeDeviceCard'

export const DeviceTemplateCard:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)
    
    const {field: power, fieldValue: powerValue, changeField: changePower} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue} = useGetNumberField(device, "brightness")
    const {fieldValue: tempValue} = useGetNumberField(device, "temp")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name, navigate])

    return(
        <Card className='card-device' rootApp='#root' onClick={openDitail} style={cardSizeStyle(screen)}>
            <div style={{width: "calc(100% - 50px)"}} onClick={openDitail}><RunningLine className='header-text' weight='bold' type='title' screensize={screen} text={device.name}></RunningLine></div>
            <div className='control-container'>
                <div className='control-row state-switch'>
                    <div className='text-container'>
                        <RunningLine type='small' text={device.system_name}/>
                    </div>
                {
                    power && 
                    <>
                    <Switch className='lamp-control-switch-state' size='small' onChange={changePower} checked={!!powerValue} />
                    </>
                }
                </div>
                {
                    device.status !== 'online'?
                    <Divider style={{color:"var(--Error-color)"}} text={device.status}/>:
                    <Divider/>
                }
                <div onClick={openDitail}>
                {
                    brightnessValue !== null && <div><span>brightness</span>: <span>{brightnessValue}</span></div>
                }
                {
                    tempValue !== null && <div><span>temp</span>: <span>{tempValue}</span></div>
                }
                </div>
            </div>
        </Card>
    )
}