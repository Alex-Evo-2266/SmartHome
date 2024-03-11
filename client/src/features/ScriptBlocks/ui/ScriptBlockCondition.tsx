import { GitFork } from "lucide-react"
import { ScriptBlock, ScriptBlockType } from "../../../entites/Script"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"
import './ScriptBlock.scss'
import { ScriptAddBlock } from "./AddBlock"
import { useAddBlock } from "../../../entites/Script/lib/hooks/addBlock.hook"
import { useLinesСanvas } from "../../../entites/Script"
import { Fragment, useCallback, useEffect, useRef } from "react"
import { ScriptBlockAction } from "./ScriptBlockAction"
import { PointPoz } from "../../../entites/Script/lib/hooks/Lines"

interface ScriptBlockConditionProps{
    data: ScriptBlock
    style?: React.CSSProperties
    className?: string
    edit: (data: ScriptBlock)=>void
}

export enum Branch{
    BRANCH1 = "branch1",
    BRANCH2 = "branch2"
}


export const ScriptBlockCondition = ({data, style, className, edit}:ScriptBlockConditionProps) => {

    const { addBlock } = useAddBlock()
    const Canvas1 = useLinesСanvas({beginPointPoz: PointPoz.RIGHT, text: "no", endPointPoz: PointPoz.RIGHT})
    const Canvas2 = useLinesСanvas({beginPointPoz: PointPoz.LEFT, text: "yes", endPointPoz: PointPoz.LEFT})
    const container1 = useRef<HTMLDivElement>(null)
    const container2 = useRef<HTMLDivElement>(null)

    const addBlockHandler = useCallback((branch:Branch, index: number) => {
        addBlock(index, data[branch] || [], newBlocks=>{
            edit({...data, [branch]: newBlocks})
        })
    },[useCallback, addBlock, data])

    const editHandler = useCallback(() => {

    },[])

    const editBlockHandler = useCallback((index:number, branch:Branch, data: ScriptBlock) => {
        let arr = (data[branch] ?? []).slice()
        arr[index] = data
        edit({...data, [branch]: arr})
    },[edit, data])

    useEffect(()=>{
        if(container1.current)
            Canvas1.update(container1.current)
    },[container1.current, data])

    useEffect(()=>{
        if(container2.current)
            Canvas2.update(container2.current)
    },[container2.current, data])

    return(
        <>
            <ScriptItem edit={editHandler} type="condition" title={data.command} icon={<GitFork style={{transform: "rotate(180deg)"}}/>} style={style} className={className}/>
            <div className="script-constrictor-condition-container" data-type={"condition-container"}>
                <div className="script-constrictor-condition-container-branch-container">
                    <div ref={container1} className="script-constrictor-condition-container-branch">
                        <ScriptAddBlock onClick={(index)=>addBlockHandler(Branch.BRANCH1, index)} index={0} />
                        {
                            (data.branch1 ?? []).map((item, index)=>{
                                if(item.type == ScriptBlockType.ACTION)
                                    return(
                                    <Fragment key={index}>
                                        <ScriptBlockAction data={{...item}}/>
                                        <ScriptAddBlock onClick={(index2)=>addBlockHandler(Branch.BRANCH1, index2)} index={index + 1} />
                                    </Fragment>
                                    )
                                else if(item.type == ScriptBlockType.CONDITION)
                                    return(
                                    <Fragment key={index}>
                                        <ScriptBlockCondition edit={newData=>editBlockHandler(index, Branch.BRANCH1, newData)} data={{...item}}/>
                                        <ScriptAddBlock onClick={(index2)=>addBlockHandler(Branch.BRANCH1, index2)} index={index + 1} />
                                    </Fragment>
                                    )
                            })
                        }
                    </div>
                    <Canvas1.Canvas/>
                </div>
                <div className="script-constrictor-condition-container-branch-container">
                    <div ref={container2} className="script-constrictor-condition-container-branch">
                        <ScriptAddBlock onClick={(index)=>addBlockHandler(Branch.BRANCH2, index)} index={0} />
                        {
                            (data.branch2 ?? []).map((item, index)=>{
                                if(item.type == ScriptBlockType.ACTION)
                                    return(
                                    <Fragment key={index}>
                                        <ScriptBlockAction data={{...item}}/>
                                        <ScriptAddBlock onClick={(index2)=>addBlockHandler(Branch.BRANCH2, index2)} index={index + 1} />
                                    </Fragment>
                                    )
                                else if(item.type == ScriptBlockType.CONDITION)
                                    return(
                                    <Fragment key={index}>
                                        <ScriptBlockCondition edit={newData=>editBlockHandler(index, Branch.BRANCH2, newData)} data={{...item}}/>
                                        <ScriptAddBlock onClick={(index2)=>addBlockHandler(Branch.BRANCH2, index2)} index={index + 1} />
                                    </Fragment>
                                    )
                            })
                        }
                    </div>
                    <Canvas2.Canvas/>
                </div>
            </div>
        </>
    )
}
