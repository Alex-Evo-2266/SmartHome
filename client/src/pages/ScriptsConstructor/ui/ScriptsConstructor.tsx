import './ScriptsConstructor.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Script, ScriptBlockType, getCordsBlock, getHeight, widthContainerCalculate } from '../../../entites/Script'
import { ScriptStartBlock } from '../../../features/ScriptBlocks/ui/ScriptStartBlock'
import { ScriptBlockAction } from '../../../features/ScriptBlocks/ui/ScriptBlockAction'
import { ScriptBlockCondition } from '../../../features/ScriptBlocks/ui/ScriptBlockCondition'
import { HEIGHT, MARGIN, WIDTH } from '../../../entites/Script/models/const'
import { ScriptBlock, ScriptConstructorBlock } from '../../../entites/Script/models/script'
import { ScriptAddBlock } from '../../../features/ScriptBlocks/ui/AddBlock'
import { connectLine } from '../../../shared/lib/helpers/canvasLine'
import { useDispatch } from 'react-redux'
import { SelectionDialog } from '../../../shared/ui/Dialog/BaseDialog/SelectionDialog'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { BigContainer, FAB } from '../../../shared/ui'
import { Home } from 'lucide-react'
import { IPoint } from '../../../shared/model/point'

const defblocks = [{
    command:'',
    type: ScriptBlockType.ACTION
},
{
    command:'',
    type: ScriptBlockType.CONDITION,
    branch1: [
        {
            command:'',
            type: ScriptBlockType.ACTION
        }
    ]
},
{
    command:'',
    type: ScriptBlockType.CONDITION,
    branch1: [
        {
            command:'',
            type: ScriptBlockType.ACTION
        }
    ],
    branch2: [
        {
            command:'',
            type: ScriptBlockType.CONDITION,
            branch2: [
                {
                    command:'',
                    type: ScriptBlockType.ACTION
                }
            ]
        }
    ]
}]

export const ScriptsConstructorPage = () => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const container = useRef<HTMLDivElement>(null)
    const [scriptBlocks, setScriptBlocks] = useState<ScriptConstructorBlock[]>([])
    const [move, setMove] = useState<IPoint>({x:0, y:0})
    const [script, setScript] = useState<Script>({
        blocks:[],
        system_name:"",
        name:""
    })
    const dispatch = useDispatch()

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
        else if(indexes.length >= 3 && indexes[1] == 1){
            let _blocks = blocks[indexes[0]].branch1 ?? []
            console.log(blocks)
            blocks[indexes[0]].branch1 = _addBlock(indexes.slice(2), _blocks, newData)
            console.log(blocks)
            return blocks
        }
        else if(indexes.length >= 3 && indexes[1] == 2){
            let _blocks = blocks[indexes[0]].branch2 ?? []
            console.log(blocks)
            blocks[indexes[0]].branch2 = _addBlock(indexes.slice(2), _blocks, newData)
            console.log(blocks)
            return blocks
        }
        else
            return blocks
    }

    const addBlock = useCallback((indexes:number[]) => {
        console.log(indexes)
        selectBlock((data)=>{
            let type = (data == "condition")?ScriptBlockType.CONDITION:ScriptBlockType.ACTION
            let newBlocks = _addBlock(indexes, script.blocks, {command:"", type})
            setScript(prev=>{
                return {...prev, blocks:newBlocks}
            })
        })
    },[selectBlock, script])

    const clear = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const moveHome = useCallback(()=>{
        setMove({x:widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), y:50})
    },[script])

    const getCords = useCallback((ctx:CanvasRenderingContext2D)=>{
        let scriptBlocks:ScriptConstructorBlock[] = [{
            command: "start",
            type: ScriptBlockType.START,
            x: widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2),
            y: 50
        },{
            command: JSON.stringify([0]),
            type: ScriptBlockType.ADD_BLOCK,
            x: widthContainerCalculate(script.blocks) / 2 - 20,
            y: 50 + HEIGHT + MARGIN
        }]
        connectLine(ctx, {x:widthContainerCalculate(script.blocks) / 2, y: 50}, {x:widthContainerCalculate(script.blocks) / 2, y: 50 + HEIGHT + MARGIN})
        scriptBlocks = [...scriptBlocks, ...getCordsBlock(script.blocks, widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), 50 + (HEIGHT + MARGIN)*2, ctx)]
        setScriptBlocks(scriptBlocks)
    },[script, canvas.current])

    useEffect(()=>{
        let ctx = canvas.current?.getContext('2d')
        if(!ctx)
            return
        getCords(ctx)
        return ()=>{
            if(!ctx || !canvas.current)
                return
            clear(ctx, canvas.current)
        }
    },[getCords, canvas.current])

    useEffect(()=>{
        console.log(widthContainerCalculate(script.blocks))
        console.log(script.blocks)
    },[script.blocks])

    return(
        <BigContainer id="scripts-constructor-page" pozMove={move}>
            <canvas 
                height={(HEIGHT + MARGIN) * getHeight(script.blocks)} 
                width={widthContainerCalculate(script.blocks) < 10000?10000:widthContainerCalculate(script.blocks)} 
                ref={canvas} 
                id='scripts-constructor-canvas' 
                style={{width: widthContainerCalculate(script.blocks), height: `${(HEIGHT + MARGIN) * getHeight(script.blocks)}px`, minWidth: "10000px", minHeight:"1000"}}
            />
            <div ref={container} 
                id='scripts-constructor-container' 
                style={{width: `${widthContainerCalculate(script.blocks)}px`, height: `${(HEIGHT + MARGIN) * getHeight(script.blocks)}px`, minWidth: "10000px"}}
            >
            {
                scriptBlocks.map((item, index)=>{
                    if(item.type == ScriptBlockType.START)
                        return(<ScriptStartBlock key={index} style={{left: item.x, top: item.y}}/>)
                    else if(item.type == ScriptBlockType.ACTION)
                        return(<ScriptBlockAction data={{...item}} key={index} style={{left: item.x, top: item.y}}/>)
                    else if(item.type == ScriptBlockType.CONDITION)
                        return(<ScriptBlockCondition data={{...item}} key={index} style={{left: item.x, top: item.y}}/>)
                    else if(item.type == ScriptBlockType.ADD_BLOCK)
                        return(<ScriptAddBlock key={index} onClick={addBlock} index={JSON.parse(item.command)} style={{left: item.x, top: item.y}}/>)
                })
            }
            </div>
            <FAB icon={<Home/>} onClick={moveHome}></FAB>
        </BigContainer>
    )
}