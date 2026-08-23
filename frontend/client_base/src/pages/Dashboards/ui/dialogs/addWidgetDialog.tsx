import './widgetConfigDialog.scss'
import { WidgetConfigDialog } from "./baseDialogWidget"
import { WidgetChoiseDialog } from "./dialogWidgets"
import { WidgetSettingsDialog } from './settingsWidget'
import { IcreateRuntime } from '../../../../features/Dashboard/helpers/dashboardRegistary'
import { WidgetSchema } from 'alex-evo-web-constructor'

interface WidgetConfigDialogProps{
    onHide: ()=>void
    onSave: (data: WidgetSchema)=>void
    runtime: IcreateRuntime
}

export const AddWidgetgDialog = ({onHide, onSave, runtime}:WidgetConfigDialogProps) => {

    return(
        <WidgetConfigDialog runtime={runtime} onHide={onHide} onSave={onSave} steps={[{
            title: "cheise widget",
            component: WidgetChoiseDialog
        },{
            title: "settings",
            component: WidgetSettingsDialog
        }]}/>
    )   
}