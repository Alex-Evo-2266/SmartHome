import { ModalPortal } from "alex-evo-sh-ui-kit"

export interface DialogPortalProps{
    children: React.ReactNode
}

export const DialogPortal:React.FC<DialogPortalProps> = ({children}) => {
    return(
        <ModalPortal container={document.getElementById("modal-root")}>
            {children}
        </ModalPortal>
    )
}