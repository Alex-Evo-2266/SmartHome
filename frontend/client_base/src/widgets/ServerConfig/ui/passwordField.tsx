import { TextDialog, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"

import { DialogPortal } from "../../../shared"


export interface PasswordFieldProps{
    value: string,
    name: string,
    tag: string,
    border?: boolean,
    onChange: (value: string, name: string)=>void
}

export const PasswordField = ({onChange, name, value, tag, border}:PasswordFieldProps) => {

    const [visibleDialog, setVisibleDialog] = useState(false)

    function getChars(count: number){
        return "*".repeat(count)
    }

    const editPass = () => {
        setVisibleDialog(true)
    }

    const saveNewPass = useCallback((data:string) => {
        onChange(data, name)
    },[name, onChange])

    const hide = () => {
        setVisibleDialog(false)
    }

    return(
        <>
        <div onClick={editPass}>
            <TextField border={border} readOnly type='password' name={name} value={getChars(Number(value))} placeholder={name}/>
        </div>
        {
            visibleDialog?
            <DialogPortal>
                <TextDialog header="Edit password field" text={`entred new password. ${tag} ${name}`} onSuccess={saveNewPass} onHide={hide}/>
            </DialogPortal> : null
        }
        </>
        
    )
}