import { WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { TypeDeviceField } from "@src/entites/devices"
import { SelectField } from "@src/shared"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { ContentBox, Typography } from "alex-evo-sh-ui-kit"
import { useMemo, useState } from "react"

export interface DeviceSelectProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string
    settings: WidgetStoreItemSettings
    types: TypeDeviceField[]
}

export const DeviceSelectField = (props: DeviceSelectProps) => {

    const { devicesData } = useAppSelector((state) => state.devices);
    const devicesDataText = useMemo(()=>
        devicesData.filter(item=>
            (item.fields?.some(item2=>
                props.types.includes(item2.type)
            ) ?? false)
        ),
        [devicesData, props.types]
    )
    const [selectDevice, setSelectDevice] = useState<string | null>(null)
    const filterFields = useMemo(()=>{
        const curDevice = devicesData.find(item=>item.system_name === selectDevice)
        return curDevice?.fields?.filter(item=>props.types.includes(item.type)) ?? []
    },[devicesData, selectDevice, props.types])
    const [selectField, setSelectField] = useState<string | null>(null)


    return(
        <ContentBox label={props.settings.lable}>
            <Typography type="small">select device field</Typography>
            <SelectField 
                border 
                placeholder="devices"
                items={devicesDataText.map(item=>({title:item.name, value:item.system_name}))}
                onChange={setSelectDevice}
                value={selectDevice ?? ""}
            />
            {
                selectDevice &&
                <SelectField 
                    border 
                    placeholder="field"
                    items={filterFields.map(item=>({title:item.name, value:item.id}))}
                    onChange={setSelectField}
                    value={selectField ?? ""}
                />
            }
        </ContentBox>
    )
}