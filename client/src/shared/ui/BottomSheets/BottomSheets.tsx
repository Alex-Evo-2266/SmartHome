import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideBottomSheets } from "../../lib/reducers/bottomSheetsReducer"
import {BottomSheetsUi} from 'alex-evo-sh-ui-kit'

export const BottomSheets = () => {

    const data = useAppSelector(state=>state.bottomSheets)
    const dispatch = useAppDispatch()

    const hide = () => {
        setTimeout(()=>{
            data.onHide && data.onHide()
            dispatch(hideBottomSheets())
        },200)
    }

    if(!data.visible)
        return null

    return(<BottomSheetsUi onHide={hide} visible={data.visible}>{data.children}</BottomSheetsUi>)
}