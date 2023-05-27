import { X } from "lucide-react"
import { TextButton } from ".."
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideSnackbar } from "../../lib/reducers/snackbarReducer"
import "./Snackbar.scss"

export const Snackbar = () => {

    const snackbar = useAppSelector(state=>state.snackbar)
    const dispatch = useAppDispatch()

    const close = ()=>{
        dispatch(hideSnackbar())
    }

    if(!snackbar.visible)
        return null

    return(
        <div className={`snackbar-container ${snackbar.option?.className}`} style={{backgroundColor: snackbar.option?.backgroundColor, color: snackbar.option?.color}}>
            <div className="snackbar-content-container">
                <div className="snackbar-text">
                    {snackbar.text}
                </div>
                {
                    (snackbar.option?.onClick)?
                    <div className="snackbar-button-container">
                        <TextButton className="snackbar-btn" onClick={snackbar.option.onClick}>{snackbar.option.buttonText ?? "Action"}</TextButton>
                    </div>:
                    null
                }
            </div>
            {
                (snackbar.option?.closeButton)?
                <div className="snackbar-close">
                    <span onClick={close}><X/></span>
                </div>:
                null
            }
        </div>
    )
}