import { FullScrinTemplateDialog } from '../../../shared/ui'
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