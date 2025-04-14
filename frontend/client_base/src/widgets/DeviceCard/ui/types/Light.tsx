import { Card, Switch, Typography } from 'alex-evo-sh-ui-kit'
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

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

    return(
        <Card rootApp='#root' onClick={openDitail} iconButtonCell={<MenuDeviceCard name={device.name} system_name={device.system_name} status={device.status} onEdit={onEdit}/>}>
            {
                power && 
                <>
                    <div style={{position:"absolute", top: "30px"}}>
                        <Bulb onClick={openDitail} status={getData(power.high, power.low, power.value, false)}/>
                    </div>
                    <Switch onChange={changePower} checked={powerValue} />
                </>
            }
            <div><Typography type="body">{device.name}</Typography></div>
            <div><Typography type="small">{device.system_name}</Typography></div>
            {
                brightnessValue &&
                <div>
                    <span>{brightnessValue}%</span>|
                </div>
            }
        </Card>
    )
}