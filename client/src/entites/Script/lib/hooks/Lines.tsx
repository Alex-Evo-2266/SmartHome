import { useCallback, useEffect, useRef, useState } from "react"
import { connectLine } from "../../../../shared/lib/helpers/canvasLine"
import { IPoint } from "../../../../shared/model/point"

export enum PointPoz{
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right",
}

export enum PointVerticalPoz{
    TOP = "top",
    BOTTOM = "bottom"
}


interface ICanvasParam{
    width: string
    height: string
    widthPix: number
    heightPix: number
}

interface IOption{
   left?: string
   top?: string
   begin?: IPoint
   beginPointPoz?: PointPoz
   endPointPoz?: PointPoz
   text?: string
}

export const useLinesСanvas = ({left="0px", top="0px", begin=undefined, beginPointPoz=undefined, text="", endPointPoz=undefined}:IOption) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const [canvasParam, setCanvasParam] = useState<ICanvasParam>({width:"0px", height:"0px", widthPix:0, heightPix:0})
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    const getCords = (x:number, width: number, y:number, height: number, containerX: number, containerY: number):IPoint => {
        return {x:((x - containerX) + width / 2), y:((y - containerY) + height / 2)}
    }

    const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const clear = useCallback(() => {
        let ctx = canvas.current?.getContext('2d')
        if(ctx && canvas.current)
            clearCanvas(ctx, canvas.current)
    },[connectLine, canvas.current, canvasParam])

    const getPoint = (beginPointPoz: PointPoz, container: HTMLDivElement, verticalPoz: PointVerticalPoz = PointVerticalPoz.TOP):IPoint => {
        let dataContainer = container.getBoundingClientRect()
        let vPoz = (verticalPoz === PointVerticalPoz.BOTTOM)?dataContainer.height:0
        if (beginPointPoz === PointPoz.CENTER)
            return {x:dataContainer.width / 2, y: vPoz}
        else if (beginPointPoz === PointPoz.LEFT)
            return {x: 0, y: vPoz}
        else 
            return {x: dataContainer.width, y:vPoz}
    }

    const linePrint = useCallback((ctx:CanvasRenderingContext2D)=>{
        if (!container)
            return
        let arr = container.children
        let dataContainer = container.getBoundingClientRect()
        let array = [...arr]
        if(begin && array.length > 0)
        {
            const data1 = array[0].getBoundingClientRect()
            connectLine(
                ctx, 
                begin,
                getCords(data1.x, data1.width, data1.y, data1.height, dataContainer.x, dataContainer.y),
                text
            )
        }
        else if(beginPointPoz && array.length > 0)
        {
            const data1 = array[0].getBoundingClientRect()
            connectLine(
                ctx, 
                getPoint(beginPointPoz, container),
                getCords(data1.x, data1.width, data1.y, data1.height, dataContainer.x, dataContainer.y),
                text
            )
        }
        for (let index = 1; index < array.length; index++) {
            const data1 = array[index-1].getBoundingClientRect()
            const data2 = array[index].getBoundingClientRect()
            const stage: HTMLElement = array[index-1] as HTMLElement;
            if(!(["condition-container", "condition"] as (string | undefined)[]).includes(stage.dataset.type))
                connectLine(
                    ctx, 
                    getCords(data1.x, data1.width, data1.y, data1.height, dataContainer.x, dataContainer.y),
                    getCords(data2.x, data2.width, data2.y, data2.height, dataContainer.x, dataContainer.y)
                )
        }
        if(endPointPoz && array.length > 0)
        {
            const data1 = array[array.length - 1].getBoundingClientRect()
            connectLine(
                ctx, 
                getCords(data1.x, data1.width, data1.y, data1.height, dataContainer.x, dataContainer.y),
                getPoint(endPointPoz, container, PointVerticalPoz.BOTTOM)
            )
        }
    },[canvas.current, container])

    const update = useCallback((container:HTMLDivElement) => {
        if (!container || !canvas.current)
            return
        setContainer(container)
        setCanvasParam({width: container.offsetWidth + "px", height: container.offsetHeight + "px", heightPix: container.offsetHeight, widthPix: container.offsetWidth})
    },[canvas.current])

    const printLine = useCallback((point1: IPoint, point2: IPoint)=>{
        let ctx = canvas.current?.getContext('2d')
        if(ctx)
            connectLine(ctx, point1, point2)
    },[connectLine, canvas.current, canvasParam])

    useEffect(()=>{
        let ctx = canvas.current?.getContext('2d')
        if(ctx)
            linePrint(ctx)
        return ()=>{
            if(ctx && canvas.current)
                clearCanvas(ctx, canvas.current)
        }
    },[linePrint, canvas.current, canvasParam])

    const Canvas = ()=>(
        <canvas 
            ref={canvas} 
            width={canvasParam.widthPix}
            height={canvasParam.heightPix}
            style={{height:canvasParam.height, width: canvasParam.width, position: "absolute", left: left, top: top}}
        />
    )

    return {Canvas, update, printLine, clear}
}