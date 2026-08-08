import { WidgetStoreItemSettingsText } from "@src/entites/dashboard/types/typeData"
import { TextField } from "alex-evo-sh-ui-kit"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string
    settings: WidgetStoreItemSettingsText
}

export const TextManual = (props: TextManualProps) => {

    return(
        <TextField 
            border 
            onChange={props.onChange} 
            value={props.value} 
            name={props.settings.data_name} 
            ariaLabel={props.settings.lable} 
            placeholder={props.settings.lable}
        />
    )
}