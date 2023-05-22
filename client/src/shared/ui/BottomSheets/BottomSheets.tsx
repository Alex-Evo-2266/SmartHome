import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideBottomSheets } from "../../lib/reducers/bottomSheetsReducer"
import "./BottomSheets.scss"

export const BottomSheets = () => {

    const data = useAppSelector(state=>state.bottomSheets)
    const dispatch = useAppDispatch()
    const [hided, setHided] = useState<boolean>(false)

    const hide = () => {
        setHided(true)
        setTimeout(()=>{
            dispatch(hideBottomSheets())
            setHided(false)
        },200)
    }

    if(!data.visible)
        return null

    return(
        <>
        <div className={`bottom-sheets ${hided?"hide":""}`}>
            <div className="bottom-sheets-handle"><span></span></div>
            <div className="bottom-sheets-content">
                {data.children}
            </div>
        </div>
        <div className="backplate bottom-sheets-backplate" style={{zIndex:500}} onClick={hide}></div>
        </>
    )
}