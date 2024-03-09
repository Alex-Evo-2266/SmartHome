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

export interface ScriptConstructorBlock{
    type: ScriptBlockType
    command: string
    branch1?: ScriptBlock[]
    branch2?: ScriptBlock[]
    x:number
    y:number
}

export interface Script{
    blocks: ScriptBlock[]
    system_name: string
    name: string
}
