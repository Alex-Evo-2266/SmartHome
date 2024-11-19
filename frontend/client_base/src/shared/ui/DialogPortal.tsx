import { DialogModal } from "alex-evo-sh-ui-kit"

export interface DialogPortalProps{
    children: React.ReactNode
}

export const DialogPortal:React.FC<DialogPortalProps> = ({children}) => {
    return(
        <DialogModal container={document.getElementById("modal-root")}>
            {children}
        </DialogModal>
    )
}