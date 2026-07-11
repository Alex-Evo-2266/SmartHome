import './widgetConfigDialog.scss'
import { WidgetConfigDialog } from "./baseDialogWidget"
import { WidgetChoiseDialog } from "./dialogWidgets"

interface WidgetConfigDialogProps{
    onHide: ()=>void
}

export const AddWidgetgDialog = ({onHide}:WidgetConfigDialogProps) => {

    return(
        <WidgetConfigDialog onHide={onHide} steps={[{
            title: "cheise widget",
            component: WidgetChoiseDialog
        }]}/>
    )   
}