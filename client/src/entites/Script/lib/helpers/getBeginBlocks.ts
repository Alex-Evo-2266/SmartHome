import { ScriptBlock, ScriptBlockType, widthContainerCalculate } from "../..";
import { HEIGHT, MARGIN, WIDTH } from "../../models/const";
import { ScriptConstructorBlock } from "../../models/script";

export const getBeginBlocks = (blocks: ScriptBlock[]):ScriptConstructorBlock[] => ([{
    command: "start",
    type: ScriptBlockType.START,
    x: widthContainerCalculate(blocks) / 2 - (WIDTH / 2),
    y: 50
},{
    command: JSON.stringify([0]),
    type: ScriptBlockType.ADD_BLOCK,
    x: widthContainerCalculate(blocks) / 2 - 20,
    y: 50 + HEIGHT + MARGIN
}])