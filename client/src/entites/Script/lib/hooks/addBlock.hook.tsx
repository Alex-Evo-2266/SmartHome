import { useCallback } from "react"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { hideDialog, showDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from "alex-evo-sh-ui-kit"
import { ScriptBlock, ScriptBlockType } from "../.."


export const useAddBlock = () => {
    const dispatch = useAppDispatch()

    const selectBlock = useCallback((callback:(data:string)=>void) => {
        dispatch(showDialog(<SelectionDialog header='Add block' onHide={()=>dispatch(hideDialog())} onSuccess={callback} items={[{title:"action", data:"action"}, {title:"condition", data:"condition"}]}/>))
    },[dispatch])

    const addBlock = useCallback((index:number, scriptBlocks: ScriptBlock[], callback: (data:ScriptBlock[])=>void) => {
        selectBlock((data)=>{
            let type = (data == "condition")? ScriptBlockType.CONDITION: ScriptBlockType.ACTION
            let first = scriptBlocks.slice(0, index)
            let last = scriptBlocks.slice(index)
            let newBlocks = [...first, {command:"", type}, ...last]
            callback(newBlocks)
        })
    },[selectBlock])

    return{
        addBlock
    }
}