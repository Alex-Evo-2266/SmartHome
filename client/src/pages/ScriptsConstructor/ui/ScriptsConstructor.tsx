import './ScriptsConstructor.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Script, ScriptBlockType, getCordsBlock, getHeight, widthContainerCalculate } from '../../../entites/Script'
import { ScriptStartBlock } from '../../../features/ScriptBlocks/ui/ScriptStartBlock'
import { ScriptBlockAction } from '../../../features/ScriptBlocks/ui/ScriptBlockAction'
import { ScriptBlockCondition } from '../../../features/ScriptBlocks/ui/ScriptBlockCondition'
import { HEIGHT, MARGIN, WIDTH } from '../../../entites/Script/models/const'
import { ScriptConstructorBlock } from '../../../entites/Script/models/script'
import { ScriptAddBlock } from '../../../features/ScriptBlocks/ui/AddBlock'
import { connectLine } from '../../../shared/lib/helpers/canvasLine'
import { BigContainer, FAB } from '../../../shared/ui'
import { Home } from 'lucide-react'
import { IPoint } from '../../../shared/model/point'
import { useAddBlock } from '../lib/hooks/addBlock.hook'
import { getBeginBlocks } from '../../../entites/Script/lib/helpers/getBeginBlocks'

export const ScriptsConstructorPage = () => {

    const {addBlock} = useAddBlock()
    const canvas = useRef<HTMLCanvasElement>(null)
    const container = useRef<HTMLDivElement>(null)
    const [scriptBlocks, setScriptBlocks] = useState<ScriptConstructorBlock[]>([])
    const [move, setMove] = useState<IPoint>({x:0, y:0})
    const [script, setScript] = useState<Script>({
        blocks:[],
        system_name:"",
        name:""
    })

    const addBlockHandler = useCallback((indexes:number[]) => {
        addBlock(indexes, script.blocks, newBlocks=>{
            setScript(prev=>{
                return {...prev, blocks:newBlocks}
            })
        })
    },[script, addBlock])

    const editActivBlock = useCallback((block: ScriptConstructorBlock)=>{
        console.log(block)
    },[])

    const clear = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const moveHome = useCallback(()=>{
        setMove({x:widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), y:50})
    },[script])

    const getCords = useCallback((ctx:CanvasRenderingContext2D)=>{
        let scriptBlocks:ScriptConstructorBlock[] = getBeginBlocks(script.blocks)
        connectLine(ctx, {x:widthContainerCalculate(script.blocks) / 2, y: 50}, {x:widthContainerCalculate(script.blocks) / 2, y: 50 + HEIGHT + MARGIN})
        scriptBlocks = [...scriptBlocks, ...getCordsBlock(script.blocks, widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), 50 + (HEIGHT + MARGIN)*2, ctx)]
        setScriptBlocks(scriptBlocks)
    },[script, canvas.current])

    useEffect(()=>{
        let ctx = canvas.current?.getContext('2d')
        if(ctx)
            getCords(ctx)
        return ()=>{
            if(ctx && canvas.current)
                clear(ctx, canvas.current)
        }
    },[getCords, canvas.current])

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
                        return(<ScriptBlockAction data={{...item}} key={index} style={{left: item.x, top: item.y}} edit={()=>editActivBlock(item)}/>)
                    else if(item.type == ScriptBlockType.CONDITION)
                        return(<ScriptBlockCondition data={{...item}} key={index} style={{left: item.x, top: item.y}}/>)
                    else if(item.type == ScriptBlockType.ADD_BLOCK)
                        return(<ScriptAddBlock key={index} onClick={addBlockHandler} index={JSON.parse(item.command)} style={{left: item.x, top: item.y}}/>)
                })
            }
            </div>
            <FAB icon={<Home/>} onClick={moveHome}></FAB>
        </BigContainer>
    )
}