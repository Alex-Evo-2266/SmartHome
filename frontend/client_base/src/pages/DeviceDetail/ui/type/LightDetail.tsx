import { ArrowLeft, ContentBox, IconButton, Range, ScreenSize, SizeContext, Typography } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import { DeviceDetailProps } from "../../models/props"
import { Bulb, getCurrentDateTime, useDebounce } from "../../../../shared"
import './LightDetail.scss'
import { useGetBinaryField, useGetNumberField } from "../../../../features/Device/hooks/getField.hook"
import { useCallback, useContext, useMemo } from "react"
import { kelvinCSSGradient } from "../../../../shared/lib/helpers/tempColor"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { MenuDeviceCard } from "../MenuDeviceCard"
import ColorWheel from "../../../../shared/ui/Color/Palitra";
import { useDeviceHistory } from "../../hooks/history.hook";
import { getFieldHistory } from "../../helpers/getFieldHistory";
import { Diagramm } from "../diagrams";
import { Loading } from "../../../../shared/ui/Loading";

const classNamePostfix = {
    [ScreenSize.MOBILE]: "min",
    [ScreenSize.STANDART]: "base",
    [ScreenSize.BIG_SCREEN]: "big"
}

const now = new Date();
const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
// now.toUTCString

export const DetailDeviceLight:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    const {fieldValue: powerValue, updateFieldState: updateFieldPower, field: power} = useGetBinaryField(device, "power")
    const {fieldValue: brightnessValue, updateFieldState: updateFieldBrightness, field: brightness} = useGetNumberField(device, "brightness")
    const {fieldValue: tempVal, updateFieldState: updateTemp, field: temp} = useGetNumberField(device, "temp")
    const {fieldValue: colorVal, updateFieldState: updateColor, field: color} = useGetNumberField(device, "color")
    const {fieldValue: satVal, updateFieldState: updateSat, field: sat} = useGetNumberField(device, "sat")
    
    const {history, loading} = useDeviceHistory(device.system_name, twentyFourHoursAgo.toISOString())

    const navigate = useNavigate();

    const debouncedBrightnessSend = useDebounce(updateFieldBrightness, 300)
    const debouncedTempSend = useDebounce(updateTemp, 300)

    const {screen} = useContext(SizeContext)

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
    },[power, brightness, temp]
    )

    const notuUsedField = useMemo(()=>device.fields?.filter(item=>!usedField.includes(item.id)) ?? [],[device.fields, usedField])

    const setColor = useCallback((color: string, sat: string)=>{
        updateColor(Number(color))
        updateSat(Number(sat))
    },[updateColor, updateSat])

    return (
        <div className={`light-detail-page container-page light-detail-page--${classNamePostfix[screen]}`}>
            <div className="detail-content">
                {
                    loading?
                    <Loading/>:
                    <>
                        <Diagramm data={getFieldHistory(history, power?.id ?? null)}/>
                        <Diagramm data={getFieldHistory(history, brightness?.id ?? null)}/>
                        <Diagramm data={getFieldHistory(history, temp?.id ?? null)}/>
                    </>
                }
            </div>
            <div className="mobile-content detail-content">
                {/* <SelectField items={[{title: "main", value: "main"}, {title: "dop", value:"dop"}]} border className="select-bulb" value={curBulb} onChange={setCurBulb}/> */}
                <IconButton onClick={()=>navigate("/device")} className="light-detail-back" icon={<ArrowLeft/>} transparent/>
                <div className="header-container">
                    <div className="image-container">
                        <Bulb className="lamp-image" size={6} status={!!powerValue} onClick={()=>updateFieldPower(!powerValue)}/>
                    </div>
                </div>
                <Typography className="light-detail-name" type='heading'>{device.name}</Typography>
                <Typography className="light-detail-name" type='body'>{device.system_name}</Typography>
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
                
            </div>
            <div className="detail-content">

            </div>
            <MenuDeviceCard status={device.status} system_name={device.system_name} name={device.name} onEdit={onEdit}/>
        </div>
    )
}
