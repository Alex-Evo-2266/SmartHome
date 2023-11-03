import { useAppSelector } from "../shared/lib/hooks/redux"


export const RootDialog = () => {

    const dialog = useAppSelector(state => state.dialog)

    return(
        <>
        {
            dialog.fullScreenDialog.map((item, index, arr)=>(
                <div key={index} style={{display: (arr.length - 1 === index)?"block":"none"}}>
                    {item}
                </div>
            ))
        }
        {
            dialog.baseDialog.map((item, index, arr)=>(
                <div key={index} style={{display: (arr.length - 1 === index)?"block":"none"}}>
                    {item}
                </div>
            ))
        }
        </>
    )
}