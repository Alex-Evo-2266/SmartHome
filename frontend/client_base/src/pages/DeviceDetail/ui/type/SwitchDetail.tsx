import { ArrowLeft, ContentBox, IconButton, ScreenSize, SizeContext, Typography } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import { DeviceDetailProps } from "../../models/props"
import './LightDetail.scss'
import { useGetBinaryField, useGetNumberField } from "../../../../features/Device/hooks/getField.hook"
import { useContext, useMemo } from "react"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { MenuDeviceCard } from "../MenuDeviceCard"
import { useDeviceHistory } from "../../hooks/history.hook";
import { getFieldHistory } from "../../helpers/getFieldHistory";
import { Diagramm } from "../diagrams";
import { Loading } from "../../../../shared/ui/Loading";
import { Switch, SwitchBtnProps } from "../../../../shared/ui/Switch/Switch";

const classNamePostfix = {
    [ScreenSize.MOBILE]: "min",
    [ScreenSize.STANDART]: "base",
    [ScreenSize.BIG_SCREEN]: "big"
}

const now = new Date();
const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
// now.toUTCString

export const DetailDeviceSwitch:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    const {fieldValue: state1Value, updateFieldState: updateState1, field: state1} = useGetBinaryField(device, "state1")
    const {fieldValue: state2Value, updateFieldState: updateState2, field: state2} = useGetBinaryField(device, "state2")
    const {fieldValue: state3Value, updateFieldState: updateState3, field: state3} = useGetBinaryField(device, "state3")
    const {fieldValue: actionValue, field: action} = useGetNumberField(device, "action")
    
    const {history, loading} = useDeviceHistory(device.system_name, twentyFourHoursAgo.toISOString())

    const navigate = useNavigate();

    const {screen} = useContext(SizeContext)

    const usedField = useMemo(()=>{
        const field = [
            state1?.id,
            state2?.id,
            state3?.id,
            action?.id,
        ].
        filter(item=>item !== null && item !== undefined)
        return field
    },[state1, state2, state3, action]
    )

    const notuUsedField = useMemo(()=>device.fields?.filter(item=>!usedField.includes(item.id)) ?? [],[device.fields, usedField])

    const btns = useMemo<SwitchBtnProps[]>(()=>{
        const btnArr: SwitchBtnProps[] = []
        if(state1Value !== null)
            btnArr.push({value: state1Value, onChange: updateState1, name: "state1"})
        if(state2Value !== null)
            btnArr.push({value: state2Value, onChange: updateState2, name: "state2"})
        if(state3Value !== null)
            btnArr.push({value: state3Value, onChange: updateState3, name: "state3"})
        return btnArr
    },[state1Value, updateState1, state2Value, updateState2, state3Value, updateState3])

    return (
        <div className={`light-detail-page container-page light-detail-page--${classNamePostfix[screen]}`}>
            <div className="detail-content">
                {
                    loading?
                    <Loading/>:
                    <>
                        <Diagramm data={getFieldHistory(history, state1?.id ?? null)}/>
                        <Diagramm data={getFieldHistory(history, action?.id ?? null)}/>
                    </>
                }
            </div>
            <div className="mobile-content detail-content">
                <IconButton onClick={()=>navigate("/device")} className="light-detail-back" icon={<ArrowLeft/>} transparent/>
                <div className="header-container">
                    <div className="image-container">
                        {
                        btns && btns.length > 0 &&
                            <Switch className="switch-image" btns={btns} size={6}/>
                        } 
                    </div>
                </div>
                <Typography className="light-detail-name" type='heading'>{device.name}</Typography>
                <Typography className="light-detail-name" type='body'>{device.system_name}</Typography>
                <div className={`main-control ${screen === ScreenSize.MOBILE? "coll": ""}`}>

                </div>
                {
                    notuUsedField && notuUsedField.length > 0 && 
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
