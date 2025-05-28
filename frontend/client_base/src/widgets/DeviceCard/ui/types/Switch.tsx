import { Card, Divider, RunningLine, SizeContext, Switch, Typography, SwitchIcon } from 'alex-evo-sh-ui-kit'
import { DeviceCardProps } from '../../models/props'
import './Switch.scss'
import './DeviceCardTemplate.scss'
import { useGetBinaryField, useGetEnumField } from '../../../../features/Device/hooks/getField.hook'
import { useNavigate } from 'react-router-dom';
import { useCallback, useContext } from 'react'
import { cardSizeStyle } from '../../models/sizeDeviceCard'
import img1 from '../../../../../public/img/device/switch1.png'

export const SwitchDevice:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    const {screen} = useContext(SizeContext)
    
    const {fieldValue: state1Value, changeField: updateState1, field: state1} = useGetBinaryField(device, "state1")
    const {fieldValue: state2Value, changeField: updateState2, field: state2} = useGetBinaryField(device, "state2")
    const {fieldValue: state3Value, changeField: updateState3, field: state3} = useGetBinaryField(device, "state3")
    const {fieldValue: actionValue} = useGetEnumField(device, "action")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

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
                
                <div className='card-device-checkbox-container'>
                    {state1 && <Switch className='control-switch-state' size='small' onChange={updateState1} checked={!!state1Value} />}
                    {state2 && <Switch className='control-switch-state' size='small' onChange={updateState2} checked={!!state2Value} />}
                    {state3 && <Switch className='control-switch-state' size='small' onChange={updateState3} checked={!!state3Value} />}
                </div>
                </div>
                {
                    device.status !== 'online'?
                    <Divider style={{color:"var(--Error-color)"}} text={device.status}/>:
                    <Divider/>
                }
                <div onClick={openDitail}>
                {
                    actionValue !== null && <div><span>action</span>: <span>{actionValue}</span></div>
                }
                </div>
            </div>
        </Card>
    )
}