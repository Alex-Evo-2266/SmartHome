import { Card, Divider, RunningLine, ScreenSize, SizeContext, Switch } from 'alex-evo-sh-ui-kit'
import { DeviceCardProps } from '../../models/props'
import './Light.scss'
import './DeviceCardTemplate.scss'
import { useGetBinaryField, useGetNumberField } from '../../../../features/Device/hooks/getField.hook'
import { useNavigate } from 'react-router-dom';
import { useCallback, useContext } from 'react'
import { cardSizeStyle } from '../../models/sizeDeviceCard'
import img1 from '../../../../../public/img/device/lamp1.png'
import img2 from '../../../../../public/img/device/lamp2.png'

export const LightDevice:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)
    
    const {field: power, fieldValue: powerValue, changeField: changePower} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue} = useGetNumberField(device, "brightness")
    const {fieldValue: tempValue} = useGetNumberField(device, "temp")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

    return(
        <Card className='card-device' rootApp='#root' onClick={openDitail} style={cardSizeStyle(screen, 'light')}>
            <div className='header-container' onClick={openDitail}>
                <div style={{width: "calc(100% - 60px)"}}>
                    <RunningLine className='header-text' weight='bold' type='title' screensize={screen} text={device.name}/>
                </div>
                <img style={{margin: "-5px"}} className='card-device-img' src={powerValue? img2: img1} loading="lazy"/>
            </div>
            <div className='control-container'>
                <div className='control-row state-switch'>
                    <div className='text-container'>
                        <RunningLine type='small' text={device.system_name}/>
                    </div>
                {
                    power && 
                    <div className='card-device-checkbox-container' style={{marginBottom: "5px"}}>
                        <Switch className='lamp-control-switch-state' size='small' onChange={changePower} checked={!!powerValue} />
                    </div>
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