import { useCallback } from "react"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { hideDialog, showDialog } from "../../../../shared/lib/reducers/dialogReducer"
import { SelectionDialog } from "../../../../shared/ui/Dialog/BaseDialog/SelectionDialog"
import { ScriptBlock, ScriptBlockType } from "../../../../entites/Script"


export const useAddBlock = () => {
    const dispatch = useAppDispatch()

    const selectBlock = useCallback((callback:(data:string)=>void) => {
        dispatch(showDialog(<SelectionDialog header='Add block' onHide={()=>dispatch(hideDialog())} onSuccess={callback} items={[{title:"action", data:"action"}, {title:"condition", data:"condition"}]}/>))
    },[dispatch])

    const _addBlock = (indexes:number[], blocks: ScriptBlock[], newData: ScriptBlock)=>{
        if (indexes.length == 1)
        {
            let first = blocks.slice(0, indexes[0])
            let last = blocks.slice(indexes[0])
            return [...first, newData, ...last]
        }
        else if(indexes.length >= 3 && indexes[1] == 1)
        {
            let _blocks = blocks[indexes[0]].branch1 ?? []
            blocks[indexes[0]].branch1 = _addBlock(indexes.slice(2), _blocks, newData)
            return blocks
        }
        else if(indexes.length >= 3 && indexes[1] == 2)
        {
            let _blocks = blocks[indexes[0]].branch2 ?? []
            blocks[indexes[0]].branch2 = _addBlock(indexes.slice(2), _blocks, newData)
            return blocks
        }
        else
            return blocks
    }

    const addBlock = useCallback((indexes:number[], scriptBlocks: ScriptBlock[], callback: (data:ScriptBlock[])=>void) => {
        console.log(indexes)
        selectBlock((data)=>{
            let type = (data == "condition")? ScriptBlockType.CONDITION: ScriptBlockType.ACTION
            let newBlocks = _addBlock(indexes, scriptBlocks, {command:"", type})
            callback(newBlocks)
        })
    },[selectBlock])

    return{
        addBlock
    }
}