import { ScriptBlock, ScriptBlockType } from "../.."
import { HEIGHT, WIDTH } from "../../models/const"

// export const widthCalculate = (data: ScriptBlock[]) => {
//     let level = 1
//     let level1 = 1
//     let level2 = 1
//     for(let item of data){
//         if(item.branch1)
//             level1 += widthCalculate(item.branch1)
//         if(item.branch2)
//             level2 += widthCalculate(item.branch2)
//         if(level < level1 || level < level2)
//             level = (level1 > level2)?level1:level2
//         level2 = 1
//         level1 = 1
//     }
//     return level
// }

export const widthCalculate = (data: ScriptBlock[] | undefined) => {
    if(!data)
        return 0
    let k = 1;
    let left = 0
    let right = 0
    for (const item of data) {
        if(item.type === ScriptBlockType.CONDITION)
        {
            let branch1 = widthCalculate(item.branch1)
            let branch2 = widthCalculate(item.branch2)
            left = (left < branch1)?branch1:left
            right = (right < branch2)?branch2:right
        }
    }
    return k + left + right
}

export const widthContainerCalculate = (data: ScriptBlock[]) => {
    return (widthCalculate(data) * WIDTH * 2 - WIDTH + 40) * 2
}

export const getCenterCordX = (blocks:ScriptBlock[], widthBlock: number)=>{
    return (widthCalculate(blocks) * widthBlock / 2) - (widthBlock / 2)
}

export function getPageY(y:number)
{
    let container = document.getElementById("scripts-constructor-page")
    return y + (container?.scrollTop ?? 0)
}

export function getPageX(x:number)
{
    let container = document.getElementById("scripts-constructor-page")
    return x + (container?.scrollLeft ?? 0)
}

export function getCenter(element: Element){
    let data = element.getBoundingClientRect()
    return{x:getPageX(data.x) + data.width / 10, y: getPageY(data.y) + HEIGHT - 10}
}

export const getHeight = (blocks: ScriptBlock[] = []) => {
    let count = 1
    let count1 = 1
    let count2 = 1
    for(let item of blocks){
        if (item.type == ScriptBlockType.CONDITION){
            count1 = getHeight(item.branch1)
            count2 = getHeight(item.branch2)
            count += (count1 > count2)?count1:count2
            count += 3
        }
        else{
            count += 1
        }
    }
    return count * 2
}