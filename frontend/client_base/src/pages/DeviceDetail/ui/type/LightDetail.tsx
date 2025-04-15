import { Range, ScreenSize, SizeContext } from "alex-evo-sh-ui-kit"
import { DeviceDetailProps } from "../../models/props"
import { Bulb, SelectField, useDebounce } from "../../../../shared"
import './LightDetail.scss'
import { useGetBinaryField, useGetNumberField } from "../../../../widgets/DeviceCard/hooks/getField.hook"
import { useContext, useEffect, useState } from "react"
import { kelvinCSSGradient } from "../../../../shared/lib/helpers/tempColor"


export const DetailDeviceLight:React.FC<DeviceDetailProps> = ({device}) => {

    const {fieldValue: powerValue, updateFieldState: updateFieldPower} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue, updateFieldState: updateFieldBrightness, field: brightness} = useGetNumberField(device, "brightness")
    const {fieldValue: tempVal, updateFieldState: updateTemp, field: temp} = useGetNumberField(device, "temp")

    const [curBulb, setCurBulb] = useState("main")

    const debouncedBrightnessSend = useDebounce(updateFieldBrightness, 300)
    const debouncedTempSend = useDebounce(updateTemp, 300)

    const {screen} = useContext(SizeContext)
      
    const sliderOrientation = screen === ScreenSize.MOBILE? 'vertical': 'horizontal'

    useEffect(()=>{
        console.log(powerValue)
    },[powerValue])

    return (
        <div className={`light-detail-page container-page`}>
            <Bulb className="lamp-image" size={sliderOrientation === 'vertical'? 4: 6} status={!!powerValue} onClick={()=>updateFieldPower(!powerValue)}/>
            <SelectField items={[{title: "main", value: "main"}, {title: "dop", value:"dop"}]} border className="select-bulb" value={curBulb} onChange={setCurBulb}/>
            <div className={`main-control ${screen === ScreenSize.MOBILE? "coll": ""}`}>
            {
                brightness && 
                <div className="range-light-container">
                    <Range className="range-light" strokeWidth="50px" orientation={sliderOrientation} max={Number(brightness?.high) ?? 100} min={Number(brightness?.low) ?? 0} value={brightnessValue ?? undefined} onChange={e=>debouncedBrightnessSend(Number(e.target.value))}/>
                </div>
            }
            {
                temp && 
                <div className="range-light-container">
                    <Range 
                    colorRange="var(--Surface-container-high-color)" 
                    strokeWidth="50px" 
                    className="range-light" 
                    orientation={sliderOrientation} 
                    styleTrack='point' 
                    max={Number(temp?.high) ?? 100} 
                    min={Number(temp?.low) ?? 0} 
                    value={tempVal ?? undefined} 
                    onChange={e=>debouncedTempSend(Number(e.target.value))} 
                    colorBg={kelvinCSSGradient(Number(temp?.high) ?? 10000, Number(temp?.low) ?? 2000, 10, sliderOrientation === 'vertical'? "to top": "to right")}
                    />
                </div>
            }
            </div>
        </div>
    )
}
