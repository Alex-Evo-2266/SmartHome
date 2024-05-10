import { FullScrinTemplateDialog } from "alex-evo-sh-ui-kit"
import './EditScriptBlockDialog.scss'

interface EditScriptActionBlockDialogProps{
    onHide: ()=>void
    onSave: (data:any)=>void
}

export const EditScriptActionBlockDialog = ({onHide, onSave}:EditScriptActionBlockDialogProps) => {

    return(
        <FullScrinTemplateDialog header='Edit action block' onHide={onHide} onSave={onSave}>
            <div>

            </div>
        </FullScrinTemplateDialog>
    )
}