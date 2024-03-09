import { connectLine } from "../../../../shared/lib/helpers/canvasLine"
import { IPoint } from "../../../../shared/model/point"
import { HEIGHT, MARGIN, MARGINCONDITION, MARGINLR, WIDTH } from "../../models/const"
import { ScriptBlock, ScriptBlockType, ScriptConstructorBlock } from "../../models/script"

const getCordLastElement = (blocks: ScriptConstructorBlock[], def: IPoint) => {
    if(blocks.length == 0)
        return def
    return {x:blocks[blocks.length - 1].x + 20, y:blocks[blocks.length - 1].y + 20}
}

// export const blocksLinckLinePrint = (blocks:ScriptBlock[] | undefined, startX: number, startY:number, ctx:CanvasRenderingContext2D, indexes:number[] = [])=>{
// }

const getWidth = (scriptBlocks: ScriptBlock[] | undefined) => {
    if(!scriptBlocks)
        return 0
    let k = 1;
    let left = 0
    let right = 0
    for (const item of scriptBlocks) {
        
        if(item.type === ScriptBlockType.CONDITION)
        {
            let branch1 = getWidth(item.branch1)
            let branch2 = getWidth(item.branch2)
            left = (left < branch1)?branch1:left
            right = (right < branch2)?branch2:right
        }
    }
    return k + left + right
}

export const getCordsBlock = (blocks:ScriptBlock[] | undefined, startX: number, startY:number, ctx:CanvasRenderingContext2D, indexes:number[] = [])=>{
    if (!blocks)
        return []
    let scriptBlocks:ScriptConstructorBlock[] = []
    let index = 0
    // console.log(JSON.stringify([...indexes, 0]))
    // if(blocks.length == 0)
    // {
    //     connectLine(ctx, {x:startX + WIDTH / 2, y: startY + 20 + ((index - 1) * (HEIGHT + MARGIN))}, {x:startX + WIDTH / 2, y: startY + 20 + (index * (HEIGHT + MARGIN))})
    //     return [{x: startX + WIDTH / 2 - 20, y: startY + (index * (HEIGHT + MARGIN)), command: JSON.stringify([...indexes, 0]), type: ScriptBlockType.ADD_BLOCK}]
    // }
    for(let i = 0; i < blocks.length; i++)
    {
        let item = blocks[i]
        scriptBlocks.push({x: startX, y: startY + (index * (HEIGHT + MARGIN)), command: item.command, type: item.type, branch1: item.branch1, branch2: item.branch2})
        connectLine(ctx, {x:startX + WIDTH / 2, y: startY + 20 + ((index - 1) * (HEIGHT + MARGIN))}, {x:startX + WIDTH / 2, y: startY + 20 + (index * (HEIGHT + MARGIN))})
        index += 1
        if(item.type === ScriptBlockType.CONDITION)
        {
            let delta1 = getWidth(item.branch1)
            delta1 = (delta1 === 0)?(WIDTH + MARGINLR):delta1 * (WIDTH + MARGINLR)
            let delta2 = getWidth(item.branch2)
            delta2 = (delta2 === 0)?(WIDTH + MARGINLR):delta2 * (WIDTH + MARGINLR)
            connectLine(ctx, {x:startX + WIDTH / 2, y: startY + 20 + ((index - 1) * (HEIGHT + MARGIN))}, {x:startX + WIDTH / 2, y: startY + 20 + (index * (HEIGHT + MARGIN))})
            connectLine(ctx, {x:startX + WIDTH / 2, y: startY + (index * (HEIGHT + MARGIN))}, {x:startX - delta1 + WIDTH / 2, y: startY + ((index + 1) * (HEIGHT + MARGIN))}, "yes")
            connectLine(ctx, {x:startX + WIDTH / 2, y: startY + (index * (HEIGHT + MARGIN))}, {x:startX + delta2 + WIDTH / 2, y: startY + ((index + 1) * (HEIGHT + MARGIN))}, "no")
            index += 1
            console.log(getWidth(item.branch1))
            scriptBlocks.push({x: startX - delta1 + WIDTH / 2 - 20, y: startY + (index * (HEIGHT + MARGIN)), command: JSON.stringify([...indexes, i, 1, 0]), type: ScriptBlockType.ADD_BLOCK})
            scriptBlocks.push({x: startX + delta2 + WIDTH / 2 - 20, y: startY + (index * (HEIGHT + MARGIN)), command: JSON.stringify([...indexes, i, 2, 0]), type: ScriptBlockType.ADD_BLOCK})
            let branch1 = getCordsBlock(item.branch1, startX - delta1, startY + ((index + 1) * (HEIGHT + MARGIN)), ctx, [...indexes, i, 1])
            let branch2 = getCordsBlock(item.branch2, startX + delta2, startY + ((index + 1) * (HEIGHT + MARGIN)), ctx, [...indexes, i, 2])
            scriptBlocks = [...scriptBlocks, ...branch1]
            scriptBlocks = [...scriptBlocks, ...branch2]
            let newIndex = 0
            if (branch1.length > branch2.length)
                newIndex += branch1.length
                else
                newIndex += branch2.length
            connectLine(ctx, getCordLastElement(branch1, {x:startX - WIDTH / 2 - MARGINLR, y:startY + (index * (HEIGHT + MARGIN))}), {x:startX + WIDTH / 2, y: startY + ((index + newIndex + 1) * (HEIGHT + MARGIN))})
            connectLine(ctx, getCordLastElement(branch2, {x:startX + (WIDTH) * 2 + MARGINLR - WIDTH / 2, y:startY + (index * (HEIGHT + MARGIN))}), {x:startX + WIDTH / 2, y: startY + ((index + newIndex + 1) * (HEIGHT + MARGIN))})
            index += newIndex + 1
            scriptBlocks.push({x: startX + WIDTH / 2 - 20, y: startY + (index * (HEIGHT + MARGIN)), command: JSON.stringify([...indexes, i + 1]), type: ScriptBlockType.ADD_BLOCK})
        }
        else
        {
            scriptBlocks.push({x: startX + WIDTH / 2 - 20, y: startY + (index * (HEIGHT + MARGIN)), command: JSON.stringify([...indexes, i + 1]), type: ScriptBlockType.ADD_BLOCK})
            connectLine(ctx, {x:startX + WIDTH / 2, y: startY + 20 + ((index - 1) * (HEIGHT + MARGIN))}, {x:startX + WIDTH / 2, y: startY + 20 + (index * (HEIGHT + MARGIN))})
        }
        index += 1
    }
    return scriptBlocks
}