import { WidgetStoreItemSettingsBinary } from "@src/entites/dashboard/types/typeData"
import { SelectField } from "@src/shared"
import { useCallback } from "react"

export interface BinaryManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string
    settings: WidgetStoreItemSettingsBinary
}

export const BooleanManual = (props: BinaryManualProps) => {

    const changeHandler = useCallback((value: string) => {
        props.onChange(value === "true", props.settings.data_name)
    },[props.settings.data_name, props.onChange])

    return(
        <SelectField 
            border 
            onChange={changeHandler} 
            value={props.value} 
            name={props.settings.data_name} 
            items={[{
                title: "true",
                value: "true"
            },{
                title: "false",
                value: "false"
            }]}
            placeholder={props.settings.lable}
        />
    )
}