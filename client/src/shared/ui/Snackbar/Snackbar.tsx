import { Snackbar as BaseSnackbar } from "alex-evo-sh-ui-kit"
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideSnackbar } from "../../lib/reducers/snackbarReducer"

export const Snackbar = () => {

    const snackbar = useAppSelector(state=>state.snackbar)
    const dispatch = useAppDispatch()

    const close = ()=>{
        dispatch(hideSnackbar())
    }

    return(<BaseSnackbar text={snackbar.text} visible={snackbar.visible} option={{...snackbar, onHide:close}}/>)
}