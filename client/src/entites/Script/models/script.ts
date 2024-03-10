export enum ScriptBlockType{
    ACTION = "action",
    CONDITION = "condition",
    START = "start",
    ADD_BLOCK = "add_block"
}

export interface ScriptBlock{
    type: ScriptBlockType
    command: string
    branch1?: ScriptBlock[]
    branch2?: ScriptBlock[]
}

export interface ScriptConstructorBlockAction{
    type: ScriptBlockType.ACTION | ScriptBlockType.CONDITION
    command: string
    branch1?: ScriptBlock[]
    branch2?: ScriptBlock[]
    x:number
    y:number
    index: number[]
}

export interface ScriptConstructorBlockDeco{
    type: ScriptBlockType.ADD_BLOCK | ScriptBlockType.START
    command: string
    branch1?: ScriptBlock[]
    branch2?: ScriptBlock[]
    x:number
    y:number
}

export type ScriptConstructorBlock = ScriptConstructorBlockAction | ScriptConstructorBlockDeco

export interface Script{
    blocks: ScriptBlock[]
    system_name: string
    name: string
}
