import { Panel, Range, Tabs, Typography } from "alex-evo-sh-ui-kit"
import { DeviceDetailProps } from "../../models/props"
import { Bulb, SelectField, useDebounce } from "../../../../shared"
import './LightDetail.scss'
import { useGetBinaryField, useGetNumberField } from "../../../../widgets/DeviceCard/hooks/getField.hook"
import { useEffect, useState } from "react"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { kelvinCSSGradient } from "../../../../shared/lib/helpers/tempColor"


export const DetailDeviceLight:React.FC<DeviceDetailProps> = ({device}) => {

    const {fieldValue: powerValue, updateFieldState: updateFieldPower, field: power} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue, updateFieldState: updateFieldBrightness, field: brightness} = useGetNumberField(device, "brightness")
    const {fieldValue: tempVal, updateFieldState: updateTemp, field: temp} = useGetNumberField(device, "temp")

    const [curBulb, setCurBulb] = useState("main")

    const debouncedBrightnessSend = useDebounce(updateFieldBrightness, 300)
    const debouncedTempSend = useDebounce(updateTemp, 300)
      

    useEffect(()=>{
        console.log(powerValue)
    },[powerValue])

    const usedFields = [
        power?.id
    ]

    return (
        <div className="light-detail-page">
            <Bulb size={6} status={powerValue} onClick={()=>updateFieldPower(!powerValue)}/>
            <SelectField items={[{title: "main", value: "main"}, {title: "dop", value:"dop"}]} border className="select-bulb" value={curBulb} onChange={setCurBulb}/>
            <Range max={Number(brightness?.high) ?? 100} min={Number(brightness?.low) ?? 0} value={brightnessValue ?? undefined} onChange={e=>debouncedBrightnessSend(Number(e.target.value))}/>
            <Range styleTrack='point' max={Number(temp?.high) ?? 100} min={Number(temp?.low) ?? 0} value={tempVal ?? undefined} onChange={e=>debouncedTempSend(Number(e.target.value))} colorBg={kelvinCSSGradient(Number(temp?.high) ?? 10000, Number(temp?.low) ?? 2000)}/>
        </div>
    )
}
{/* {
    // return(
    //     <Panel>
    //         <Tabs tabs={[
    //             {
    //                 label: "main bulb", 
    //                 content:
    //                 <div className="base-bulb-panel">
    //                     <Typography type="body">name: {device.name}</Typography>
    //                     <Typography type="body">system_name: {device.system_name}</Typography>
    //                     <Bulb size={6} status={powerValue} onClick={()=>updateFieldState(!powerValue)}/>
    //                     <Tabs tabs={[
    //                         {
    //                             label: "temp",
    //                             content: <div>fg</div>
    //                         },
    //                         {
    //                             label: "color",
    //                             content: <div>color</div>
    //                         },
    //                         {
    //                             label: "other field",
    //                             content: <div>
    //                                 {
    //                                             (device.fields?.filter(item=>!usedFields.includes(item.id)).map((item, index)=>(
    //                                                 <DeviceField deviceName={device.system_name} field={item} key={index}/>
    //                                             )))
    //                                         }
    //                             </div>
    //                         }
    //                     ]}/>
    //                 </div>
    //             },{
    //                 label: "dop bulb",
    //                 content:
    //                 <>

    //                 </>
    //             }
    //         ]}/>
    //     </Panel>
        
    // )
} */}