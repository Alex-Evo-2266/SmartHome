import { ArrowLeft, ContentBox, IconButton, Range, ScreenSize, SizeContext, Typography } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import { DeviceDetailProps } from "../../models/props"
import { Bulb, SelectField, useDebounce } from "../../../../shared"
import './LightDetail.scss'
import { useGetBinaryField, useGetNumberField } from "../../../../features/Device/hooks/getField.hook"
import { useContext, useMemo, useState } from "react"
import { kelvinCSSGradient } from "../../../../shared/lib/helpers/tempColor"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { MenuDeviceCard } from "../MenuDeviceCard"


export const DetailDeviceLight:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    const {fieldValue: powerValue, updateFieldState: updateFieldPower, field: power} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue, updateFieldState: updateFieldBrightness, field: brightness} = useGetNumberField(device, "brightness")
    const {fieldValue: tempVal, updateFieldState: updateTemp, field: temp} = useGetNumberField(device, "temp")

    const [curBulb, setCurBulb] = useState("main")
    const navigate = useNavigate();

    const debouncedBrightnessSend = useDebounce(updateFieldBrightness, 300)
    const debouncedTempSend = useDebounce(updateTemp, 300)

    const {screen} = useContext(SizeContext)

    const usedField = useMemo(()=>[
            power?.id,
            brightness?.id,
            temp?.id
        ].
        filter(item=>item !== null && item !== undefined),
        [power, brightness, temp]
    )

    return (
        <div className={`light-detail-page container-page`}>
            <SelectField items={[{title: "main", value: "main"}, {title: "dop", value:"dop"}]} border className="select-bulb" value={curBulb} onChange={setCurBulb}/>
            <Typography className="light-detail-name" type='heading'>{device.name}</Typography>
            <IconButton onClick={()=>navigate("/device")} className="light-detail-back" icon={<ArrowLeft/>} transparent/>
            <div className="header-container">
                <div className="image-container">
                    <Bulb className="lamp-image" size={6} status={!!powerValue} onClick={()=>updateFieldPower(!powerValue)}/>
                </div>
            </div>
            <div className={`main-control ${screen === ScreenSize.MOBILE? "coll": ""}`}>
                {
                    brightness && 
                    <div className="range-light-container">
                        <Range 
                        className="range-light" 
                        strokeWidth="50px" 
                        max={Number(brightness?.high) ?? 100} 
                        min={Number(brightness?.low) ?? 0} 
                        value={brightnessValue ?? undefined} 
                        onChange={e=>debouncedBrightnessSend(Number(e.target.value))}
                        />
                    </div>
                }
                {
                    temp && 
                    <div className="range-light-container">
                        <Range 
                        colorRange="var(--Surface-container-high-color)" 
                        strokeWidth="50px" 
                        className="range-light" 
                        styleTrack='point' 
                        max={Number(temp?.high) ?? 100} 
                        min={Number(temp?.low) ?? 0} 
                        value={tempVal ?? undefined} 
                        onChange={e=>debouncedTempSend(Number(e.target.value))} 
                        colorBg={kelvinCSSGradient(Number(temp?.high) ?? 10000, Number(temp?.low) ?? 2000, 10, "to right")}
                        />
                    </div>
                }
            </div>
            <ContentBox label="other" collapsible defaultVisible>
                {
                    device.fields?.filter(item=>!usedField.includes(item.id)).map((item, index)=>(
                        <DeviceField deviceName={device.system_name} field={item} key={`${device.system_name}-field-${index}`}/>
                    ))
                }
            </ContentBox>
            <MenuDeviceCard status={device.status} system_name={device.system_name} name={device.name} onEdit={onEdit}/>
        </div>
    )
}
