import { useCallback, useState } from "react"
import { BasicTemplateDialog } from "../TemplateDialog/BasicTemplateDialog"
import { TextField } from "../../TextField/TextField"
import { TextButton } from "../../Button/Button"

interface BaseDialogProps{
    text?: string
    header?: string
    onSuccess?: (data: string)=>void
    onHide?: ()=>void
    placeholder?: string
}

interface BaseDialogButtonProps{
    onSuccess?: ()=>void
    onHide?: ()=>void
}

export const TextDialog = ({text, header, onSuccess, onHide, placeholder}:BaseDialogProps) => {

    const [value, setValue] = useState<string>("")

    const Success = useCallback(() => {
        onSuccess && onSuccess(value)
        onHide && onHide()
    },[value])

    return(
        <BasicTemplateDialog header={header} action={<TextDialogButton onHide={onHide} onSuccess={Success}/>}>
            <p>{text}</p>
            <div className="dialog-input-container">
                <TextField border placeholder={placeholder} value={value} onChange={(e)=>setValue(e.target.value)}/>
            </div>
        </BasicTemplateDialog>
    )
}

function TextDialogButton({onSuccess, onHide}:BaseDialogButtonProps){
    return(
        <div className="dialog-button-container">
            <TextButton onClick={onHide}>cancel</TextButton>
            <TextButton onClick={onSuccess}>OK</TextButton>
        </div>
    )
}