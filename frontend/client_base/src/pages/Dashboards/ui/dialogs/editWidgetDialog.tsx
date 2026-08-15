import './widgetConfigDialog.scss'
import { WidgetConfigDialog } from "./baseDialogWidget"
import { WidgetSettingsDialog } from './settingsWidget'
import { IcreateRuntime } from '../../helpers/dashboardRegistary'
import { WidgetSchema } from 'alex-evo-web-constructor'

interface WidgetConfigDialogProps{
    onHide: ()=>void
    onSave: (data: WidgetSchema)=>void
    runtime: IcreateRuntime
    data: WidgetSchema
}

export const EditWidgetgDialog = ({onHide, onSave, data, runtime}:WidgetConfigDialogProps) => {

    return(
        <WidgetConfigDialog runtime={runtime} data={data} onHide={onHide} onSave={onSave} steps={[{
            title: "settings",
            component: WidgetSettingsDialog
        }]}/>
    )   
}