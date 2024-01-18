import { useCallback } from "react"
import { TextButton } from "../.."
import { BasicTemplateDialog } from "../TemplateDialog/BasicTemplateDialog"

interface BaseDialogProps{
    text?: string
    header?: string
    actionText?: string
    onSuccess?: ()=>void
    onCancel?: ()=>void
    onHide?: ()=>void
}

interface BaseDialogButtonProps{
    actionText?: string
    onSuccess?: ()=>void
    onHide?: ()=>void
}

export const BaseDialog = ({text, header, actionText, onSuccess, onHide, onCancel}:BaseDialogProps) => {

    const Success = useCallback(() => {
        onSuccess && onSuccess()
        onHide && onHide()
    },[])

    const hide = useCallback(()=>{
        onCancel && onCancel()
        onHide && onHide()
    },[])

    return(
        <BasicTemplateDialog header={header} action={<BaseDialogButton onHide={hide} actionText={actionText} onSuccess={Success}/>}>
            <p>{text}</p>
        </BasicTemplateDialog>
    )
}

function BaseDialogButton({actionText, onSuccess, onHide}:BaseDialogButtonProps){
    return(
        <div className="dialog-button-container">
            <TextButton onClick={onHide}>cancel</TextButton>
            <TextButton onClick={onSuccess}>{actionText ?? "OK"}</TextButton>
        </div>
    )
}