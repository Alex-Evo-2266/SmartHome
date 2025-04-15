import { Card, Divider, Switch, Typography } from 'alex-evo-sh-ui-kit'
import { DeviceCardProps } from '../../models/props'
import './Light.scss'
import { Bulb } from '../../../../shared'
import { getData } from '../../helpers/fieldUtils'
import { MenuDeviceCard } from '../MenuDeviceCard'
import { useGetBinaryField, useGetNumberField } from '../../hooks/getField.hook'
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react'

export const LightDevice:React.FC<DeviceCardProps> = ({device, onEdit}) => {
    const navigate = useNavigate()
    
    const {field: power, fieldValue: powerValue, changeField: changePower} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue} = useGetNumberField(device, "brightness")
    const {fieldValue: tempValue} = useGetNumberField(device, "color")

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

    return(
        <Card className='card-lamb' header={device.name} rootApp='#root' onClick={openDitail} iconButtonCell={<MenuDeviceCard name={device.name} system_name={device.system_name} status={device.status} onEdit={onEdit}/>}>
            {
                power && <Bulb className='lamp-image' onClick={openDitail} status={getData(power.high, power.low, power.value, false)}/>
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
                <Divider/>
                {
                    brightnessValue !== null && <div><span>brightness</span>: <span>{brightnessValue}</span></div>
                }
                {
                    tempValue !== null && <div><span>temp</span>: <span>{tempValue}</span></div>
                }
            </div>
        </Card>
    )
}