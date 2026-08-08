import './widgetConfigDialog.scss'
import { WidgetConfigDialog } from "./baseDialogWidget"
import { WidgetChoiseDialog } from "./dialogWidgets"
import { WidgetSettingsDialog } from './settingsWidget'
import { IcreateRuntime } from '../../helpers/dashboardRegistary'

interface WidgetConfigDialogProps{
    onHide: ()=>void
    runtime: IcreateRuntime
}

export const AddWidgetgDialog = ({onHide, runtime}:WidgetConfigDialogProps) => {

    return(
        <WidgetConfigDialog runtime={runtime} onHide={onHide} steps={[{
            title: "cheise widget",
            component: WidgetChoiseDialog
        },{
            title: "settings",
            component: WidgetSettingsDialog
        }]}/>
    )   
}