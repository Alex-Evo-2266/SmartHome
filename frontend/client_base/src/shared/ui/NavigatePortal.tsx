import { ModalPortal } from "alex-evo-sh-ui-kit"

export interface DialogPortalProps{
    children: React.ReactNode
}

export const NavigatePortal:React.FC<DialogPortalProps> = ({children}) => {
    return(
        <ModalPortal container={document.getElementById("nav-root")}>
            {children}
        </ModalPortal>
    )
}