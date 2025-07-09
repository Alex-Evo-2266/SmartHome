export  enum TypeScriptNode {
    TRIGGER = "trigger",
	CONDITION = 'condition',
    ACTION = 'action',
    Start = 'start'
}

export interface ScriptCreate{
    id?: string
    name: string
    description: string
    nods: ScriptNode[]
    edgs: ScriptEdge[]
}

export interface ScriptNode{
    id: string
    type: TypeScriptNode
    expression: string
    description?: string
    x: number
    y: number
}

export interface ScriptEdge{
    id?: string
    id_start: string
    id_end: string
    condition_label?: string
}

export interface Node{
    id:string
    type: TypeScriptNode
    expression: string
    description?: string
    x: number
    y: number
}

export interface Edge{
    id:string
    id_start: string
    id_end: string
    condition_label: string
}

export interface Script{
    id: string
    name: string
    description: string
    is_active: boolean
    created_at: string
    updated_at: string
    nods:Node[]
    edgs:Edge[]
}

export interface ScriptList{
    scripts: Script[]
}