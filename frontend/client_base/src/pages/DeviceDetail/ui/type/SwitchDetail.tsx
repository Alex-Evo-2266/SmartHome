import { ContentBox } from "alex-evo-sh-ui-kit"
import { useMemo } from "react"

import { DetailDeviceTemplate } from "./Temlate.DetailPage"
import { FieldHistory } from "../../../../entites/devices/models/history"
import { useGetBinaryField } from "../../../../features/Device"
import { useGetEnumField } from "../../../../features/Device/hooks/getField.hook"
import { Switch, SwitchBtnProps } from "../../../../shared/ui/Switch/Switch"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"
import { getFieldHistory } from "../../helpers/getFieldHistory"
import { useDeviceHistory } from "../../hooks/history.hook"
import { DeviceDetailProps } from "../../models/props"

import './SwitchDetail.scss'

const now = new Date();
const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

export const DetailDeviceSwitch:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    const {fieldValue: state1Value, updateFieldState: updateState1, field: state1} = useGetBinaryField(device, "state1")
    const {fieldValue: state2Value, updateFieldState: updateState2, field: state2} = useGetBinaryField(device, "state2")
    const {fieldValue: state3Value, updateFieldState: updateState3, field: state3} = useGetBinaryField(device, "state3")
    const {field: action, fieldValue: actionValue} = useGetEnumField(device, "action")

    const {history, loading} = useDeviceHistory(device.system_name, twentyFourHoursAgo.toISOString())

    const historyFields = useMemo<FieldHistory[]>(()=>!loading?[
        getFieldHistory(history, state1?.id ?? null),
        getFieldHistory(history, state2?.id ?? null),
        getFieldHistory(history, state3?.id ?? null),
    ].filter(item=>!!item):[],[history, state1, state2, state3, loading])

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

    const notuUsedField = useMemo(()=>device.fields?.filter(item=>!usedField.includes(item.id)) ?? [],[device.fields, usedField])

    return(
        <DetailDeviceTemplate 
            device={device} 
            onEdit={onEdit} 
            diagrams={historyFields} 
            imageControl={btns && btns.length > 0 && <Switch className="switch-image" btns={btns} size={6}/>}
        >
            <div className={`main-control`}>
                action: {actionValue}
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
        </DetailDeviceTemplate>
    )
}

