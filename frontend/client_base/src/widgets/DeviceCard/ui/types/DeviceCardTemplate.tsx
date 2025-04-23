import { Card, Divider, Switch, Typography } from 'alex-evo-sh-ui-kit'
import { DeviceCardProps } from '../../models/props'
import './Light.scss'
import { Bulb } from '../../../../shared'
import { getData } from '../../../../features/Device/helpers/fieldUtils'
import { useGetBinaryField, useGetNumberField } from '../../../../features/Device/hooks/getField.hook'
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react'

export const DeviceTemplateCard:React.FC<DeviceCardProps> = ({device}) => {
    const navigate = useNavigate()
    
    const {field: power, fieldValue: powerValue, changeField: changePower} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue} = useGetNumberField(device, "brightness")
    const {fieldValue: tempValue} = useGetNumberField(device, "temp")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

    return(
        <Card className='card-device' rootApp='#root' onClick={openDitail}>
            <div onClick={openDitail}><Typography className='header-text' type='heading'>{device.name}</Typography></div>
            {
                power && <Bulb className='image-svg-device' onClick={openDitail} status={getData(power.high, power.low, power.value, false)}/>
            }
            <div className='control-container'>
                <div className='control-row state-switch'>
                <Typography type="small">{device.system_name}</Typography>
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