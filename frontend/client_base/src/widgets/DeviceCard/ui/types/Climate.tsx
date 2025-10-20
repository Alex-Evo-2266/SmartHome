import { Card, Divider, RunningLine, SizeContext, Switch, Typography, ScreenSize } from 'alex-evo-sh-ui-kit'
import { DeviceCardProps } from '../../models/props'
import './Switch.scss'
import './DeviceCardTemplate.scss'
import { useGetBinaryField, useGetNumberField } from '../../../../features/Device/hooks/getField.hook'
import { useNavigate } from 'react-router-dom';
import { useCallback, useContext } from 'react'
import { cardSizeStyle } from '../../models/sizeDeviceCard'
import img1 from '../../../../../public/img/device/cool.png'
import img2 from '../../../../../public/img/device/temp.png'

export const ClimateDevice:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)
    
    const {fieldValue: coolValue, changeField: updateCool, field: cool} = useGetBinaryField(device, "cool")
    const {fieldValue: heatValue, changeField: updateHeat, field: heat} = useGetBinaryField(device, "heat")
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
                            <img style={{margin: "-5px"}} className='card-device-img' src={cool===null && heat===null?img2:img1}/>
                        </div>
            <div className='control-container'>
                <div className='control-row state-switch'>
                    <div className='text-container'>
                        <Typography type='small' className="ellipsis">{device.system_name}</Typography>
                    </div>
                
                <div className='card-device-checkbox-container'>
                    {cool && 
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Typography type='small'>cool</Typography>
                            <Switch className='control-switch-state' size='small' onChange={updateCool} checked={!!coolValue} />
                        </div>
                    }
                    {heat && 
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Typography type='small'>heat</Typography>
                            <Switch className='control-switch-state' size='small' onChange={updateHeat} checked={!!heatValue} />
                        </div>
                    }
                </div>
                </div>
                {
                    device.status !== 'online'?
                    <Divider style={{color:"var(--Error-color)"}} text={device.status}/>:
                    <Divider/>
                }
                <div onClick={openDitail}>
                {
                    tempValue !== null && <div><span>temp</span>: <span>{tempValue}</span></div>
                }
                </div>
            </div>
        </Card>
    )
}