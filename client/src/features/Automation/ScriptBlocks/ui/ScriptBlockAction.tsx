import { ArrowRight } from "lucide-react"
import { ScriptBlock } from "../../../../entites/Script"
import { ScriptItem } from "../../../../entites/Script/ui/ScriptItem"
import { useCallback } from "react"
import { IMenuItem } from "alex-evo-sh-ui-kit"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { hideMenu } from "../../../../shared/lib/reducers/menuReducer"
import { hideFullScreenDialog, showFullScreenDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { EditActionBlockDialog } from "./EditActionBlockDialog"

interface ScriptBlockActionProps{
    data: ScriptBlock
    style?: React.CSSProperties
    className?: string
    edit: (data: ScriptBlock)=>void
    del: ()=>void
}

export const ScriptBlockAction = ({data, style, className, edit, del}:ScriptBlockActionProps) => {

    const dispatch = useAppDispatch()

    const editHandler = useCallback(() => {
        dispatch(showFullScreenDialog(<EditActionBlockDialog data={data.command} onSave={(command)=>{
            edit({...data, command: command})
            dispatch(hideFullScreenDialog())
        }}/>))
    },[dispatch, data, edit])

    const getMenu = useCallback(():IMenuItem[] => {
        let menu:IMenuItem[] = []
        menu.push({title: "edit", onClick: ()=>{
            editHandler()
            dispatch(hideMenu())
        }})
        menu.push({title: "delete", onClick: ()=>{
            del()
            dispatch(hideMenu())
        }})
        return menu
    },[edit, del, editHandler])

    return(
        <ScriptItem menuItem={getMenu()} type="action" title={"action"} icon={<ArrowRight/>} style={style} className={className}>
        </ScriptItem>
    )
}