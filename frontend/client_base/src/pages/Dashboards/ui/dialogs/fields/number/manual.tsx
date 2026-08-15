import { WidgetStoreItemSettingsNumber } from "@src/entites/dashboard/types/typeData"
import { NumberField } from "alex-evo-sh-ui-kit"

export interface NumberManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string
    settings: WidgetStoreItemSettingsNumber
}

export const NumberManual = (props: NumberManualProps) => {

    return(
        <NumberField 
            border 
            onChange={props.onChange} 
            value={props.value} 
            name={props.settings.data_name} 
            ariaLabel={props.settings.lable} 
            placeholder={props.settings.lable}
        />
    )
}