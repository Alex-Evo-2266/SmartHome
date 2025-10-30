import { ContentBox, Range } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo } from "react"

import { DetailDeviceTemplate } from "./Temlate.DetailPage"
import { FieldHistory } from "../../../../entites/devices/models/history"
import { useGetBinaryField, useGetNumberField } from "../../../../features/Device"
import { Bulb, useDebounce } from "../../../../shared"
import { kelvinCSSGradient } from "../../../../shared/lib/helpers/tempColor"
import ColorWheel from "../../../../shared/ui/Color/Palitra"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { getFieldHistory } from "../../helpers/getFieldHistory"
import { useDeviceHistory } from "../../hooks/history.hook"
import { DeviceDetailProps } from "../../models/props"

import './LightDetail.scss'

const now = new Date();
const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

export const DetailDeviceLight:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    const {fieldValue: powerValue, updateFieldState: updateFieldPower, field: power} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue, updateFieldState: updateFieldBrightness, field: brightness} = useGetNumberField(device, "brightness")
    const {fieldValue: tempVal, updateFieldState: updateTemp, field: temp} = useGetNumberField(device, "temp")
    const {fieldValue: colorVal, updateFieldState: updateColor, field: color} = useGetNumberField(device, "color")
    const {fieldValue: satVal, updateFieldState: updateSat, field: sat} = useGetNumberField(device, "sat")

    const debouncedBrightnessSend = useDebounce(updateFieldBrightness, 300)
    const debouncedTempSend = useDebounce(updateTemp, 300)

    const {history, loading} = useDeviceHistory(device.system_name, twentyFourHoursAgo.toISOString())

    const historyFields = useMemo<FieldHistory[]>(()=>!loading?[
        getFieldHistory(history, power?.id ?? null),
        getFieldHistory(history, power?.id ?? null),
        getFieldHistory(history, power?.id ?? null),
    ].filter(item=>!!item):[],[history, power, loading])

    console.log(historyFields)

    const usedField = useMemo(()=>{
        const field = [
            power?.id,
            brightness?.id,
            temp?.id
        ].
        filter(item=>item !== null && item !== undefined)
        if(color && sat){
            field.push(color.id)
            field.push(sat.id)
        }
        return field
    },[power, brightness, temp, color, sat]
    )

    const notuUsedField = useMemo(()=>device.fields?.filter(item=>!usedField.includes(item.id)) ?? [],[device.fields, usedField])

    const setColor = useCallback((color: string, sat: string)=>{
        updateColor(Number(color))
        updateSat(Number(sat))
    },[updateColor, updateSat])

    return(
        <DetailDeviceTemplate 
            device={device} 
            onEdit={onEdit} 
            diagrams={historyFields} 
            imageControl={<Bulb className="lamp-image" size={6} status={!!powerValue} onClick={()=>updateFieldPower(!powerValue)}/>}
        >
                <div className={`main-control`}>
                    {
                        brightness && 
                        <div className="range-light-container">
                            <Range 
                            className="range-light" 
                            strokeWidth="50px" 
                            max={brightness?.high != null ? Number(brightness.high) : 100}
                            min={brightness?.low != null ? Number(brightness.low) : 0}
                            value={brightnessValue ?? undefined} 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>debouncedBrightnessSend(Number(e.target.value))}
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
                            max={temp?.high != null ? Number(temp.high) : 100}
                            min={temp?.low != null ? Number(temp.low) : 0}
                            value={tempVal ?? undefined} 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>debouncedTempSend(Number(e.target.value))} 
                            colorBg={
                                kelvinCSSGradient(
                                    temp?.high != null ? Number(temp?.high) : 10000, 
                                    temp?.low != null ? Number(temp?.low) : 2000, 10, "to right")}
                            />
                        </div>
                    }
                    {
                        color && sat && 
                        <div className="color-container">
                            <ColorWheel color={colorVal?.toString() ?? "0"} sat={satVal?.toString() ?? "0"} onChange={setColor}/>
                        </div>
                    }
                </div>
                {
                    notuUsedField.length > 0 && 
                    <ContentBox label="other" collapsible defaultVisible>
                        {
                            notuUsedField.map((item, index)=>(
                                <DeviceField deviceName={device.system_name} field={item} key={`${device.system_name}-field-${index}`}/>
                            ))
                        }
                    </ContentBox>
                }
        </DetailDeviceTemplate>
    )
}

