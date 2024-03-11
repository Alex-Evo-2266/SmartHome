import './ScriptsConstructor.scss'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Script, ScriptBlockType, getHeight, widthContainerCalculate } from '../../../entites/Script'
import { ScriptStartBlock } from '../../../features/ScriptBlocks/ui/ScriptStartBlock'
import { ScriptBlockAction } from '../../../features/ScriptBlocks/ui/ScriptBlockAction'
import { ScriptBlockCondition } from '../../../features/ScriptBlocks/ui/ScriptBlockCondition'
import { HEIGHT, MARGIN, WIDTH } from '../../../entites/Script/models/const'
import { ScriptBlock } from '../../../entites/Script/models/script'
import { ScriptAddBlock } from '../../../features/ScriptBlocks/ui/AddBlock'
import { connectLine } from '../../../shared/lib/helpers/canvasLine'
import { BigContainer, FAB } from '../../../shared/ui'
import { Home } from 'lucide-react'
import { IPoint } from '../../../shared/model/point'
import { useAddBlock } from '../../../entites/Script/lib/hooks/addBlock.hook'
import { useLinesСanvas } from '../../../entites/Script'

interface ICanvasParam{
    width: string
    height: string
    widthPix: number
    heightPix: number
}

export const ScriptsConstructorPage = () => {

    const {addBlock} = useAddBlock()
    const canvas = useRef<HTMLCanvasElement>(null)
    const [canvasParam, setCanvasParam] = useState<ICanvasParam>({width:"0px", height:"0px", widthPix:0, heightPix:0})
    const {Canvas, update, printLine} = useLinesСanvas({})
    const container = useRef<HTMLDivElement>(null)
    const [move, setMove] = useState<IPoint>({x:0, y:0})
    const [script, setScript] = useState<Script>({
        blocks:[],
        system_name:"",
        name:""
    })

    const addBlockHandler = useCallback((index:number) => {
        addBlock(index, script.blocks, newBlocks=>{
            setScript(prev=>{
                return {...prev, blocks:newBlocks}
            })
        })
    },[script, addBlock])

    const editBlockHandler = useCallback((index:number, data: ScriptBlock) => {
        let arr = script.blocks.slice()
        arr[index] = data
        setScript(prev=>({...prev, blocks:arr}))
    },[script])

    // const editActivBlock = useCallback((block: ScriptConstructorBlock)=>{
    //     console.log(block)
    // },[])

    // const clear = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height)
    // }

    const moveHome = useCallback(()=>{
        setMove({x:widthContainerCalculate(script.blocks) / 2 - (WIDTH / 2), y:50})
    },[script])

    // const getCords = (x:number, width: number, y:number, height: number, containerX: number, containerY: number):IPoint => {
    //     return {x:((x - containerX) + width / 2), y:((y - containerY) + height / 2)}
    // }

    // const linePrint = useCallback((ctx:CanvasRenderingContext2D)=>{
    //     if (!container.current)
    //         return
    //     let arr = container.current.children
    //     let dataContainer = container.current.getBoundingClientRect()
    //     let array = [...arr]
    //     for (let index = 1; index < array.length; index++) {
    //         let data1 = array[index-1].getBoundingClientRect()
    //         let data2 = array[index].getBoundingClientRect()
    //         if(!["condition-container", "condition"].includes(array[index-1].dataset?.type))
    //             connectLine(
    //                 ctx, 
    //                 getCords(data1.x, data1.width, data1.y, data1.height, dataContainer.x, dataContainer.y),
    //                 getCords(data2.x, data2.width, data2.y, data2.height, dataContainer.x, dataContainer.y)
    //             )
    //     }
    // },[canvas.current, container.current])

    // useEffect(()=>{
    //     let ctx = canvas.current?.getContext('2d')
    //     if(ctx)
    //         linePrint(ctx)
    //     return ()=>{
    //         if(ctx && canvas.current)
    //             clear(ctx, canvas.current)
    //     }
    // },[linePrint, canvas.current, canvasParam])

//     <canvas 
//     ref={canvas} 
//     width={canvasParam.widthPix}
//     height={canvasParam.heightPix}
//     style={{height:canvasParam.height, width: canvasParam.width}}
//     id='scripts-constructor-canvas' 
// />

    useEffect(()=>{
        if(container.current)
            update(container.current)
        
        // if (!container.current || !canvas.current || !script)
        //     return
        // canvas.current.width = container.current.offsetWidth
        // canvas.current.style.width = container.current.offsetWidth + "px"
        // canvas.current.height = container.current.offsetHeight
        // canvas.current.style.height = container.current.offsetHeight + "px"
        // setCanvasParam({width: container.current.offsetWidth + "px", height: container.current.offsetHeight + "px", heightPix: container.current.offsetHeight, widthPix: container.current.offsetWidth})
    },[container.current, canvas.current, script])

    useEffect(()=>{
        console.log(script)
    },[script])

    return(
        <BigContainer id="scripts-constructor-page" pozMove={move}>
            <Canvas/>
            <div ref={container} 
                id='scripts-constructor-container' 
            >
                <ScriptStartBlock/>
                <ScriptAddBlock onClick={addBlockHandler} index={0} />
            {
                script.blocks.map((item, index)=>{
                    if(item.type == ScriptBlockType.ACTION)
                        return(
                        <Fragment key={index}>
                            <ScriptBlockAction data={{...item}}/>
                            <ScriptAddBlock onClick={addBlockHandler} index={index + 1} />
                        </Fragment>
                        )
                    else if(item.type == ScriptBlockType.CONDITION)
                        return(
                        <Fragment key={index}>
                            <ScriptBlockCondition edit={newData=>editBlockHandler(index, newData)} data={{...item}}/>
                            <ScriptAddBlock onClick={addBlockHandler} index={index + 1} />
                        </Fragment>
                        )
                })
            }
            </div>
            <FAB icon={<Home/>} onClick={moveHome}></FAB>
        </BigContainer>
    )
}